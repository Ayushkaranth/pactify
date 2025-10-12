"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { useUser } from '@clerk/nextjs';
import { Button } from '../ui/button';
import { LogOut, AlertTriangle } from 'lucide-react';
import { sepolia } from 'wagmi/chains';
import { useTransition, useEffect } from 'react';
import { linkWeb3WalletAction } from '@/app/dashboard/pacts/actions/link-wallet';

export function ConnectWalletButton() {
    const { user, isLoaded } = useUser();
    const { address, isConnected, chain } = useAccount();
    const { connect, connectors, isPending: isConnecting } = useConnect();
    const { disconnect, isPending: isDisconnecting } = useDisconnect();
    const { switchChain, isPending: isSwitching } = useSwitchChain();

    const [isLinking, startLinkingTransition] = useTransition();

    useEffect(() => {
        // CORRECTED: Only run if both the Clerk user and wagmi account are loaded and connected
        // Also, check if 'address' is not undefined before using it
        if (isLoaded && user && isConnected && address) {
            console.log("Clerk user loaded and wallet connected. Checking for link...");
            
            const isWalletLinked = user.web3Wallets.some(
                (w) => w.web3Wallet?.toLowerCase() === address.toLowerCase() // CORRECTED: Use optional chaining to handle potential undefined
            );

            if (!isWalletLinked) {
                console.log("Wallet is not linked. Attempting to link now.");
                startLinkingTransition(async () => {
                    const result = await linkWeb3WalletAction(address);
                    if (result.success) {
                        console.log("SUCCESS: Wallet successfully linked to Clerk profile!");
                        // You can add a success message here
                        // user.reload(); // Consider calling this if you want to immediately update the client-side user object
                    } else {
                        console.error("FAILURE: Failed to link wallet.", result.error);
                    }
                });
            } else {
                console.log("Wallet is already linked. No action needed.");
            }
        }
    }, [isLoaded, user, isConnected, address]);

    // --- UI LOGIC ---

    if (isConnected && chain?.id === sepolia.id) {
        // CORRECTED: Safely access user's web3Wallets property
        const isWalletLinked = isLoaded && user?.web3Wallets.some(
            (w) => w.web3Wallet?.toLowerCase() === address?.toLowerCase()
        );

        return (
            <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-green-400">
                    {isLinking ? "Linking..." : `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                </span>
                {isWalletLinked && <span className="text-xs text-blue-400">Linked</span>}
                <Button variant="ghost" size="icon" onClick={() => disconnect()} disabled={isDisconnecting} className="h-8 w-8 hover:bg-slate-700">
                    <LogOut size={16} />
                </Button>
            </div>
        );
    }

    if (isConnected && chain?.id !== sepolia.id) {
        return (
            <Button onClick={() => switchChain({ chainId: sepolia.id })} disabled={isSwitching} variant="destructive" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <AlertTriangle className="mr-2 h-4 w-4" />
                {isSwitching ? "Switching..." : "Switch to Sepolia"}
            </Button>
        );
    }

    return (
        <Button onClick={() => connect({ connector: connectors[0] })} disabled={isConnecting} className="bg-blue-600 hover:bg-blue-700">
            {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
    );
}