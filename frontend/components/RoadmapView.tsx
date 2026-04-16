"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RoadmapProgress from "./roadmap/RoadmapProgress";
import ProgressTracker from "./roadmap/ProgressTracker";
import TopicDetailPanel from "./roadmap/TopicDetailPanel";
import SupportingPanel from "./roadmap/SupportingPanel";

export interface Resource {
  title: string;
  type: "video" | "documentation" | "project";
  url: string;
  topic?: string;
}

interface Stage {
  stage_name: string;
  skills: string[];
  resources?: Record<string, Resource[]>;
  recommended_projects?: string[];
}

interface Roadmap {
  role: string;
  stages: Stage[];
}

interface RoadmapViewProps {
  roadmap: Roadmap;
  resources?: Resource[];
  initialProgress?: { completed_stages: number; total_stages: number };
  firebaseId?: string;
  onReturnToDashboard?: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  frontend: "Frontend Developer",
  backend: "Backend Developer",
  fullstack: "Full Stack Developer",
  ai: "AI Engineer",
  devops: "DevOps Engineer",
  mobile: "Mobile Developer",
  unsure: "Developer",
};

export default function RoadmapView({
  roadmap,
  resources = [],
  initialProgress,
  onReturnToDashboard,
}: RoadmapViewProps) {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<Set<number>>(
    () => new Set()
  );

  const [localRoadmap, setLocalRoadmap] = useState<Roadmap>(roadmap);
  const [isLoadingResources, setIsLoadingResources] = useState(false);

  // Sync prop changes to local state just in case
  useEffect(() => {
    if (roadmap) setLocalRoadmap(roadmap);
  }, [roadmap]);

  useEffect(() => {
    const fetchResources = async () => {
      if (!localRoadmap || !localRoadmap.stages?.length) return;
      const stage = localRoadmap.stages[activeStageIndex];
      
      // If resources are completely empty, fetch them
      if (!stage.resources || Object.keys(stage.resources).length === 0) {
        if (!stage.skills || stage.skills.length === 0) return;
        setIsLoadingResources(true);
        try {
          const res = await fetch("/api/resources", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              topics: stage.skills,
            }),
          });
          const data = await res.json();
          if (data.resources) {
            setLocalRoadmap((prev) => {
              const newRoadmap = { ...prev };
              newRoadmap.stages[activeStageIndex] = {
                ...newRoadmap.stages[activeStageIndex],
                resources: data.resources,
              };
              return newRoadmap;
            });
          }
        } catch (error) {
          console.error("Failed to fetch resources:", error);
        } finally {
          setIsLoadingResources(false);
        }
      }
    };
    fetchResources();
  }, [activeStageIndex, localRoadmap]);

  useEffect(() => {
    if (completedStages.size === stages.length && stages.length > 0) {
      const timer = setTimeout(() => {
        if (onReturnToDashboard) onReturnToDashboard();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [completedStages.size, stages.length, onReturnToDashboard]);

  if (!localRoadmap || !localRoadmap.stages?.length) return null;

  const stages = localRoadmap.stages;
  const activeStage = stages[activeStageIndex];
  const nextStage = stages[activeStageIndex + 1] ?? null;

  // Collect all skills across all stages (for SupportingPanel "related skills")
  const allSkills = stages.flatMap((s) => s.skills ?? []);
  const activeSkills = activeStage.skills ?? [];

  const handleComplete = useCallback(() => {
    setCompletedStages((prev) => {
      const next = new Set(prev);
      next.add(activeStageIndex);
      return next;
    });
    // Auto-advance to next stage if not last
    if (activeStageIndex < stages.length - 1) {
      setActiveStageIndex(activeStageIndex + 1);
    }
  }, [activeStageIndex, stages.length]);

  const roleLabel =
    ROLE_LABELS[roadmap.role?.toLowerCase()] ?? roadmap.role?.toUpperCase() ?? "Your";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* ── Dashboard wrapper ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14 space-y-8">

        {/* ── Header Row ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800"
        >
          <div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-2">
              Your Personalized Roadmap
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {roleLabel} Path
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              {stages.length} stages • {allSkills.length} topics to master
            </p>
          </div>
          <ProgressTracker
            completed={completedStages.size}
            total={stages.length}
          />
        </motion.div>

        {/* ── Stage Node Rail ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm"
        >
          <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-5">
            Learning Path
          </p>
          <RoadmapProgress
            stages={stages}
            activeIndex={activeStageIndex}
            completedStages={completedStages}
            onSelectStage={setActiveStageIndex}
          />
        </motion.div>

        {/* ── Main Content: Detail + Supporting ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Topic Detail Panel — 2/3 width */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStageIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm min-h-[520px] flex flex-col"
            >
              <TopicDetailPanel
                stage={activeStage}
                stageIndex={activeStageIndex}
                isCompleted={completedStages.has(activeStageIndex)}
                onComplete={handleComplete}
                isLoadingResources={isLoadingResources}
              />
            </motion.div>
          </AnimatePresence>

          {/* Supporting Panel — 1/3 width */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`support-${activeStageIndex}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="lg:col-span-1"
            >
              <SupportingPanel
                activeStage={activeStage}
                nextStage={nextStage ?? undefined}
                allSkills={allSkills}
                activeSkills={activeSkills}
              />
            </motion.div>
          </AnimatePresence>
        </div>

      {/* ── Completion Banner ─────────────────────────────── */}
        <AnimatePresence>
          {completedStages.size === stages.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-zinc-900 dark:bg-zinc-800 text-white p-8 text-center mt-6"
            >
              <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-3">
                🎉 Roadmap Complete
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                You've mastered the {roleLabel} path!
              </h2>
              <p className="text-zinc-400 text-sm mb-2">
                All {stages.length} stages completed. Time to build something
                great.
              </p>
              <p className="text-zinc-500 text-xs animate-pulse">
                Redirecting to dashboard in a moment...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
