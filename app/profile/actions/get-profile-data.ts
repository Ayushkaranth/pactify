"use server";

import { clerkClient } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Goal from "@/models/Goal"; // Import the Goal model
import Pact from "@/models/Pact";
import { calculateReliabilityScore } from "@/app/dashboard/reach/score.actions";

export async function getPublicProfileData(userId: string) {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    if (!user) { throw new Error("User not found."); }

    await connectDB();

    // --- THIS IS THE FIX ---
    // 1. Fetch all COMPLETED goals (Journal Entries) for this user
    const completedGoals = await Goal.find({ userId, status: 'completed' }).sort({ createdAt: -1 });

    // 2. Fetch all COMPLETED pacts for this user
    const completedPacts = await Pact.find({
      $or: [{ creatorId: userId }, { partnerId: userId }],
      status: 'completed'
    }).sort({ createdAt: -1 });

    // 3. Combine them into a single, chronological timeline
    const timelineEvents = [
      ...completedGoals.map(g => ({ type: 'journal', data: JSON.parse(JSON.stringify(g)) })),
      ...completedPacts.map(p => ({ type: 'pact', data: JSON.parse(JSON.stringify(p)) }))
    ];

    // 4. Sort all events by date, newest first
    timelineEvents.sort((a, b) => new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime());
    // --- END OF FIX ---

    const reliabilityScore = await calculateReliabilityScore(userId);

    return {
      success: true,
      user: JSON.parse(JSON.stringify(user)),
      reliabilityScore,
      timelineEvents, // Return the combined and sorted timeline
    };

  } catch (error) {
    console.error("Failed to fetch public profile data:", error);
    return { success: false, error: "Could not load profile." };
  }
}