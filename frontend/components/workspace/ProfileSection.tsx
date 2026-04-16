"use client";

import { motion } from "framer-motion";
import { User, Activity, Flame, Trophy } from "lucide-react";
import ProgressTracker from "../roadmap/ProgressTracker";

interface ProfileSectionProps {
  progress: any;
  roleTitle: string;
}

export default function ProfileSection({ progress, roleTitle }: ProfileSectionProps) {
  const completedStages = progress?.completed_stages ?? 0;
  const totalStages = progress?.total_stages ?? 1;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <User className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">User Profile</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center rounded-none mb-6">
            <span className="text-3xl text-white font-bold">{roleTitle ? roleTitle.charAt(0) : "U"}</span>
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">{roleTitle || "Learner"}</h3>
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-400 mb-6">
            Active Student
          </p>
          <button className="w-full py-2.5 text-xs font-bold uppercase tracking-widest border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:border-zinc-900 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            Edit Profile
          </button>
        </div>

        {/* Stats Grid */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center">
            <Activity className="w-6 h-6 text-zinc-400 mb-4" />
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">{completedStages}</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Stages Completed</span>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center">
            <Flame className="w-6 h-6 text-[#655C7A] mb-4" />
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">3</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Day Streak</span>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center">
            <Trophy className="w-6 h-6 text-zinc-900 dark:text-zinc-400 mb-4" />
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Top 15%</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Learner Rank</span>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center">
            <div className="mb-4">
              <span className="text-[10px] font-bold tracking-widest text-[#655C7A] uppercase mb-2 block">Path Progress</span>
            </div>
            <ProgressTracker completed={completedStages} total={totalStages} />
          </div>
        </div>
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-6">
          Preferences
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Email Notifications</span>
            <div className="w-10 h-5 bg-zinc-900 dark:bg-zinc-100 relative">
              <div className="absolute right-0.5 top-0.5 bottom-0.5 w-4 bg-white dark:bg-zinc-900" />
            </div>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Dark Mode Default</span>
            <div className="w-10 h-5 bg-zinc-200 dark:bg-zinc-800 relative">
              <div className="absolute left-0.5 top-0.5 bottom-0.5 w-4 bg-white dark:bg-zinc-500 shadow-sm border border-zinc-200 dark:border-zinc-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
