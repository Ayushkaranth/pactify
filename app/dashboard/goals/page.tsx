import Link from "next/link";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { Goal } from "@/components/dashboard/GoalCard";
import { CreateGoalDialog } from "@/components/dashboard/CreateGoalDialog";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import GoalModel from "@/models/Goal";

async function getGoals() {
  const user = await currentUser();
  if (!user) return [];
  try {
    await connectDB();
    const goals = await GoalModel.find({ userId: user.id }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(goals));
  } catch (error) {
    console.error("Failed to fetch goals:", error);
    return [];
  }
}

export default async function GoalsPage() {
  const initialGoals: Goal[] = await getGoals();

  return (
    <div className="w-full h-screen text-white grid grid-rows-[auto,1fr] overflow-hidden">
      <header className="sticky top-0 z-30 w-full bg-slate-950/50 backdrop-blur-lg border-b border-slate-700 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div>
                    <h1 className="text-2xl font-bold">Proof-of-Work Journal</h1>
                    <p className="text-sm text-neutral-400">Your on-chain history of discipline and achievement.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard"><Button variant="ghost">Back to Navigator</Button></Link>
                    <CreateGoalDialog />
                </div>
            </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:px-8 overflow-y-hidden overflow-x-auto">
          {initialGoals.length > 0 ? (
            <KanbanBoard initialGoals={initialGoals} />
          ) : (
            <div className="w-full h-full border-2 border-dashed border-slate-700 rounded-lg p-24 flex items-center justify-center">
              <div>
                <h3 className="text-xl font-semibold mb-2">No Journal Entries Yet</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  Click "New Journal Entry" to document your first project or learning goal and start building your on-chain reputation.
                </p>
              </div>
            </div>
          )}
      </main>
    </div>
  );
}
