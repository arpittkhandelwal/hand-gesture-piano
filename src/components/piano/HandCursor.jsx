import React from 'react';
import { motion } from 'framer-motion';

export default function HandCursor({ x, y, isActive }) {
  if (!isActive) return null;

  // Map normalized Tracking X [0, 1] to CSS percentage
  // Mirroring is handled at the source
  const left = `${x * 100}%`;
  const top = `${y * 100}%`;

  return (
    <motion.div
      className="absolute pointer-events-none z-[100] w-6 h-6 -ml-3 -mt-3"
      animate={{ left, top }}
      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
    >
      <div className="w-full h-full bg-primary rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)] border-2 border-white ring-4 ring-primary/20 animate-pulse" />
      
      {/* Visual Guideline */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-32 bg-gradient-to-b from-primary/50 to-transparent" />
    </motion.div>
  );
}
