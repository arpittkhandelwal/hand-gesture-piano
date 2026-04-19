import React from 'react';
import { motion } from 'framer-motion';

export default function HandCursor({ x, y, isActive }) {
  if (!isActive) return null;

  const left = `${x * 100}%`;
  const top = `${y * 100}%`;

  return (
    <motion.div
      className="absolute pointer-events-none z-[100] w-6 h-6 -ml-3 -mt-3"
      animate={{ left, top }}
      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
    >
      <div className="w-full h-full bg-slate-800 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.2)] border-2 border-white ring-4 ring-slate-900/10 animate-pulse" />
    </motion.div>
  );
}
