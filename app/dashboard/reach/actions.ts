"use server";

import { clerkClient } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Pact from "@/models/Pact";
import { calculateReliabilityScore } from "./score.actions"; // Import our new calculator

export async function getFreelancersAction() {
  try {
    const client = await clerkClient();
    const users = await client.users.getUserList({ limit: 50 });
    
    await connectDB();
    const completedPacts = await Pact.find({ status: 'completed' });

    // We use Promise.all to fetch all scores in parallel for better performance
    const freelancers = await Promise.all(users.data.map(async (user) => {
      const completedPactCount = completedPacts.filter(p => p.creatorId === user.id || p.partnerId === user.id).length;

      // --- THIS IS THE FIX ---
      // We now call our new function to get the REAL score.
      const reliabilityScore = await calculateReliabilityScore(user.id);
      // --- END OF FIX ---

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        completedPactCount: completedPactCount,
        reliabilityScore: reliabilityScore, // Use the real score
      };
    }));

    // Sort by the real reliability score
    freelancers.sort((a, b) => b.reliabilityScore - a.reliabilityScore);

    return { success: true, freelancers: freelancers };

  } catch (error) {
    console.error("Failed to fetch freelancers:", error);
    return { success: false, error: "Could not load freelancer network." };
  }
}