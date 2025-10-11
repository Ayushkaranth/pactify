// app/ClientLayoutWrapper.tsx
"use client"; // ✅ mark as client

import { ReactNode } from "react";
import { ClientProviders } from "../components/ClientProviders";
import { ShootingStarBackground } from "../components/background-animation";

export function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <ClientProviders>
      <ShootingStarBackground />
      {children}
    </ClientProviders>
  );
}
