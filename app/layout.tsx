// app/layout.tsx
"use client";

import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Web3Provider } from "@/providers/Web3Provider";
import { ShootingStarBackground } from "@/components/background-animation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950`}>
        <ClerkProvider>
          <Web3Provider>
            <ShootingStarBackground />
            {children}
          </Web3Provider>
        </ClerkProvider>
      </body>
    </html>
  );
}