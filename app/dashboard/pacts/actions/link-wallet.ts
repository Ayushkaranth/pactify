"use server";

import { clerkClient, auth } from "@clerk/nextjs/server";

export async function linkWeb3WalletAction(walletAddress: string) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Authentication failed." };
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const existingWallets = user.web3Wallets?.map(w => w.web3Wallet) || [];

    if (existingWallets.includes(walletAddress)) {
      return { success: true, message: "Wallet is already linked." };
    }

    const updatedUser = await clerkClient.users.updateUser(userId, {
      web3Wallets: [...existingWallets, walletAddress],
    });

    if (updatedUser) {
      return { success: true, message: "Wallet successfully linked." };
    }

    return { success: false, error: "Failed to update user profile." };
  } catch (error) {
    console.error("Error linking wallet:", error);
    return { success: false, error: "A technical error occurred while linking the wallet." };
  }
}