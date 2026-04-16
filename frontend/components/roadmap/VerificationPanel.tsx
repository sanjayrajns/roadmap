"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Square, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationPanelProps {
  stageName: string;
  skills: string[];
  isCompleted: boolean;
  onComplete: () => void;
}

function buildQuestions(skills: string[]): string[] {
  return skills.slice(0, 4).map(
    (skill) => `I understand the fundamentals of "${skill}" and have reviewed relevant resources.`
  );
}

export default function VerificationPanel({
  stageName,
  skills,
  isCompleted,
  onComplete,
}: VerificationPanelProps) {
  const questions = buildQuestions(skills);
  const [checked, setChecked] = useState<boolean[]>(() =>
    questions.map(() => isCompleted)
  );

  const allChecked = checked.every(Boolean);

  const toggle = (idx: number) => {
    if (isCompleted) return;
    const next = [...checked];
    next[idx] = !next[idx];
    setChecked(next);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-1">
          Self-Verification Checklist
        </p>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Confirm each item before marking this stage complete.
        </p>
      </div>

      <ul className="space-y-3">
        {questions.map((q, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.07 }}
          >
            <button
              onClick={() => toggle(idx)}
              disabled={isCompleted}
              className={cn(
                "w-full flex items-start gap-3 p-4 border text-left transition-all duration-200",
                checked[idx]
                  ? "bg-zinc-900 border-zinc-900 text-white"
                  : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-900"
              )}
            >
              <div className="shrink-0 mt-0.5">
                {checked[idx] ? (
                  <CheckSquare className="w-4 h-4 text-white" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-400" />
                )}
              </div>
              <span className="text-sm font-medium leading-snug">{q}</span>
            </button>
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {isCompleted ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200"
          >
            <div className="w-6 h-6 bg-zinc-900 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-bold text-zinc-900">
              Stage completed! Next stage unlocked.
            </p>
          </motion.div>
        ) : (
          <motion.button
            key="cta"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: allChecked ? 1 : 0.5, y: 0 }}
            onClick={() => allChecked && onComplete()}
            disabled={!allChecked}
            className={cn(
              "w-full py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300",
              allChecked
                ? "bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10 cursor-pointer"
                : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
            )}
          >
            {allChecked ? "Mark Stage as Complete →" : "Complete all items to continue"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
