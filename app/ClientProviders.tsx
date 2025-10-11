"use client"; // must be client

import React from "react";
import { Web3Provider as WagmiProviderWrapper } from "@/providers/Web3Provider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <WagmiProviderWrapper>{children}</WagmiProviderWrapper>;
}