"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { Button } from '../ui/button';
import { LogOut, AlertTriangle } from 'lucide-react';
import { sepolia } from 'wagmi/chains';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export function ConnectWalletButton() {
    // Clerk's client-side hook to get the user object
    const { user } = useUser();
    
    // Wagmi's hooks for wallet interaction
    const { address, isConnected, chain } = useAccount();
    const { connect, connectors, isPending: isConnecting } = useConnect();
    const { disconnect } = useDisconnect();
    const { switchChain, isPending: isSwitching } = useSwitchChain();

    // --- THIS IS THE CRITICAL, CORRECT LOGIC ---
    useEffect(() => {
        // This effect runs whenever the wallet connection state changes
        if (isConnected && user && address) {
            // Check if the currently connected wallet is already linked in Clerk's backend
            const isWalletLinked = user.web3Wallets.some(
                (wallet) => wallet.web3Wallet.toLowerCase() === address.toLowerCase()
            );

            if (!isWalletLinked) {
                // If it's not linked, we call Clerk's built-in function to create it.
                // This is the function that safely triggers the "Signature Request" pop-up.
                user.createWeb3Wallet({ web3Wallet: address });
            }
        }
    }, [isConnected, user, address]); // Reruns whenever these values change
    // --- END OF CRITICAL LOGIC ---

    // 1. User is connected and on the correct Sepolia network
    if (isConnected && chain?.id === sepolia.id) {
        return (
            <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
                <span className="text-sm font-mono text-green-400">{`${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
                <Button variant="ghost" size="icon" onClick={() => disconnect()} className="h-8 w-8 hover:bg-slate-700">
                    <LogOut size={16} />
                </Button>
            </div>
        );
    }

    // 2. User is connected but on the WRONG network
    if (isConnected && chain?.id !== sepolia.id) {
        return (
            <Button 
                onClick={() => switchChain({ chainId: sepolia.id })} 
                disabled={isSwitching}
                variant="destructive"
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
                <AlertTriangle className="mr-2 h-4 w-4" />
                {isSwitching ? "Switching..." : "Switch to Sepolia"}
            </Button>
        );
    }

    // 3. User is not connected
    return (
        <Button 
            onClick={() => connect({ connector: connectors[0] })} 
            disabled={isConnecting}
            className="bg-blue-600 hover:bg-blue-700"
        >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
    );
}