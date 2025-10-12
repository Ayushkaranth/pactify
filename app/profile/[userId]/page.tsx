import { getPublicProfileData } from "../actions/get-profile-data";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProofOfWorkTimeline } from "@/components/profile/ProofOfWorkTimeline";
import { ContactInfo } from "@/components/profile/ContactInfo"; // Import the new component
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { Edit } from "lucide-react";

export default async function PublicProfilePage({ params }: { params: { userId: string } }) {
  const { success, user, reliabilityScore, timelineEvents } = await getPublicProfileData(params.userId);
  const { userId: currentUserId } = await auth();

  if (!success || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <h1 className="text-3xl font-bold">Profile Not Found</h1>
        <p className="text-neutral-400 mt-2">The user you are looking for does not exist.</p>
        <Link href="/dashboard/reach" className="mt-6">
            <Button>Back to Talent Network</Button>
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentUserId === user.id;
  const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress;

  return (
    <div className="w-full min-h-screen text-white">
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <ProfileHeader user={user} reliabilityScore={reliabilityScore} />

        <div className="my-12">
          {currentUserId && !isOwnProfile && primaryEmail ? (
            // The Server Component now renders the separate Client Component, passing the simple email string.
            <ContactInfo email={primaryEmail} />
          ) : currentUserId && isOwnProfile ? (
            <div className="text-center">
                <Link href="/user-profile">
                    <Button variant="outline" className="text-lg px-8 py-6 rounded-full">
                        <Edit className="mr-2 h-5 w-5" /> Edit My Profile
                    </Button>
                </Link>
            </div>
          ) : (
            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-center">
                <p><Link href="/sign-up" className="text-orange-400 font-bold hover:underline">Sign up</Link> or <Link href="/sign-in" className="text-orange-400 font-bold hover:underline">log in</Link> to propose a pact.</p>
            </div>
          )}
        </div>

        <ProofOfWorkTimeline events={timelineEvents} />
      </main>
    </div>
  );
}