import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // This line is critical
import { ClerkProvider } from "@clerk/nextjs";
import { ShootingStarBackground } from "@/components/background-animation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pactify",
  description: "Verifiable Commitments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-slate-950`}> <ShootingStarBackground /> {children}</body>
      </html>
    </ClerkProvider>
  );
}