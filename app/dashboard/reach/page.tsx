import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFreelancersAction } from "./actions";
import { FreelancerCard, Freelancer } from "@/components/dashboard/FreelancerCard";

export default async function ReachPage() {
  const { freelancers } = await getFreelancersAction();

  return (
    <div className="w-full min-h-screen text-white flex flex-col">
      <header className="sticky top-0 z-30 w-full bg-slate-950/50 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold">Talent Network</h1>
              <p className="text-sm text-neutral-400">Discover proven talent with on-chain reputations.</p>
            </div>
            <div className="flex items-center gap-4">
               <Link href="/dashboard"><Button variant="ghost">Back to Navigator</Button></Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
            {freelancers && freelancers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {freelancers.map((freelancer) => (
                        <FreelancerCard key={freelancer.id} freelancer={freelancer as Freelancer} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-neutral-500 py-24">
                    <p>No freelancers found in the network yet.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}