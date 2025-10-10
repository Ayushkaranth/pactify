"use client";

import React from "react";

export function GridBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-slate-950 text-white bg-grid-white/[0.07] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-slate-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      {children}
    </div>
  );
}