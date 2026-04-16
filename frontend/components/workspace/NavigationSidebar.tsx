"use client";

import { LayoutDashboard, Map, BookOpen, Layers, TerminalSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

import ThemeToggle from "@/components/ui/ThemeToggle";

export type SectionId = "dashboard" | "roadmaps" | "courses" | "paths" | "playground" | "profile";

interface NavigationSidebarProps {
  activeSection: SectionId;
  onSelect: (section: SectionId) => void;
  roleTitle: string;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "roadmaps", label: "My Roadmaps", icon: Map },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "paths", label: "Learning Paths", icon: Layers },
  { id: "playground", label: "Playground", icon: TerminalSquare },
  { id: "profile", label: "Profile", icon: User },
] as const;

export default function NavigationSidebar({
  activeSection,
  onSelect,
  roleTitle,
}: NavigationSidebarProps) {
  return (
    <div className="w-full lg:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full flex-shrink-0">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-900 flex items-center justify-center text-white font-bold uppercase">
            {roleTitle ? roleTitle.charAt(0) : "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold">
              Workspace
            </p>
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {roleTitle || "Learner"}
            </p>
          </div>
        </div>
      </div>

      <nav className="p-4 flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-wide uppercase transition-all duration-200 text-left",
                isActive
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-zinc-400")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
        <ThemeToggle variant="pill" className="w-full justify-center" />
        <p className="text-[9px] text-zinc-400 uppercase tracking-widest text-center">
          AI Developer Roadmap
        </p>
      </div>
    </div>
  );
}
