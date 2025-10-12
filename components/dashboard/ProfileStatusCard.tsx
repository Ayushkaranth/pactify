"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ExternalLink, Zap } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ConnectWalletButton } from "./ConnectWalletButton";
import Link from "next/link";

type DashboardStats = {
    activeGoals: number;
    completedPacts: number;
    reliabilityScore: number;
};

export function ProfileStatusCard({ stats }: { stats: DashboardStats }) {
  const { user } = useUser();
  const reliabilityScore = stats.reliabilityScore;

  // --- THIS IS THE KEY UI CHANGE ---
  // We use smaller dimensions for a more compact design
  const radius = 28; // Was 32
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (reliabilityScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-7xl mx-auto" // Changed to max-w-7xl for better alignment
    >
      {/* Reduced vertical padding from p-6 to p-4 */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-700 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative flex-shrink-0">
            {/* Reduced image size from w-20 to w-16 */}
            <img
              src={user?.imageUrl || "https://placehold.co/64x64"}
              alt={user?.fullName || "User"}
              className="w-16 h-16 rounded-full border-2 border-slate-600"
            />
            {/* Resized SVG to fit the smaller image */}
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r={radius} strokeWidth="4" stroke="rgba(251, 146, 60, 0.2)" fill="transparent"/>
              <motion.circle
                cx="32" cy="32" r={radius} strokeWidth="4" stroke="#F97316" fill="transparent"
                strokeLinecap="round" transform="rotate(-90 32 32)" strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              />
            </svg>
          </div>
          <div className="ml-4">
            {/* Reduced font size from text-2xl to text-xl */}
            <h2 className="text-xl font-bold text-white">
              Welcome back, {user?.firstName || "User"}!
            </h2>
            <p className="text-sm text-neutral-400">Here's your accountability summary.</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
              {/* Reduced font sizes */}
              <p className="text-xl font-bold text-white">{stats.activeGoals}</p>
              <p className="text-xs text-neutral-400">Active Goals</p>
          </div>
          <div className="text-center">
              <p className="text-xl font-bold text-white">{stats.completedPacts}</p>
              <p className="text-xs text-neutral-400">Pacts Completed</p>
          </div>
          <div className="w-px h-8 bg-slate-700"></div>
          <div className="text-center">
              <p className="text-xl font-bold text-orange-400 flex items-center justify-center">
                <Zap className="w-5 h-5 mr-1" /> {reliabilityScore}%
              </p>
              <p className="text-xs text-neutral-400">Reliability Score</p>
          </div>
          
          <Link href={`/profile/${user?.id}`}>
            <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white hover:bg-slate-800">
                Public Profile <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            <ConnectWalletButton />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
