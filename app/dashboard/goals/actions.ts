"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Goal from "@/models/Goal";

const CreateGoalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  description: z.string().max(500).optional(),
  deadline: z.date().optional(),
  stakeAmount: z.coerce.number().min(0).optional(),
   forfeitAddress: z.string().optional(),
});

export async function createGoalAction(values: z.infer<typeof CreateGoalSchema>) {
  // ✅ FIX: await the auth() call
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
  if (!userId) {
    return { success: false, error: "Authentication failed." };
  }

  try {
    await connectDB();
    const goal = await Goal.findOne({ _id: goalId, userId });

    if (!goal) {
      return { success: false, error: "Goal not found or you do not have permission to edit it." };
    }

    goal.status = status;
    await goal.save();

    revalidatePath("/dashboard/goals");
    return { success: true };
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

    goal.stakeTxHash = txHash;
    await goal.save();

    revalidatePath("/dashboard/goals");
    return { success: true };
  } catch (error) {
    console.error("Error adding stake to goal:", error);
    return { success: false, error: "Failed to update goal with stake information." };
  }
}