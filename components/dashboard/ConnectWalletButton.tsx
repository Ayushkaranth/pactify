"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { Button } from '../ui/button';
import { LogOut, AlertTriangle } from 'lucide-react';
import { sepolia } from 'wagmi/chains'; // Import the Sepolia chain

export function ConnectWalletButton() {
    const { address, isConnected, chain } = useAccount();
    const { connect, connectors, isPending: isConnecting } = useConnect();
    const { disconnect, isPending: isDisconnecting } = useDisconnect();
    const { switchChain, isPending: isSwitching } = useSwitchChain();

    if (isConnected && chain?.id === sepolia.id) {
        return (
            <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
                <span className="text-sm font-mono text-green-400">{`${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
                <Button variant="ghost" size="icon" onClick={() => disconnect()} className="h-8 w-8 hover:bg-slate-700"><LogOut size={16} /></Button>
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