"use client";

import { useState, useTransition } from "react";
import { Goal } from "./GoalCard";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { addStakeToGoal } from "@/app/dashboard/goals/actions";
import { Loader2, Zap } from "lucide-react";

// IMPORTANT: This is the address where all stakes will be sent.
// Replace this with a wallet address that YOU control.
const PLATFORM_WALLET_ADDRESS = "0xd39557784e18A1A936e2BE0F43Cc2cA896D5219F";

export function StakeGoalDialog({ goal }: { goal: Goal }) {
    const [open, setOpen] = useState(false);
    const { isConnected, address } = useAccount();
    const { data: hash, sendTransaction, isPending, error } = useSendTransaction();
    const [isServerActionPending, startServerActionTransition] = useTransition();

    const handleStake = async () => {
        if (!goal.stakeAmount) return;

        sendTransaction({
            to: PLATFORM_WALLET_ADDRESS as `0x${string}`,
            value: parseEther(goal.stakeAmount.toString()), // Converts MATIC to the smallest unit (wei)
        }, {
            onSuccess: (txHash) => {
                // After the transaction is sent, update our database
                startServerActionTransition(async () => {
                    await addStakeToGoal(goal._id, txHash);
                    setOpen(false); // Close the dialog on success
                });
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-4">
                    <Zap className="mr-2 h-4 w-4" /> Add Stake
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Confirm Your Stake</DialogTitle>
                    <DialogDescription>
                        You are about to stake crypto on your goal. This is a real blockchain transaction.
                    </DialogDescription>
                </DialogHeader>
                <div className="my-4 p-4 bg-slate-800 rounded-lg">
                    <p className="text-neutral-400">Goal:</p>
                    <p className="font-bold text-lg">{goal.title}</p>
                    <hr className="my-3 border-slate-700" />
                    <p className="text-neutral-400">Stake Amount:</p>
                    <p className="font-bold text-2xl text-orange-400">{goal.stakeAmount} MATIC</p>
                </div>

                {!isConnected ? (
                    <p className="text-center text-yellow-400">Please connect your wallet to proceed.</p>
                ) : (
                    <Button
                        onClick={handleStake}
                        disabled={isPending || isServerActionPending}
                        className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                        {(isPending || isServerActionPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm & Stake
                    </Button>
                )}
                {error && <p className="text-sm text-red-500 mt-2">{error.message}</p>}
            </DialogContent>
        </Dialog>
    );
}