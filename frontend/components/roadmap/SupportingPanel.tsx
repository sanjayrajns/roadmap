"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, Code2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stage {
  stage_name: string;
  skills: string[];
  recommended_projects?: string[];
}

interface SupportingPanelProps {
  activeStage: Stage;
  nextStage?: Stage;
  allSkills: string[];
  activeSkills: string[];
}

export default function SupportingPanel({
  activeStage,
  nextStage,
  allSkills,
  activeSkills,
}: SupportingPanelProps) {
  // Related skills = all skills excluding those in the current stage
  const related = allSkills
    .filter((s) => !activeSkills.map((a) => a.toLowerCase()).includes(s.toLowerCase()))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Recommended Projects */}
      {(activeStage.recommended_projects?.length ?? 0) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-5 border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-zinc-900 dark:bg-zinc-100">
              <Code2 className="w-3.5 h-3.5 text-white dark:text-zinc-900" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-900 dark:text-zinc-100 uppercase">
              Build These
            </span>
          </div>
          <ul className="space-y-2">
            {activeStage.recommended_projects!.map((proj, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 font-medium"
              >
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 tracking-widest w-4 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {proj}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Related Skills */}
      {related.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-5 border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-[#655C7A]">
              <Layers className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-900 dark:text-zinc-100 uppercase">
              Related Skills
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {related.map((skill, i) => (
              <span
                key={i}
                className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* What's Next */}
      {nextStage && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="p-5 border border-zinc-900 dark:border-zinc-800 bg-zinc-900 dark:bg-zinc-800 text-white"
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Up Next
            </span>
          </div>
          <p className="text-sm font-bold text-white leading-snug mb-3">
            {nextStage.stage_name}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {nextStage.skills?.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 bg-white/10 dark:bg-black/20 text-zinc-300 dark:text-zinc-400"
              >
                {skill}
              </span>
            ))}
            {(nextStage.skills?.length ?? 0) > 3 && (
              <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 bg-white/10 dark:bg-black/20 text-zinc-400 dark:text-zinc-500">
                +{nextStage.skills.length - 3} more
              </span>
            )}
          </div>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            Complete this stage to unlock
            <ArrowRight className="w-3 h-3" />
          </p>
        </motion.div>
      )}
    </div>
  );
}
