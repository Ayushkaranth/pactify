"use client"; // This directive is the entire fix

import { motion } from "framer-motion";

const ShootingStar = () => {
  const duration = Math.random() * 2 + 1.5;
  const delay = Math.random() * 5;
  const top = `${Math.random() * 100}%`;
  const left = `${Math.random() * 100}%`;

  return (
    <motion.div
      className="absolute h-[2px] w-[150px] bg-gradient-to-l from-orange-400 to-transparent"
      initial={{ opacity: 0, x: 0, y: 0, rotate: -45 }}
      animate={{ opacity: [0, 1, 0], x: "-50vw", y: "50vh" }}
      transition={{ duration, repeat: Infinity, delay, ease: "linear" }}
      style={{ top, left }}
    />
  );
};

export const ShootingStarBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    {Array.from({ length: 15 }).map((_, i) => (
      <ShootingStar key={i} />
    ))}
  </div>
);