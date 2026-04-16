"use client";

import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Target, Clock, CheckCircle } from "lucide-react";
import ProgressTracker from "../roadmap/ProgressTracker";

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
  const completedStages = progress?.completed_stages ?? 0;
  const totalStages = roadmap?.stages?.length ?? 1;

  // Determine current active stage
  const currStageIndex = Math.min(completedStages, totalStages - 1);
  const currentStage = roadmap?.stages?.[currStageIndex];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
        <LayoutDashboard className="w-5 h-5 text-zinc-900" />
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Resume Card */}
        <div className="md:col-span-2 bg-zinc-900 p-8 text-white flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-4 block">
              Up Next
            </span>
            <h3 className="text-3xl font-bold mb-2">
              {currentStage?.stage_name || "Completed Roadmap"}
            </h3>
            <p className="text-zinc-400 mt-2 text-sm max-w-sm">
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
        <div className="bg-white border border-zinc-200 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-900">
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
              <span className="text-sm text-zinc-600 font-medium">Updated just now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Resources Snapshot */}
      <div>
        <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-4">
          Quick Resources
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.slice(0, 3).map((res, i) => (
            <a
              key={i}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-zinc-200 bg-white hover:border-zinc-900 transition-colors group block"
            >
              <div className="mb-2">
                <span className="text-[9px] font-bold tracking-widest uppercase bg-zinc-100 px-2 py-1 text-zinc-600">
                  {res.type}
                </span>
              </div>
              <p className="text-sm font-bold text-zinc-900 mb-1 group-hover:underline">
                {res.title}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
