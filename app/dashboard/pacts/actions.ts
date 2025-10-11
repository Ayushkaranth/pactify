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

    // --- THIS IS THE DEFINITIVE FIX: Read from the RAW data ---
    // We bypass the potentially buggy SDK translation and access the original data directly.
    const rawUser = (partnerUser as any)._raw;
    const rawWeb3Wallets = rawUser?.web3_wallets;

    if (rawWeb3Wallets && Array.isArray(rawWeb3Wallets) && rawWeb3Wallets.length > 0) {
        partnerWalletAddress = rawWeb3Wallets[0].web3_wallet;
    }
    // --- END OF FIX ---

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

// The acceptPactOffChain function remains correct
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