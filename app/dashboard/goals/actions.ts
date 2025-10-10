"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Goal from "@/models/Goal";

// This schema now matches the object we'll pass directly
const CreateGoalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  description: z.string().max(500).optional(),
  deadline: z.date().optional(),
});

// The function now accepts a plain object, not FormData
export async function createGoalAction(values: z.infer<typeof CreateGoalSchema>) {
  const { userId } = auth();
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
      userId: userId,
    });

    await newGoal.save();
    revalidatePath("/dashboard/goals");

    return { success: true, message: "Goal created successfully!" };
  } catch (error) {
    console.error("Error creating goal:", error);
    return { success: false, error: "Failed to create goal on the server." };
  }
}