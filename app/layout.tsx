import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // CSS import stays
import { ShootingStarBackground } from "@/components/background-animation";
import { ClientProviders } from "../components/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pactify",
  description: "Verifiable Commitments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950`}>
        <ClientProviders>
          <ShootingStarBackground />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
