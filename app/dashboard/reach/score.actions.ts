"use server";

import connectDB from "@/lib/db";
import Goal from "@/models/Goal";
import Pact from "@/models/Pact";

// --- The Business Logic for Your Reputation System ---
const BASE_SCORE = 75;
const POINTS = {
    GOAL_COMPLETED: 2,
    GOAL_FAILED: -1,
    PACT_COMPLETED: 10,
    PACT_FAILED: -5,
};

export async function calculateReliabilityScore(userId: string) {
    try {
        await connectDB();

        // Get all of the user's resolved goals and pacts
        const goals = await Goal.find({ userId, status: { $in: ['completed', 'failed'] } });
        const pacts = await Pact.find({ 
            $or: [{ creatorId: userId }, { partnerId: userId }],
            status: { $in: ['completed', 'failed'] }
        });

        let score = BASE_SCORE;

        // Calculate score from goals
        for (const goal of goals) {
            if (goal.status === 'completed') {
                score += POINTS.GOAL_COMPLETED;
            } else if (goal.status === 'failed') {
                score += POINTS.GOAL_FAILED;
            }
        }

        // Calculate score from pacts
        for (const pact of pacts) {
            if (pact.status === 'completed') {
                score += POINTS.PACT_COMPLETED;
            } else if (pact.status === 'failed') {
                // In a real system, you'd have a field to assign blame for failure.
                // For now, we'll penalize both parties for simplicity.
                score += POINTS.PACT_FAILED;
            }
        }

        // Ensure the score is capped between 0 and 100
        return Math.max(0, Math.min(100, score));

    } catch (error) {
        console.error("Failed to calculate reliability score:", error);
        return BASE_SCORE; // Return the default score on error
    }
}