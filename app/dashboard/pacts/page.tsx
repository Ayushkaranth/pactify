import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PactCard, Pact } from "@/components/dashboard/PactCard";
import { CreatePactDialog } from "@/components/dashboard/CreatePactDialog"; // We will create this
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import PactModel from "@/models/Pact";

async function getPacts() {
  const user = await currentUser();
  if (!user) return [];
  try {
    await connectDB();
    // Fetch pacts where the user is either the creator OR the partner
    const pacts = await PactModel.find({ 
        $or: [{ creatorId: user.id }, { partnerId: user.id }] 
    }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(pacts));
  } catch (error) {
    console.error("Failed to fetch pacts:", error);
    return [];
  }
}

export default async function PactsPage() {
  const allPacts: Pact[] = await getPacts();
  const user = await currentUser();
  
  if (!user) return null;

  // Filter the pacts into different categories for the UI
  const pendingInvitations = allPacts.filter(p => p.status === 'pending' && p.partnerId === user.id);
  const myActivePacts = allPacts.filter(p => p.status === 'active');
  const myPendingProposals = allPacts.filter(p => p.status === 'pending' && p.creatorId === user.id);
  
  return (
    <div className="w-full h-screen text-white flex flex-col">
      <header className="sticky top-0 z-30 w-full bg-slate-950/50 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm-px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div>
                    <h1 className="text-2xl font-bold">My Pacts</h1>
                    <p className="text-sm text-neutral-400">Your peer-to-peer commitment dashboard.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard"><Button variant="ghost">Back to Navigator</Button></Link>
                    <CreatePactDialog />
                </div>
            </div>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:px-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-12">
            {/* Section for Pending Invitations */}
            <div>
                <h2 className="text-2xl font-bold mb-4 border-b-2 border-blue-500 pb-2">Pending Invitations ({pendingInvitations.length})</h2>
                {pendingInvitations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pendingInvitations.map(pact => <PactCard key={pact._id} pact={pact} />)}
                    </div>
                ) : <p className="text-neutral-500">You have no pending invitations.</p>}
            </div>

             {/* Section for Active Pacts */}
            <div>
                <h2 className="text-2xl font-bold mb-4 border-b-2 border-orange-500 pb-2">Active Pacts ({myActivePacts.length})</h2>
                {myActivePacts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myActivePacts.map(pact => <PactCard key={pact._id} pact={pact} />)}
                    </div>
                ) : <p className="text-neutral-500">You have no active pacts.</p>}
            </div>
        </div>
      </main>
    </div>
  );
}