"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { proposePactAction } from "@/app/dashboard/pacts/actions";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { pactsContractAddress, pactsContractAbi } from "@/lib/pacts-contract";
import { parseEther, stringToBytes, bytesToHex } from "viem";
import { toast } from "sonner";

const formSchema = z.object({
  partnerEmail: z.string().email(),
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  description: z.string().max(1000).optional(),
  stakeAmount: z.coerce.number().min(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreatePactForm({
  setOpen,
  prefilledPartnerEmail,
}: {
  setOpen: (open: boolean) => void;
  prefilledPartnerEmail?: string;
}) {
  const [dbPending, startDbTransition] = useTransition();
  const { data: txHash, writeContract, isPending: isWriting, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({ hash: txHash });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partnerEmail: prefilledPartnerEmail || "",
      title: "",
      description: "",
      stakeAmount: 0,
    },
  });

  async function processForm(values: FormValues) {
    startDbTransition(async () => {
      const result = await proposePactAction(values);
      if (!result.success || !result.pact || !result.partnerWalletAddress) {
        toast.error("Failed to Propose Pact", { description: result.error });
        return;
      }

      const pactIdBytes32 = bytesToHex(stringToBytes(result.pact._id.padEnd(32, '\0')));
      writeContract({
        address: pactsContractAddress,
        abi: pactsContractAbi,
        functionName: 'proposePact',
        args: [pactIdBytes32, result.partnerWalletAddress as `0x${string}`],
        value: values.stakeAmount ? parseEther(values.stakeAmount.toString()) : parseEther("0"),
      });
    });
  }

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Pact Proposed On-Chain!", { description: "Your proposal has been sent to the partner for acceptance." });
      setOpen(false);
    }
  }, [isConfirmed, setOpen]);

  useEffect(() => {
    const txError = writeError || confirmError;
    if (txError) {
      toast.error("Transaction Failed", { description: txError.shortMessage });
    }
  }, [writeError, confirmError]);

  const isLoading = dbPending || isWriting || isConfirming;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processForm)} className="space-y-6">
        <FormField
          control={form.control}
          name="partnerEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Partner's Email</FormLabel>
              <FormControl>
                <Input placeholder="partner@example.com" {...field} disabled={!!prefilledPartnerEmail} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pact Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Build Next.js Landing Page" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Define the scope of work, deliverables, and timeline..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stakeAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Stake (Project Budget in ETH)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00 ETH" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {dbPending ? "Verifying Partner..." : isWriting ? "Confirm in Wallet..." : isConfirming ? "Proposing On-Chain..." : "Propose Pact"}
        </Button>
      </form>
    </Form>
  );
}
