"use client";

import React, { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains'; // We are switching back to a public testnet
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors';

const config = createConfig({
  chains: [polygonMumbai], // Use the Polygon Mumbai testnet
  connectors: [
    injected(), // For MetaMask and other browser wallets
  ],
  transports: {
    [polygonMumbai.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}