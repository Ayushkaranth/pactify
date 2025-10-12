"use client"; // This component uses motion, so it must be a client component

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { User } from "@clerk/nextjs/server";
import { Award } from "lucide-react";

export function ProfileHeader({ user, reliabilityScore }: { user: User, reliabilityScore: number }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (reliabilityScore / 100) * circumference;

  return (
    <header className="bg-slate-900/50 border border-slate-700 rounded-2xl p-8 flex items-center justify-between mb-12">
      <div className="flex items-center">
        <img src={user.imageUrl} alt={user.firstName || "User"} className="w-24 h-24 rounded-full border-4 border-slate-600" />
        <div className="ml-6">
          <h1 className="text-4xl font-bold">{user.firstName} {user.lastName}</h1>
          <p className="text-neutral-400">On-Chain Reputation</p>
        </div>
      </div>

      <div className="text-center">
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r={radius} strokeWidth="10" stroke="rgba(251, 146, 60, 0.2)" fill="transparent" />
                <motion.circle
                    cx="70" cy="70" r={radius} strokeWidth="10" stroke="#F97316" fill="transparent"
                    strokeLinecap="round" transform="rotate(-90 70 70)" strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-orange-400">{reliabilityScore}%</p>
            </div>
        </div>
        <p className="text-sm text-neutral-400 mt-2">Reliability Score</p>
      </div>
    </header>
  );
}