import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ShootingStarBackground } from "@/components/background-animation";
import { ClientProviders } from "./ClientProviders"; // new client wrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pactify",
  description: "Verifiable Commitments",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950`}>
        <ClerkProvider>
          <ClientProviders>
            <ShootingStarBackground />
            {children}
          </ClientProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}
