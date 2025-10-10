"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ExternalLink, Zap } from "lucide-react";

export function ProfileStatusCard() {
  const { user } = useUser();
  const reliabilityScore = 92; // Placeholder

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (reliabilityScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-5xl mx-auto p-1 rounded-2xl bg-gradient-to-r from-orange-500/50 via-purple-500/50 to-blue-500/50"
      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(251, 146, 60, 0.2)' }}
    >
      <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative flex-shrink-0">
            <img
              src={user?.imageUrl || "https://placehold.co/80x80"}
              alt={user?.fullName || "User"}
              className="w-20 h-20 rounded-full border-2 border-slate-600"
            />
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r={radius} strokeWidth="5" stroke="rgba(251, 146, 60, 0.2)" fill="transparent"/>
              <motion.circle
                cx="36" cy="36" r={radius} strokeWidth="5" stroke="#F97316" fill="transparent"
                strokeLinecap="round" transform="rotate(-90 36 36)" strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              />
            </svg>
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-white">
              Welcome back, {user?.firstName || "User"}!
            </h2>
            <p className="text-neutral-300">Here's your accountability summary.</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
              <p className="text-3xl font-bold text-white">5</p>
              <p className="text-sm text-neutral-400">Active Goals</p>
          </div>
          <div className="text-center">
              <p className="text-3xl font-bold text-white">23</p>
              <p className="text-sm text-neutral-400">Pacts Completed</p>
          </div>
          <div className="w-px h-10 bg-slate-700"></div>
          <div className="text-center">
              <p className="text-3xl font-bold text-orange-400 flex items-center justify-center">
                <Zap className="w-6 h-6 mr-1" /> {reliabilityScore}%
              </p>
              <p className="text-sm text-neutral-400">Reliability Score</p>
          </div>
          <Button variant="ghost" className="text-neutral-300 hover:text-white hover:bg-slate-800">
              Public Profile <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}