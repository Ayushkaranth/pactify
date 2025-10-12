import { RotatingFeatures } from "@/components/dashboard/RotatingFeatures";
import { ProfileStatusCard } from "@/components/dashboard/ProfileStatusCard";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Goal from "@/models/Goal";
import Pact from "@/models/Pact";
import { calculateReliabilityScore } from "@/app/dashboard/reach/score.actions";

// --- NEW SERVER-SIDE DATA FETCHING FOR STATS ---
async function getDashboardStats() {
    const user = await currentUser();
    if (!user) {
        return { activeGoals: 0, completedPacts: 0, reliabilityScore: 0 };
    }
    try {
        await connectDB();
        const activeGoals = await Goal.countDocuments({ userId: user.id, status: 'active' });
        const completedPacts = await Pact.countDocuments({ 
            $or: [{ creatorId: user.id }, { partnerId: user.id }],
            status: 'completed' 
        });
        const reliabilityScore = await calculateReliabilityScore(user.id);
        
        return { activeGoals, completedPacts, reliabilityScore };
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return { activeGoals: 0, completedPacts: 0, reliabilityScore: 0 };
    }
}
// --- END OF DATA FETCHING ---


export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    // --- THIS IS THE LAYOUT FIX ---
    // We use a grid layout to ensure the header is fixed and the main content scrolls if needed.
    <div className="w-full h-screen text-white grid grid-rows-[auto,1fr] overflow-hidden">
      {/* The header card now receives the real stats as props */}
      <div className="w-full pt-4 pb-2 px-4 flex-shrink-0">
        <ProfileStatusCard stats={stats} />
      </div>
      
      {/* The main content area can now scroll independently if the screen is too short */}
      <div className="flex-grow w-full flex items-center justify-center relative overflow-y-auto">
        <RotatingFeatures />
      </div>
    </div>
  );
}