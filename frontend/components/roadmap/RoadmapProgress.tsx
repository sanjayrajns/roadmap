"use client";

import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stage {
  stage_name: string;
  skills: string[];
}

interface RoadmapProgressProps {
  stages: Stage[];
  activeIndex: number;
  completedStages: Set<number>;
  onSelectStage: (index: number) => void;
}

export default function RoadmapProgress({
  stages,
  activeIndex,
  completedStages,
  onSelectStage,
}: RoadmapProgressProps) {
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex items-center min-w-max px-2">
        {stages.map((stage, idx) => {
          const isCompleted = completedStages.has(idx);
          const isActive = idx === activeIndex;
          // locked = not completed AND not the first uncompleted (which should be accessible)
          const firstUncompleted = stages.findIndex((_, i) => !completedStages.has(i));
          const isLocked = !isCompleted && idx > firstUncompleted;

          return (
            <div key={idx} className="flex items-center">
              {/* Node */}
              <motion.button
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                onClick={() => !isLocked && onSelectStage(idx)}
                disabled={isLocked}
                className={cn(
                  "flex flex-col items-center group relative",
                  isLocked ? "cursor-not-allowed" : "cursor-pointer"
                )}
              >
                {/* Circle */}
                <div
                  className={cn(
                    "w-10 h-10 flex items-center justify-center border-2 transition-all duration-300 relative",
                    isCompleted
                      ? "bg-zinc-900 border-zinc-900 text-white"
                      : isActive
                      ? "bg-white border-zinc-900 text-zinc-900 shadow-lg shadow-zinc-900/10"
                      : isLocked
                      ? "bg-zinc-50 border-zinc-200 text-zinc-300"
                      : "bg-white border-zinc-300 text-zinc-500 hover:border-zinc-900"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}

                  {/* Active pulse ring */}
                  {isActive && !isCompleted && (
                    <motion.span
                      className="absolute inset-0 border-2 border-zinc-900"
                      animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center max-w-[96px]">
                  <p
                    className={cn(
                      "text-[10px] font-bold tracking-wide uppercase leading-tight",
                      isCompleted
                        ? "text-zinc-900"
                        : isActive
                        ? "text-zinc-900"
                        : "text-zinc-400"
                    )}
                  >
                    {stage.stage_name.length > 22
                      ? stage.stage_name.slice(0, 22) + "…"
                      : stage.stage_name}
                  </p>
                  <p className="text-[9px] text-zinc-400 mt-0.5">
                    {stage.skills?.length ?? 0} topics
                  </p>
                </div>
              </motion.button>

              {/* Connector line */}
              {idx < stages.length - 1 && (
                <div className="relative mx-2 flex items-center" style={{ marginBottom: "28px" }}>
                  <div className="w-12 h-px bg-zinc-200" />
                  <motion.div
                    className="absolute left-0 h-px bg-zinc-900 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ width: "48px" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
