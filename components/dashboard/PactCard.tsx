"use client";

import { useTransition, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, stringToBytes, bytesToHex } from "viem";
import { pactsContractAddress, pactsContractAbi } from "@/lib/pacts-contract";
import { acceptPactOffChain, rejectPactAction } from "@/app/dashboard/pacts/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2, Zap, FileText, Check, X, AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export type Pact = {
  _id: string; creatorId: string; partnerId: string; title: string; description?: string; type: 'task' | 'financial';
  status: 'pending' | 'active' | 'completed' | 'failed' | 'rejected'; stakeAmount?: number;
};

export function PactCard({ pact }: { pact: Pact }) {
  const { user } = useUser();
  
  // All dnd-kit related hooks have been COMPLETELY REMOVED.
  
  const { data: txHash, writeContract, isPending: isWriting, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({ hash: txHash });
  const [isDbPending, startDbTransition] = useTransition();
  const [localError, setLocalError] = useState<string | null>(null);

  const isPartner = user?.id === pact.partnerId;
  const isPendingInvitation = isPartner && pact.status === 'pending';

  const handleAcceptPact = () => {
    setLocalError(null);
    const pactIdBytes32 = bytesToHex(stringToBytes(pact._id.padEnd(32, '\0')));

    writeContract({
      address: pactsContractAddress,
      abi: pactsContractAbi,
      functionName: 'acceptPact',
      args: [pactIdBytes32],
      value: pact.stakeAmount ? parseEther(pact.stakeAmount.toString()) : parseEther("0"),
    });
  };
  
  const handleRejectPact = () => {
    startDbTransition(async () => {
        const result = await rejectPactAction(pact._id);
        if(!result.success){
            setLocalError(result.error || "Failed to reject pact.");
        }
    });
  };

  useEffect(() => {
    if (isConfirmed && txHash) {
      startDbTransition(async () => {
        const result = await acceptPactOffChain(pact._id, txHash);
        if (!result.success) { setLocalError(result.error || "Failed to update pact in database."); }
      });
    }
  }, [isConfirmed, txHash, pact._id]);

  useEffect(() => {
    if (writeError) setLocalError(writeError.shortMessage || "An error occurred.");
    else if (confirmError) setLocalError("Transaction confirmation failed.");
  }, [writeError, confirmError]);
  
  const isLoading = isWriting || isConfirming || isDbPending;
  const isStaked = pact.stakeAmount && pact.stakeAmount > 0;
  const statusColors = {
    pending: "border-l-blue-400", active: "border-l-orange-400",
    completed: "border-l-green-400", failed: "border-l-red-400",
    rejected: "border-l-gray-500",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cn("bg-slate-800/50 rounded-lg p-4 border border-slate-700 border-l-4 relative group", statusColors[pact.status])}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-slate-800 h-12 w-12 flex items-center justify-center rounded-lg"><FileText className="h-6 w-6 text-blue-400" /></div>
            <div>
                <h3 className="text-xl font-bold text-white">{pact.title}</h3>
                <p className="text-xs text-neutral-400 capitalize">{pact.status.replace('_', ' ')}</p>
            </div>
        </div>
        {isStaked && ( <div className="flex items-center font-semibold text-purple-400 text-sm"><Zap className="h-4 w-4 mr-1.5" /> {pact.stakeAmount} ETH Stake</div> )}
      </div>

      {pact.description && <p className="text-neutral-300 mb-4">{pact.description}</p>}

      {isPendingInvitation && (
        <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-sm text-center text-blue-300 mb-4">You have been invited to join this pact.</p>
            <div className="grid grid-cols-2 gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="bg-red-900/50 border-red-700 text-red-300 hover:bg-red-900 hover:text-red-200" disabled={isLoading}><X className="mr-2 h-4 w-4" /> Reject</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center"><AlertTriangle className="text-yellow-400 mr-2" />Confirm Rejection</AlertDialogTitle>
                    <AlertDialogDescription className="text-neutral-400">Are you sure you want to reject this pact invitation? This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRejectPact} className="bg-red-600 hover:bg-red-700">Confirm Rejection</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button className="bg-blue-500 hover:bg-blue-600" disabled={isLoading} onClick={handleAcceptPact}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isWriting ? "Confirm in wallet..." : isConfirming ? "Accepting on-chain..." : isDbPending ? "Finalizing..." : <><Check className="mr-2 h-4 w-4" /> Accept</>}
              </Button>
            </div>
            {localError && <p className="text-xs text-red-500 mt-2 text-center">Error: {localError}</p>}
        </div>
      )}
    </motion.div>
  );
}