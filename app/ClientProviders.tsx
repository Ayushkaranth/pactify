"use client";

import React from "react";
import { Web3Provider } from "@/providers/Web3Provider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <Web3Provider>{children}</Web3Provider>;
}