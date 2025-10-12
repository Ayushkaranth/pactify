"use server";

import { z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Pact from "@/models/Pact";

const ProposePactSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  description: z.string().max(1000).optional(),
  partnerEmail: z.string().email("Please enter a valid email address."),
  stakeAmount: z.coerce.number().min(0).optional(),
});

// This function remains the same
export async function proposePactAction(values: z.infer<typeof ProposePactSchema>) {
  if (!process.env.CLERK_SECRET_KEY) {
    return { success: false, error: "CRITICAL SERVER ERROR: Clerk Secret Key is not configured." };
  }

  const { userId: creatorId } = await auth();
  if (!creatorId) { return { success: false, error: "You must be logged in." }; }

  let partnerId: string;
  let partnerWalletAddress: string | undefined;
  try {
    const client = await clerkClient();
    const users = await client.users.getUserList({ emailAddress: [values.partnerEmail] });

    if (users.data.length === 0) {
      return { success: false, error: "No user with that email address was found on Pactify." };
    }
    
    partnerId = users.data[0].id;
    
    if (partnerId === creatorId) {
      return { success: false, error: "You cannot create a pact with yourself." };
    }

    const partnerUser = await client.users.getUser(partnerId);
    const rawUser = (partnerUser as any)._raw;
    const rawWeb3Wallets = rawUser?.web3_wallets;

    if (rawWeb3Wallets && Array.isArray(rawWeb3Wallets) && rawWeb3Wallets.length > 0) {
        partnerWalletAddress = rawWeb3Wallets[0].web3_wallet;
    }

    if (!partnerWalletAddress) {
        return { success: false, error: "The selected partner has not connected a wallet to their Pactify account." };
    }

  } catch (e) {
    console.error("Clerk API Error:", e);
    return { success: false, error: "A technical error occurred while verifying the partner's email." };
  }

  try {
    await connectDB();
    const newPact = new Pact({ ...values, creatorId, partnerId });
    await newPact.save();
    revalidatePath("/dashboard/pacts");
    
    return { success: true, pact: JSON.parse(JSON.stringify(newPact)), partnerWalletAddress };
  } catch (error) {
    console.error("Error proposing pact:", error);
    return { success: false, error: "Failed to save pact to the database." };
  }
}

// This function remains the same
export async function acceptPactOffChain(pactId: string, txHash: string) {
    const { userId } = await auth();
    if (!userId) { return { success: false, error: "Authentication failed." }; }
    try {
        await connectDB();
        const pact = await Pact.findOne({ _id: pactId, partnerId: userId });
        if (!pact) { return { success: false, error: "Pact not found or you are not the partner." }; }
        pact.status = 'active';
        pact.acceptanceTxHash = txHash;
        await pact.save();
        revalidatePath("/dashboard/pacts");
        return { success: true };
    } catch (error) {
        console.error("Error accepting pact off-chain:", error);
        return { success: false, error: "Failed to update pact status in database." };
    }
}

// --- UPDATED SERVER ACTIONS ---
// This function is now the only one responsible for off-chain updates for completion.
export async function updatePactCompletionStatus(pactId: string) {
  const { userId } = await auth();
  if (!userId) { return { success: false, error: "Authentication failed." }; }

  try {
    await connectDB();
    // Verify user is either creator or partner to update this pact
    const pact = await Pact.findOne({ _id: pactId, $or: [{ creatorId: userId }, { partnerId: userId }] });
    if (!pact) { return { success: false, error: "Pact not found." }; }

    // Based on the action on-chain, we update the DB status accordingly.
    // NOTE: This logic should ideally be more robust and tied to the on-chain status itself.
    // For this simple case, we know `signalCompletion` corresponds to `pending_confirmation`.
    pact.status = 'pending_confirmation';
    await pact.save();
    revalidatePath("/dashboard/pacts");
    return { success: true };
  } catch (error) {
    console.error("Error updating pact completion status:", error);
    return { success: false, error: "Database update failed." };
  }
}

// Called when the Creator approves the work
export async function confirmCompletionOffChain(pactId: string) {
  const { userId } = await auth();
  if (!userId) { return { success: false, error: "Authentication failed." }; }

  try {
    await connectDB();
    const pact = await Pact.findOne({ _id: pactId, creatorId: userId });
    if (!pact) { return { success: false, error: "Pact not found or you are not the creator." }; }

    pact.status = 'completed';
    await pact.save();
    revalidatePath("/dashboard/pacts");
    return { success: true };
  } catch (error) {
    console.error("Error confirming completion:", error);
    return { success: false, error: "Database update failed." };
  }
}

// Called when the Creator requests a revision or on the final rejection
export async function requestRevisionOffChain(pactId: string) {
  const { userId } = await auth();
  if (!userId) { return { success: false, error: "Authentication failed." }; }

  try {
    await connectDB();
    const pact = await Pact.findOne({ _id: pactId, creatorId: userId });
    if (!pact) { return { success: false, error: "Pact not found or you are not the creator." }; }
    
    const newRejectionCount = pact.rejectionCount + 1;
    pact.rejectionCount = newRejectionCount;

    if (newRejectionCount >= 3) {
      pact.status = 'failed'; // Final strike results in failure and refund
    } else {
      pact.status = 'active'; // Go back to 'active' for revisions
    }

    await pact.save();
    revalidatePath("/dashboard/pacts");
    return { success: true };
  } catch (error) {
    console.error("Error requesting revision:", error);
    return { success: false, error: "Database update failed." };
  }
}

export async function rejectPactAction(pactId: string) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Authentication failed." };
  }

  try {
    await connectDB();
    // Find the pact where the current user is the partner and it's still pending
    const pact = await Pact.findOne({ _id: pactId, partnerId: userId, status: 'pending' });

    if (!pact) {
      return { success: false, error: "Pending pact not found or you are not the partner." };
    }

    pact.status = 'rejected';
    await pact.save();

    // Refresh the pacts page to show the change
    revalidatePath("/dashboard/pacts");
    return { success: true, message: "Pact successfully rejected." };
  } catch (error) {
    console.error("Error rejecting pact:", error);
    return { success: false, error: "Failed to update pact in the database." };
  }
}

export async function dismissRejectedPactAction(pactId: string) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Authentication failed." };
  }

  try {
    await connectDB();
    // Find the pact where the current user is the creator and it's been rejected
    const pact = await Pact.findOne({ _id: pactId, creatorId: userId, status: 'rejected' });

    if (!pact) {
      return { success: false, error: "Rejected pact not found or you are not the creator." };
    }

    // Update the status to prevent the notification from showing again
    pact.status = 'rejected_seen';
    await pact.save();

    revalidatePath("/dashboard/pacts");
    return { success: true };
  } catch (error) {
    console.error("Error dismissing rejected pact:", error);
    return { success: false, error: "Failed to update pact in the database." };
  }
}