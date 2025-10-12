"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Changed Target to BookOpen for the new theme
import { Users, MessageSquare, Check, BookOpen } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";

const features = [
  {
    id: "goals", // The URL path remains /goals for simplicity
    title: "P.o.W. Journal", // New Title
    description: "Document your personal projects and learning journey. Create a verifiable, on-chain history of your work and discipline.", // New Description
    icon: <BookOpen className="h-8 w-8 text-orange-400" />, // New Icon
    color: "rgba(251, 146, 60, 0.3)",
    borderColor: "rgb(251 146 60)",
    keyActions: [
        "Create journal entries for projects or learning goals.",
        "Stake crypto to create a permanent, on-chain timestamp.",
        "Build a public timeline of your work ethic.",
    ]
  },
  {
    id: "pacts",
    title: "Pacts",
    description: "The peer-to-peer commitment module. Forge on-chain agreements for projects or track financial IOUs with a permanent, indisputable record.",
    icon: <Users className="h-8 w-8 text-blue-400" />,
    color: "rgba(96, 165, 250, 0.3)",
    borderColor: "rgb(96 165 250)",
    keyActions: [ "Create task-based pacts for group projects.", "Log and manage financial IOUs with friends.", "Verify completions with on-chain proof." ]
  },
  {
    id: "reach",
    title: "Talent Hub",
    description: "The professional marketplace. Browse talented freelancers with verifiable on-chain histories and propose paid projects directly.",
    icon: <MessageSquare className="h-8 w-8 text-green-400" />,
    color: "rgba(52, 211, 153, 0.3)",
    borderColor: "rgb(52 211 153)",
    keyActions: [ "Discover talent based on their Reliability Score.", "Review a freelancer's full Proof-of-Work history.", "Propose secure, smart-contract-escrowed pacts." ]
  },
];

type Feature = (typeof features)[0];

export function RotatingFeatures() {
  const [rotation, setRotation] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.1);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const radius = 220;

  return (
    <div className="relative h-[600px] w-[600px] flex items-center justify-center">
      <div className="relative z-20">
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] pointer-events-none" viewBox="0 0 440 440">
          <motion.circle cx="220" cy="220" r="219" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" strokeDasharray="5 10" fill="none" initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }}/>
        </svg>
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-tr from-orange-500 via-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-2xl" whileHover={{ scale: 1.05 }}>
          Pactify
        </motion.div>
        <div>
          {features.map((feature, index) => {
            const angle = (index / features.length) * 2 * Math.PI + rotation * 0.05;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={feature.id}
                className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700 flex flex-col items-center justify-center cursor-pointer"
                style={{ translateX: "-50%", translateY: "-50%", boxShadow: `0 0 20px 5px ${feature.color}`}}
                animate={{ x, y }}
                transition={{ type: "spring", stiffness: 50, damping: 20, mass: 2 }}
                whileHover={{ scale: 1.1, zIndex: 50 }}
                onClick={() => setSelectedFeature(feature)}
              >
                {feature.icon}
                <span className="text-white mt-2 text-sm font-semibold">{feature.title}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedFeature && (
          <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
            <DialogContent className="bg-slate-900/80 backdrop-blur-md border-slate-700 text-white p-8 max-w-lg z-50" style={{ borderColor: selectedFeature.borderColor, boxShadow: `0 0 40px 10px ${selectedFeature.color}`}}>
              <DialogHeader className="text-left mb-6">
                <DialogTitle className="flex items-center text-3xl font-bold mb-2">
                  {React.cloneElement(selectedFeature.icon, { className: "h-8 w-8 mr-4" })}
                  {selectedFeature.title}
                </DialogTitle>
                <DialogDescription className="text-neutral-300 text-base">{selectedFeature.description}</DialogDescription>
              </DialogHeader>
              <hr className="border-slate-700" />
              <div className="my-6">
                <h3 className="font-semibold text-lg mb-4">Key Actions:</h3>
                <ul className="space-y-3">
                    {selectedFeature.keyActions.map((action, index) => (
                        <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-neutral-300">{action}</span>
                        </li>
                    ))}
                </ul>
              </div>
              
              {/* --- THIS IS THE CORRECTED PART --- */}
              <Link href={`/dashboard/${selectedFeature.id.toLowerCase()}`} passHref>
                <Button className="w-full text-white text-lg py-6 font-bold shadow-lg transition-transform duration-300 hover:scale-105" style={{ backgroundColor: selectedFeature.borderColor }}>
                    Take me to {selectedFeature.title}
                </Button>
              </Link>
              {/* --- END OF CORRECTION --- */}

            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}