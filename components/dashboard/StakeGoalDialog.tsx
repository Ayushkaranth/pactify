// components/dashboard/StakeGoalDialog.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { Goal } from "./GoalCard";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { addStakeToGoal } from "@/app/dashboard/goals/actions";
import { Loader2, Zap } from "lucide-react";
import { GOAL_STAKE_CONTRACT_ADDRESS_CLIENT, GOAL_STAKE_ABI_CLIENT } from "@/lib/client-contract";

export function StakeGoalDialog({ goal, setGoal }: { goal: Goal, setGoal: (goal: Goal) => void }) {
  const [open, setOpen] = useState(false);
  const { isConnected } = useAccount();
  const { writeContract, data: txHash, isPending: isWriting, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({ hash: txHash, timeout: 60_000 });
  const [isServerActionPending, startServerActionTransition] = useTransition();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleStake = () => {
    setLocalError(null);
    if (!goal.stakeAmount || !goal.forfeitAddress) {
      setLocalError("Missing stake amount or forfeit address.");
      return;
    }

    writeContract({
      address: GOAL_STAKE_CONTRACT_ADDRESS_CLIENT,
      abi: GOAL_STAKE_ABI_CLIENT,
      functionName: "stake",
      args: [goal.forfeitAddress],
      value: parseEther(goal.stakeAmount.toString()),
    });
  };

  useEffect(() => {
    if (isConfirmed && txHash) {
      startServerActionTransition(async () => {
        try {
          const result = await addStakeToGoal(goal._id, txHash);
          if (result.success && result.updatedGoal) {
            setGoal(result.updatedGoal);
            setOpen(false);
          } else {
            setLocalError(result.error || "Failed to save goal.");
          }
        } catch (serverError) {
          console.error("Server action failed:", serverError);
          setLocalError("An error occurred after the transaction was confirmed.");
        }
      });
    }
  }, [isConfirmed, txHash, goal, addStakeToGoal, setOpen, setGoal]);

  useEffect(() => {
    if (writeError) {
      setLocalError(writeError.message);
    } else if (confirmError) {
      setLocalError("Transaction confirmation failed or timed out. Please check Etherscan for details.");
    }
  }, [writeError, confirmError]);

  const isLoading = isWriting || isConfirming || isServerActionPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-4 text-white">
          <Zap className="mr-2 h-4 w-4" /> Add Stake
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Confirm Your Stake</DialogTitle>
          <DialogDescription>
            You are about to stake crypto on your goal. This is a real blockchain transaction on the Sepolia testnet.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 p-4 bg-slate-800 rounded-lg">
          <p className="font-bold text-lg">{goal.title}</p>
          <hr className="my-3 border-slate-700" />
          <p className="font-bold text-2xl text-orange-400">{goal.stakeAmount} ETH</p>
        </div>
        {!isConnected ? (
          <p className="text-center text-yellow-400">Please connect your wallet to proceed.</p>
        ) : (
          <Button onClick={handleStake} disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isWriting ? "Confirm in Wallet..." : isConfirming ? "Waiting for confirmation..." : "Confirm & Stake on Sepolia"}
          </Button>
        )}
        {(localError || writeError || confirmError) && <p className="text-sm text-red-500 mt-2">Error: {localError || writeError?.message || confirmError?.message}</p>}
      </DialogContent>
    </Dialog>
  );
}