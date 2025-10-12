"use client";

import { motion } from "framer-motion";
import { CheckCircle, Star } from "lucide-react";
import Link from "next/link";

export type Freelancer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  completedPactCount: number;
  reliabilityScore: number;
};

export function FreelancerCard({ freelancer }: { freelancer: Freelancer }) {
  const fullName = `${freelancer.firstName || ''} ${freelancer.lastName || ''}`.trim();

  return (
    // The <Link> component is the parent. The faulty onClick handler has been REMOVED.
    <Link
      href={`/profile/${freelancer.id}`}
      className="block no-underline"
    >
      {/* The <motion.div> is the child. It handles animations and receives the click from the parent. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(251, 146, 60, 0.3)' }}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col h-full cursor-pointer text-white"
      >
        <div className="flex items-center mb-4">
          <img src={freelancer.imageUrl} alt={fullName} className="w-16 h-16 rounded-full border-2 border-slate-600" />
          <div className="ml-4">
            <h3 className="text-xl font-bold">{fullName || "Pactify User"}</h3>
            <p className="text-sm text-neutral-400">Freelance Developer</p>
          </div>
        </div>

        <div className="flex-grow"></div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
            <div className="text-center">
                <p className="text-2xl font-bold text-green-400 flex items-center">{freelancer.completedPactCount} <CheckCircle className="ml-1 h-5 w-5"/></p>
                <p className="text-xs text-neutral-500">Pacts Completed</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-orange-400 flex items-center">{freelancer.reliabilityScore}% <Star className="ml-1 h-5 w-5"/></p>
                <p className="text-xs text-neutral-500">Reliability Score</p>
            </div>
        </div>
      </motion.div>
    </Link>
  );
}