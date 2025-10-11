// dashboard/goals/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Goal from "@/models/Goal";
import { createPublicClient, createWalletClient, http, Hex, getAddress, isAddress, parseEther, decodeEventLog } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { GOAL_STAKE_ABI } from "@/lib/contract";

const CreateGoalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  description: z.string().max(500).optional(),
  deadline: z.date().optional(),
  stakeAmount: z.coerce.number().min(0).optional(),
  forfeitAddress: z.string().optional(),
});

const rawContractAddress = process.env.NEXT_PUBLIC_GOAL_STAKE_CONTRACT_ADDRESS;
if (!rawContractAddress) {
  throw new Error("Missing NEXT_PUBLIC_GOAL_STAKE_CONTRACT_ADDRESS in .env.local");
}
const GOAL_STAKE_CONTRACT_ADDRESS = getAddress(rawContractAddress);

export async function createGoalAction(values: z.infer<typeof CreateGoalSchema>) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "You must be logged in to create a goal." };
  }

  const validatedFields = CreateGoalSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();

    const newGoal = new Goal({
      ...validatedFields.data,
      userId,
    });

    await newGoal.save();
    revalidatePath("/dashboard/goals");

    return { success: true, message: "Goal created successfully!" };
  } catch (error) {
    console.error("Error creating goal:", error);
    return { success: false, error: "Failed to create goal on the server." };
  }
}

export async function updateGoalStatus(goalId: string, status: 'active' | 'completed' | 'failed') {
  const { userId } = await auth();
  if (!userId) { return { success: false, error: "Authentication failed." }; }

  try {
    await connectDB();
    const goal = await Goal.findOne({ _id: goalId, userId });

    if (!goal) { return { success: false, error: "Goal not found or you do not have permission to edit it." }; }
    
    // Check if the goal has a goalId and a stake
    if (!goal.goalId || !goal.stakeAmount || status === 'active') {
        goal.status = status;
        await goal.save();
        revalidatePath("/dashboard/goals");
        return { success: true, message: "Goal status updated successfully." };
    }

    const privateKey = process.env.BACKEND_WALLET_PRIVATE_KEY as Hex;
    const rpcUrl = process.env.SEPOLIA_RPC_URL as string;
    
    if (!privateKey || !rpcUrl) throw new Error("Private key or RPC URL not configured.");

    const account = privateKeyToAccount(privateKey);
    
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(rpcUrl),
    });

    const nonce = await publicClient.getTransactionCount({ address: account.address });

    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(rpcUrl),
    });

    const functionName = status === 'completed' ? 'markCompleted' : 'markFailed';

    const hash = await walletClient.writeContract({
      address: GOAL_STAKE_CONTRACT_ADDRESS,
      abi: GOAL_STAKE_ABI,
      functionName,
      args: [BigInt(goal.goalId)],
      nonce,
      gas: BigInt(300000), 
    });

    console.log(`Transaction hash for goal status update: ${hash}`);

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);

    goal.status = status;
    await goal.save();

    revalidatePath("/dashboard/goals");
    return { success: true, message: "Goal status updated and transaction confirmed." };
  } catch (error) {
    console.error("Error updating goal status:", error);
    return { success: false, error: "Failed to update goal status." };
  }
}

export async function addStakeToGoal(goalId: string, txHash: string) {
  const { userId } = await auth();
  if (!userId) { return { success: false, error: "Authentication failed." }; }

  try {
    await connectDB();
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) { return { success: false, error: "Goal not found." }; }

    const rpcUrl = process.env.SEPOLIA_RPC_URL as string;
    if (!rpcUrl) throw new Error("RPC URL not configured.");

    const publicClient = createPublicClient({ 
        chain: sepolia, 
        transport: http(rpcUrl)
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash as `0x${string}` });
    const log = receipt.logs.find(
        (log) => log.address.toLowerCase() === GOAL_STAKE_CONTRACT_ADDRESS.toLowerCase()
    );

    if (!log) throw new Error("GoalStaked event not found in transaction logs.");

    const goalStakedEvent = decodeEventLog({
        abi: GOAL_STAKE_ABI,
        eventName: 'GoalStaked',
        topics: log.topics,
        data: log.data,
    });
    const newGoalId = Number(goalStakedEvent.args.goalId);

    goal.stakeTxHash = txHash;
    goal.goalId = newGoalId;
    await goal.save();

    return { success: true, updatedGoal: JSON.parse(JSON.stringify(goal)) };
  } catch (error) {
    console.error("Error adding stake to goal:", error);
    return { success: false, error: "Failed to update goal with stake information." };
  }
}