"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ShootingStar = () => {
  // Generate random values only once per star
  const [style, setStyle] = useState<{ top: string; left: string }>({ top: "0%", left: "0%" });
  const [delay, setDelay] = useState(0);
  const [duration, setDuration] = useState(2);

  useEffect(() => {
    // Run only on client after mount
    setStyle({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    });
    setDelay(Math.random() * 5);
    setDuration(Math.random() * 2 + 1.5);
  }, []);

  return (
    <motion.div
      className="absolute h-[2px] w-[150px] bg-gradient-to-l from-orange-400 to-transparent"
      initial={{ opacity: 0, x: 0, y: 0, rotate: -45 }}
      animate={{ opacity: [0, 1, 0], x: "-50vw", y: "50vh" }}
      transition={{ duration, repeat: Infinity, delay, ease: "linear" }}
      style={style}
    />
  );
};

export const ShootingStarBackground = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // prevents SSR rendering mismatch

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {Array.from({ length: 15 }).map((_, i) => (
        <ShootingStar key={i} />
      ))}
    </div>
  );
};
