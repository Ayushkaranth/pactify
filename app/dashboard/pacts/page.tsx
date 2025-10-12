import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PactCard, Pact } from "@/components/dashboard/PactCard";
import { CreatePactDialog } from "@/components/dashboard/CreatePactDialog";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import PactModel from "@/models/Pact";
import { RejectedPactsNotification } from "@/components/dashboard/RejectedPactsNotification";
import React from "react";
import { cn } from "@/lib/utils";

async function getPacts() {
    const user = await currentUser();
    if (!user) return [];
    try {
        await connectDB();
        const pacts = await PactModel.find({ 
            $or: [{ creatorId: user.id }, { partnerId: user.id }] 
        }).sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(pacts));
    } catch (error) {
        console.error("Failed to fetch pacts:", error);
        return [];
    }
}

function PactSection({ title, pacts, emptyText, color }: { title: string; pacts: Pact[]; emptyText: string; color: string }) {
    const count = pacts.length;
    return (
        <div className="space-y-4">
            <h2 className={cn("text-2xl font-bold pb-2 border-b-2", color)}>
                {title} ({count})
            </h2>
            {count > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pacts.map(pact => <PactCard key={pact._id} pact={pact} />)}
                </div>
            ) : (
                <p className="text-center text-neutral-500 italic py-8">{emptyText}</p>
            )}
        </div>
    );
}

export default async function PactsPage() {
    const allPacts: Pact[] = await getPacts();
    const user = await currentUser();
    if (!user) return null;

    const pendingInvitations = allPacts.filter(p => p.status === 'pending' && p.partnerId === user.id);
    const myPendingProposals = allPacts.filter(p => p.status === 'pending' && p.creatorId === user.id);
    const myActivePacts = allPacts.filter(p => p.status === 'active');
    const pendingReviewForCreator = allPacts.filter(p => p.status === 'pending_confirmation' && p.creatorId === user.id);
    const pactsAwaitingCreatorReview = allPacts.filter(p => p.status === 'pending_confirmation' && p.partnerId === user.id);
    const myRejectedProposals = allPacts.filter(p => p.status === 'rejected' && p.creatorId === user.id);

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
                    <PactSection 
                        title="Pending Invitations"
                        pacts={pendingInvitations}
                        emptyText="You have no pending invitations."
                        color="border-blue-500"
                    />

                    {/* Section for Active Pacts */}
                    <PactSection 
                        title="Active Pacts"
                        pacts={myActivePacts}
                        emptyText="You have no active pacts."
                        color="border-orange-500"
                    />

                    {/* Section for Pacts Awaiting Your Review */}
                    <PactSection 
                        title="Awaiting Your Review"
                        pacts={pendingReviewForCreator}
                        emptyText="No pacts are currently awaiting your review."
                        color="border-yellow-500"
                    />

                    {/* Section for Awaiting Client Approval */}
                    <PactSection 
                        title="Awaiting Client Approval"
                        pacts={pactsAwaitingCreatorReview}
                        emptyText="No submitted work is currently awaiting client approval."
                        color="border-green-500"
                    />
                    
                    {/* Section for Your Pending Proposals */}
                    <PactSection 
                        title="Your Pending Proposals"
                        pacts={myPendingProposals}
                        emptyText="You have not proposed any pacts."
                        color="border-purple-500"
                    />

                    {/* --- THE CORRECTED LOCATION FOR THE NOTIFICATION --- */}
                    {myRejectedProposals.length > 0 && (
                        <div className="mt-12">
                            <RejectedPactsNotification rejectedPacts={myRejectedProposals} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}