"use client";

import React, { ReactNode } from "react";
import { Web3Provider } from "../providers/Web3Provider";
import { ClerkProvider } from "@clerk/nextjs";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <Web3Provider>
      <ClerkProvider>{children}</ClerkProvider>
    </Web3Provider>
  );
}
