"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Target, Clock, Zap, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { createGoalAction } from "@/app/dashboard/goals/actions";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }).max(100),
  description: z.string().max(500).optional(),
  deadline: z.date().optional(),
  stakeAmount: z.coerce.number().min(0).optional(),
  forfeitAddress: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
    { id: 1, title: "Define", icon: <Target className="h-5 w-5" />, fields: ["title", "description"] },
    { id: 2, title: "Timeline", icon: <Clock className="h-5 w-5" />, fields: ["deadline"] },
    { id: 3, title: "Stake", icon: <Zap className="h-5 w-5" />, fields: ["stakeAmount", "forfeitAddress"] },
];

export function CreateGoalForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", stakeAmount: 0, forfeitAddress: "" },
  });

  const stakeAmountValue = useWatch({ control: form.control, name: "stakeAmount" });

  async function processForm(values: FormValues) {
    setError(null);
    startTransition(async () => {
      const result = await createGoalAction(values);
      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error || "An unknown error occurred.");
      }
    });
  }

  type FieldName = keyof FormValues;
  const next = async () => {
    const fields = steps[currentStep - 1].fields as FieldName[];
    const output = await form.trigger(fields, { shouldFocus: true });
    if (!output) return;
    if (currentStep < steps.length) setCurrentStep(step => step + 1);
  };
  const prev = () => { if (currentStep > 1) setCurrentStep(step => step - 1); };

  return (
    <div className="p-1">
        <div className="flex items-center justify-between mb-8 p-1 bg-slate-800 rounded-full border border-slate-700">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                    <div className={cn("flex items-center justify-center h-8 w-8 rounded-full transition-colors", currentStep > index ? "bg-orange-500" : "bg-slate-700")}>
                        {currentStep > index ? <Check className="h-5 w-5 text-white" /> : step.icon}
                    </div>
                    <span className={cn(currentStep > index ? "text-white" : "text-neutral-400")}>{step.title}</span>
                </div>
            ))}
        </div>

        <Form {...form}>
        <form onSubmit={form.handleSubmit(processForm)} className="min-h-[350px]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                >
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem><FormLabel className="text-base">Goal Title</FormLabel><FormControl><Input className="text-base py-6" placeholder="e.g., Deploy the production server" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem><FormLabel className="text-base">Description (Optional)</FormLabel><FormControl><Textarea placeholder="Add more context and key results..." {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                    )}
                    {currentStep === 2 && (
                        <FormField control={form.control} name="deadline" render={({ field }) => (
                            <FormItem className="flex flex-col items-center"><FormControl><div className="dark p-1 bg-slate-800 rounded-md border border-slate-700"><Calendar mode="single" selected={field.value} onSelect={field.onChange} className="p-0" /></div></FormControl><FormMessage className="mt-2"/></FormItem>
                        )}/>
                    )}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-center">Raise the Stakes (Optional)</h3>
                            <FormField control={form.control} name="stakeAmount" render={({ field }) => (
                                <FormItem><FormLabel>Stake Amount (in MATIC)</FormLabel><FormControl><div className="relative w-full"><Input type="number" placeholder="0.00" className="text-xl h-auto text-center py-3 pl-10 pr-4 bg-slate-800 border-slate-700" {...field} /><span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-orange-400">⧫</span></div></FormControl><FormMessage className="text-center mt-2"/></FormItem>
                            )}/>
                             {stakeAmountValue && stakeAmountValue > 0 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <FormField control={form.control} name="forfeitAddress" render={({ field }) => (
                                        <FormItem><FormLabel>Forfeit Address</FormLabel><FormControl><Input placeholder="0x... (Where stake goes on failure)" {...field} /></FormControl><FormDescription className="text-xs">If you fail, your stake will be sent to this address.</FormDescription><FormMessage /></FormItem>
                                    )}/>
                                </motion.div>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
            {error && <p className="text-sm font-medium text-red-500 text-center mt-4">{error}</p>}
        </form>
        </Form>

        <div className="mt-8 pt-6 border-t border-slate-700 flex justify-between">
            <Button type="button" variant="ghost" onClick={prev} disabled={currentStep === 1 || isPending}>Back</Button>
            {currentStep < steps.length ? (
                <Button type="button" onClick={next} className="bg-orange-500 hover:bg-orange-600">Next Step</Button>
            ) : (
                <Button type="button" onClick={form.handleSubmit(processForm)} disabled={isPending} className="bg-green-600 hover:bg-green-700">
                    {isPending ? <Loader2 className="animate-spin" /> : "Commit to Goal"}
                </Button>
            )}
        </div>
    </div>
  );
}
