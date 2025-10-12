import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ShootingStarBackground } from "@/components/background-animation";
import { Web3Provider } from "@/providers/Web3Provider";

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
    <Web3Provider>
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-slate-950`}>
            {/* --- THIS IS THE DEFINITIVE FIX --- */}
            {/* The background is now explicitly placed behind everything with z-index 0 */}
            <div className="absolute inset-0 z-0">
              <ShootingStarBackground />
            </div>

            {/* The main content is now explicitly placed on top with a higher z-index */}
            <main className="relative z-10">
              {children}
            </main>
            {/* --- END OF FIX --- */}
        </body>
      </html>
    </ClerkProvider>
    </Web3Provider>
  );
}