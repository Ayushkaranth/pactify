// app/dashboard/pacts/page.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PactCard, Pact } from "@/components/dashboard/PactCard";
import { CreatePactDialog } from "@/components/dashboard/CreatePactDialog";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import PactModel from "@/models/Pact";

async function getPacts() {
    const user = await currentUser();
    if (!user) {
        console.log("No user found. Returning empty array.");
        return [];
    }
    try {
        await connectDB();
        const pacts = await PactModel.find({
            $or: [{ creatorId: user.id }, { partnerId: user.id }]
        }).sort({ createdAt: -1 });
        console.log("Fetched pacts from DB:", pacts.length);
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

    console.log("Current User ID:", user.id);
    console.log("All Pacts:", allPacts.length);

    const pendingInvitations = allPacts.filter(p => p.status === 'pending' && p.partnerId === user.id);
    const myPendingProposals = allPacts.filter(p => p.status === 'pending' && p.creatorId === user.id);
    
    // Pacts that are active (for either creator or partner)
    const myActivePacts = allPacts.filter(p => p.status === 'active');

    // CORRECTED: Pacts awaiting creator's review (for the creator)
    const pendingReviewForCreator = allPacts.filter(p => p.status === 'pending_confirmation' && p.creatorId === user.id);

    // NEW: Pacts awaiting creator's review (for the partner/developer)
    const pactsAwaitingCreatorReview = allPacts.filter(p => p.status === 'pending_confirmation' && p.partnerId === user.id);

    return (
        <div className="w-full min-h-screen text-white flex flex-col">
            <header className="sticky top-0 z-30 w-full bg-slate-950/50 backdrop-blur-lg border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

                    {/* Section for Pacts Awaiting Your Review (For Creator) */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4 border-b-2 border-yellow-500 pb-2">Awaiting Your Review ({pendingReviewForCreator.length})</h2>
                        {pendingReviewForCreator.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pendingReviewForCreator.map(pact => <PactCard key={pact._id} pact={pact} />)}
                            </div>
                        ) : <p className="text-neutral-500">No pacts are currently awaiting your review.</p>}
                    </div>

                    {/* NEW SECTION: Pacts Awaiting Creator's Review (For Partner) */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4 border-b-2 border-green-500 pb-2">Awaiting Client Approval ({pactsAwaitingCreatorReview.length})</h2>
                        {pactsAwaitingCreatorReview.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pactsAwaitingCreatorReview.map(pact => <PactCard key={pact._id} pact={pact} />)}
                            </div>
                        ) : <p className="text-neutral-500">No submitted work is currently awaiting client approval.</p>}
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