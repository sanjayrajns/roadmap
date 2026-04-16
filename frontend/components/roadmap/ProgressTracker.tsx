"use client";

import { motion } from "framer-motion";

interface ProgressTrackerProps {
  completed: number;
  total: number;
}

export default function ProgressTracker({ completed, total }: ProgressTrackerProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex items-center gap-4 min-w-[220px]">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
            Progress
          </span>
          <span className="text-[10px] font-bold tracking-widest text-zinc-900 uppercase">
            {pct}%
          </span>
        </div>
        <div className="h-1 w-full bg-zinc-100 overflow-hidden">
          <motion.div
            className="h-full bg-zinc-900"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <p className="text-[10px] text-zinc-400 mt-1.5">
          {completed} of {total} stages complete
        </p>
      </div>
    </div>
  );
}
