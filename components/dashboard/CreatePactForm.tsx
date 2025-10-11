"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { proposePactAction } from "@/app/dashboard/pacts/actions";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { pactsContractAddress, pactsContractAbi } from "@/lib/pacts-contract";
import { parseEther, stringToBytes, bytesToHex } from "viem";

const formSchema = z.object({
  partnerEmail: z.string().email("Please enter a valid email address."),
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  description: z.string().max(1000).optional(),
  stakeAmount: z.coerce.number().min(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreatePactForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const [dbPending, startDbTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  // --- The Correct Two-Phase Pattern ---
  const { data: txHash, writeContract, isPending: isWriting, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({ hash: txHash });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { partnerEmail: "", title: "", description: "", stakeAmount: 0 },
  });

  async function processForm(values: FormValues) {
    setError(null);
    startDbTransition(async () => {
      const result = await proposePactAction(values);
      if (!result.success || !result.pact || !result.partnerWalletAddress) {
        setError(result.error || "Failed to create pact.");
        return;
      }

      const pactIdBytes32 = bytesToHex(stringToBytes(result.pact._id.padEnd(32, '\0')));
      
      // Phase 1: Initiate the on-chain transaction
      writeContract({
        address: pactsContractAddress,
        abi: pactsContractAbi,
        functionName: 'proposePact',
        args: [pactIdBytes32, result.partnerWalletAddress as `0x${string}`],
        value: values.stakeAmount ? parseEther(values.stakeAmount.toString()) : parseEther("0"),
      });
    });
  }

  // Phase 2: Wait for confirmation, then close the dialog
  useEffect(() => {
    if (isConfirmed) {
      setOpen(false);
    }
  }, [isConfirmed, setOpen]);

  useEffect(() => {
    if (writeError) setError(writeError.shortMessage || "An error occurred.");
    else if (confirmError) setError("Transaction confirmation failed.");
  }, [writeError, confirmError]);

  const isLoading = dbPending || isWriting || isConfirming;

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(processForm)} className="space-y-6">
            <FormField control={form.control} name="partnerEmail" render={({ field }) => ( <FormItem><FormLabel>Partner's Email</FormLabel><FormControl><Input placeholder="partner@example.com" {...field} /></FormControl><FormMessage /></FormItem> )}/>
            <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Pact Title</FormLabel><FormControl><Input placeholder="e.g., Final Year Project Collaboration" {...field} /></FormControl><FormMessage /></FormItem> )}/>
            <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Define the terms of the agreement..." {...field} /></FormControl><FormMessage /></FormItem> )}/>
            <FormField control={form.control} name="stakeAmount" render={({ field }) => ( <FormItem><FormLabel>Your Stake (Optional)</FormLabel><FormControl><Input type="number" placeholder="0.00 ETH" {...field} /></FormControl><FormMessage /></FormItem> )}/>
            
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {dbPending ? "Verifying user..." : isWriting ? "Confirm in wallet..." : isConfirming ? "Proposing on-chain..." : "Propose Pact On-Chain"}
            </Button>
        </form>
    </Form>
  );
}