"use client";

import { useTransition, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, stringToBytes, bytesToHex } from "viem";
import { pactsContractAddress, pactsContractAbi } from "@/lib/pacts-contract";
import {
  acceptPactOffChain,
  updatePactCompletionStatus,
  confirmCompletionOffChain,
  requestRevisionOffChain
} from "@/app/dashboard/pacts/actions";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Loader2, Zap, FileText, Check, Send, ThumbsUp, ThumbsDown, X, RefreshCw, MessageSquare, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChatBox } from "./ChatBox";
import { FileSubmissionForm } from "./FileSubmissionForm";
import { downloadSubmittedWork } from "@/app/dashboard/pacts/actions/download-file-action";

export type Pact = {
  _id: string;
  creatorId: string;
  partnerId: string;
  title: string;
  description?: string;
  status: 'pending' | 'active' | 'pending_confirmation' | 'completed' | 'failed' | 'rejected';
  stakeAmount?: number;
  rejectionCount: number;
  submission?: {
      filePath: string;
      fileName: string;
      submittedAt: Date;
      viewedBy?: string;
  };
};

export function PactCard({ pact }: { pact: Pact }) {
  const { user } = useUser();
  const [isDbPending, startDbTransition] = useTransition();
  const [localError, setLocalError] = useState<string | null>(null);
  
  const { data: txHash, writeContract, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, error: confirmError } = useWaitForTransactionReceipt({ hash: txHash });

  const [lastOnChainAction, setLastOnChainAction] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const isUserCreator = user?.id === pact.creatorId;
  const isUserPartner = user?.id === pact.partnerId;

  const handleOnChainAction = (functionName: string, args: any[] = [], value: bigint = 0n) => {
    setLocalError(null);
    setLastOnChainAction(functionName);
    writeContract({
      address: pactsContractAddress,
      abi: pactsContractAbi,
      functionName,
      args,
      value
    });
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
        const response = await fetch(`/api/download/${pact._id}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }
        
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = pact.submission?.fileName || 'submission';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert("File downloaded successfully. This counts as the single view.");
        
    } catch (err) {
        setLocalError(err.message || "Failed to download file.");
    } finally {
        setIsDownloading(false);
    }
  };
  
  useEffect(() => {
    if (isSuccess && lastOnChainAction) {
      startDbTransition(async () => {
        let result;
        if (lastOnChainAction === 'acceptPact') {
          result = await acceptPactOffChain(pact._id, txHash!);
        } else if (lastOnChainAction === 'signalCompletion') {
          result = await updatePactCompletionStatus(pact._id);
        } else if (lastOnChainAction === 'confirmCompletion') {
          result = await confirmCompletionOffChain(pact._id);
        } else if (lastOnChainAction === 'requestRevision') {
          result = await requestRevisionOffChain(pact._id);
        }
        
        if (result && !result.success) {
          setLocalError(result.error || "Database update failed.");
        } else {
          setLastOnChainAction(null);
          reset();
        }
      });
    }
  }, [isSuccess, lastOnChainAction, pact._id, txHash, reset]);
  
  useEffect(() => {
    const txError = error || confirmError;
    if (txError) setLocalError(txError.shortMessage || "An error occurred.");
  }, [error, confirmError]);
  
  const isLoading = isPending || isConfirming || isDbPending;

  const statusColors = {
    pending: "border-l-blue-400", active: "border-l-orange-400",
    pending_confirmation: "border-l-yellow-400",
    completed: "border-l-green-400", failed: "border-l-red-400", rejected: "border-l-gray-500",
  };

  return (
    <div className={cn("bg-slate-800/50 rounded-lg border border-slate-700 border-l-4 relative group", statusColors[pact.status])}>
      <div className="p-4">
        {/* Header and Description */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-slate-800 h-12 w-12 flex items-center justify-center rounded-lg"><FileText className="h-6 w-6 text-blue-400" /></div>
            <div>
              <h3 className="text-xl font-bold text-white">{pact.title}</h3>
              <p className="text-xs text-neutral-400 capitalize">{`Status: ${pact.status.replace('_', ' ')}`}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
              {pact.stakeAmount && pact.stakeAmount > 0 && (<div className="flex items-center font-semibold text-purple-400 text-sm"><Zap className="h-4 w-4 mr-1.5" /> {pact.stakeAmount} ETH Stake</div>)}
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:bg-slate-700">
                    <MessageSquare size={18} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900/80 border-slate-700 text-white max-w-xl h-[80vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Chat for: {pact.title}</DialogTitle>
                  </DialogHeader>
                  <ChatBox pactId={pact._id} />
                </DialogContent>
              </Dialog>
          </div>
        </div>
        {pact.description && <p className="text-neutral-300 mb-4">{pact.description}</p>}

        <div className="mt-4 pt-4 border-t border-slate-700">
          
          {/* Partner's Button to Accept Invitation (ON-CHAIN) */}
          {pact.status === 'pending' && isUserPartner && (
            <Button className="w-full bg-blue-500 hover:bg-blue-600" disabled={isLoading} onClick={() => handleOnChainAction('acceptPact', [bytesToHex(stringToBytes(pact._id.padEnd(32, '\0')))], parseEther(pact.stakeAmount?.toString() || "0"))}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
              {isPending ? "Confirm..." : isConfirming ? "Accepting..." : isDbPending ? "Finalizing..." : "Accept & Match Stake"}
            </Button>
          )}
          
          {/* Partner's File Submission Form (NEW) */}
          {pact.status === 'active' && isUserPartner && (
            <FileSubmissionForm pactId={pact._id} />
          )}

          {/* Creator's UI to View or Handle Submission (NEW) */}
          {pact.status === 'pending_confirmation' && isUserCreator && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {pact.submission && !pact.submission.viewedBy ? (
                    <>
                    <p className="text-sm text-yellow-300 mb-2 sm:mb-0">The partner has submitted their work for your approval.</p>
                    <Button onClick={handleDownload} disabled={isDownloading} className="w-full sm:w-auto bg-slate-500 hover:bg-slate-600">
                        {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
                        View Submission
                    </Button>
                    </>
                ) : pact.submission && pact.submission.viewedBy ? (
                    <p className="text-sm text-neutral-400">Submission viewed. Please approve or reject.</p>
                ) : null}
              <div className="flex w-full sm:w-auto items-center gap-3 mt-2 sm:mt-0">
                <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 flex-grow" onClick={() => handleOnChainAction('confirmCompletion', [bytesToHex(stringToBytes(pact._id.padEnd(32, '\0')))])}>
                  {isLoading && lastOnChainAction === 'confirmCompletion' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsUp className="mr-2 h-4 w-4" />}
                  Approve
                </Button>
                <Button 
                    variant="destructive" 
                    onClick={() => handleOnChainAction('requestRevision', [bytesToHex(stringToBytes(pact._id.padEnd(32, '\0')))])}
                    className="w-full sm:w-auto flex-grow"
                >
                  {isLoading && lastOnChainAction === 'requestRevision' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  Reject ({pact.rejectionCount} / 3)
                </Button>
              </div>
            </div>
          )}

          {/* Status Text for waiting states */}
          {pact.status === 'active' && isUserCreator && <p className="text-sm text-center text-neutral-400">Waiting for the partner to submit their work.</p>}
          {pact.status === 'pending_confirmation' && isUserPartner && pact.submission && <p className="text-sm text-center text-neutral-400">Work submitted ({pact.submission.fileName}). Waiting for the creator's approval.</p>}

        </div>

        {localError && <p className="text-xs text-red-500 mt-2 text-center">Error: {localError}</p>}
      </div>
    </div>
  );
}