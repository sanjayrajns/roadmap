"use client";

import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Target, Clock, CheckCircle, Loader2 } from "lucide-react";
import ProgressTracker from "../roadmap/ProgressTracker";
import { useEffect, useState } from "react";

interface DashboardSectionProps {
  roadmap: any;
  progress: any;
  resources: any[];
  onNavigateToRoadmap: () => void;
}

export default function DashboardSection({
  roadmap,
  progress,
  resources,
  onNavigateToRoadmap,
}: DashboardSectionProps) {
  const [liveRoadmap, setLiveRoadmap] = useState(roadmap);
  const [liveProgress, setLiveProgress] = useState(progress);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("localRoadmapCache");
      if (cached) {
        const parsed = JSON.parse(cached);
        setLiveRoadmap(parsed.roadmap);
        setLiveProgress(parsed.progress);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const completedStages = liveProgress?.completed_stages ?? 0;
  const totalStages = liveRoadmap?.stages?.length ?? 1;

  // Determine current active stage
  const currStageIndex = Math.min(completedStages, totalStages - 1);
  const currentStage = liveRoadmap?.stages?.[currStageIndex];
  
  const stageResources = currentStage?.resources 
    ? Object.values(currentStage.resources).flat() 
    : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <LayoutDashboard className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Resume Card */}
        <div className="md:col-span-2 bg-zinc-900 dark:bg-zinc-800 border border-zinc-900 dark:border-zinc-700 p-8 text-white flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-4 block">
              Up Next
            </span>
            <h3 className="text-3xl font-bold mb-2 text-white">
              {currentStage?.stage_name || "Completed Roadmap"}
            </h3>
            <p className="text-zinc-300 dark:text-zinc-400 mt-2 text-sm max-w-sm">
              Ready to dive back into your learning journey? Continue where you left off.
            </p>
          </div>
          <div className="mt-8">
            <button
              onClick={onNavigateToRoadmap}
              className="inline-flex items-center bg-white text-zinc-900 px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-zinc-100 transition-colors"
            >
              Resume Learning <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Stats Box */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
              Overview
            </h4>
            <ProgressTracker completed={completedStages} total={totalStages} />
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Target className="w-4 h-4 text-zinc-400" />
              <span className="text-sm text-zinc-600 font-medium">{totalStages} Total Stages</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-zinc-400" />
              <span className="text-sm text-zinc-600 font-medium">{completedStages} Completed</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Updated just now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Resources Snapshot */}
      <div>
        <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-4">
          Quick Resources
        </h4>
        <div className="min-h-[120px]">
          {stageResources.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-none bg-zinc-50 dark:bg-zinc-900/50">
              <Loader2 className="w-6 h-6 text-zinc-400 animate-spin mb-3" />
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Discovering optimal resources...</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Start learning to view materials.</p>
              <button 
                onClick={onNavigateToRoadmap}
                className="mt-4 text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 underline hover:text-zinc-600"
              >
                Go to Module
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stageResources.slice(0, 3).map((res: any, i: number) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-900 dark:hover:border-zinc-500 transition-colors group block"
                >
                  <div className="mb-2">
                    <span className="text-[9px] font-bold tracking-widest uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-zinc-600 dark:text-zinc-400">
                      {res.type}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:underline">
                    {res.title}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
