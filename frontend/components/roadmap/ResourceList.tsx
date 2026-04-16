"use client";

import { ExternalLink, FileText, Video, Wrench, Star, FolderGit2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export interface Resource {
  title: string;
  type: "video" | "documentation" | "project" | "github";
  url: string;
  topic?: string;
  stars?: number;
  description?: string;
  readme_url?: string;
  depth?: "beginner" | "intermediate" | "advanced" | "all";
}

interface ResourceListProps {
  resources: Resource[];
  emptyMessage?: string;
  /** When true, renders resources grouped by type with section headers. */
  grouped?: boolean;
}

const TYPE_CONFIG: Record<Resource["type"], {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  badge: string;
  sectionBg: string;
  sectionText: string;
  sectionDot: string;
}> = {
  video: {
    label: "VIDEO",
    Icon: Video,
    badge: "bg-[#655C7A] text-white",
    sectionBg: "bg-[#655C7A]/8 dark:bg-[#655C7A]/20",
    sectionText: "text-[#655C7A] dark:text-[#8E82A8]",
    sectionDot: "bg-[#655C7A]",
  },
  documentation: {
    label: "DOCS",
    Icon: FileText,
    badge: "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900",
    sectionBg: "bg-zinc-50 dark:bg-zinc-800",
    sectionText: "text-zinc-700 dark:text-zinc-300",
    sectionDot: "bg-zinc-700 dark:bg-zinc-300",
  },
  github: {
    label: "GITHUB",
    Icon: FolderGit2,
    badge: "bg-amber-400 text-black",
    sectionBg: "bg-amber-50 dark:bg-amber-900/20",
    sectionText: "text-amber-700 dark:text-amber-400",
    sectionDot: "bg-amber-500",
  },
  project: {
    label: "PROJECT",
    Icon: Wrench,
    badge: "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-900 dark:border-zinc-100",
    sectionBg: "bg-blue-50 dark:bg-blue-900/20",
    sectionText: "text-blue-700 dark:text-blue-400",
    sectionDot: "bg-blue-500",
  },
};

const DEPTH_BADGE: Record<string, string> = {
  beginner: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400",
  intermediate: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400",
  advanced: "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-400",
};

const TYPE_ORDER: Resource["type"][] = ["video", "documentation", "github", "project"];

// ── Single Resource Card ─────────────────────────────────────────────────────
function ResourceCard({ res, idx }: { res: Resource; idx: number }) {
  const cfg = TYPE_CONFIG[res.type] ?? TYPE_CONFIG.documentation;
  const Icon = cfg.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.04, duration: 0.25 }}
    >
      <a
        href={res.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-500 transition-all duration-200 hover:shadow-sm"
      >
        {/* Type Icon */}
        <div className="shrink-0 p-2 bg-zinc-50 dark:bg-zinc-800 group-hover:bg-zinc-900 dark:group-hover:bg-zinc-100 group-hover:text-white dark:group-hover:text-zinc-900 text-zinc-600 dark:text-zinc-400 transition-colors duration-200">
          <Icon className="w-3.5 h-3.5" />
        </div>

        {/* Title + Description */}
        <div className="flex-1 min-w-0">
          <span className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white leading-snug truncate">
            {res.title}
          </span>
          {res.description && (
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 line-clamp-1 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 font-light mt-0.5">
              {res.description}
            </p>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Depth badge */}
          {res.depth && res.depth !== "all" && (
            <span className={`text-[9px] font-bold tracking-widest px-1.5 py-0.5 ${DEPTH_BADGE[res.depth] ?? ""}`}>
              {res.depth.toUpperCase()}
            </span>
          )}

          {/* Stars (github only) */}
          {res.type === "github" && res.stars && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-400/10 text-yellow-700 text-[10px] font-bold">
              <Star className="w-2.5 h-2.5 fill-current" />
              {res.stars > 1000 ? `${(res.stars / 1000).toFixed(1)}k` : res.stars}
            </div>
          )}

          {/* Type badge */}
          <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 ${cfg.badge}`}>
            {cfg.label}
          </span>

          <ExternalLink className="w-3 h-3 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors shrink-0" />
        </div>
      </a>
    </motion.div>
  );
}

// ── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ type, count }: { type: Resource["type"]; count: number }) {
  const cfg = TYPE_CONFIG[type];
  const LABELS: Record<Resource["type"], string> = {
    video: "Video Tutorials",
    documentation: "Documentation & Guides",
    github: "GitHub Repositories",
    project: "Project Resources",
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 ${cfg.sectionBg} mb-2`}>
      <div className={`w-1.5 h-1.5 rounded-full ${cfg.sectionDot}`} />
      <span className={`text-[10px] font-bold tracking-widest uppercase ${cfg.sectionText}`}>
        {LABELS[type]}
      </span>
      <span className={`ml-auto text-[9px] font-bold ${cfg.sectionText} opacity-60`}>
        {count} {count === 1 ? "resource" : "resources"}
      </span>
    </div>
  );
}

// ── Main Export ──────────────────────────────────────────────────────────────
export default function ResourceList({ resources, emptyMessage, grouped = false }: ResourceListProps) {
  if (!resources || resources.length === 0) {
    return (
      <p className="text-sm text-zinc-400 py-6 text-center">
        {emptyMessage ?? "No resources available for this stage."}
      </p>
    );
  }

  // ── Flat list (ungrouped) ────────────────────────────────────────────────
  if (!grouped) {
    return (
      <ul className="space-y-2">
        {resources.map((res, idx) => (
          <li key={`${res.url}-${idx}`}>
            <ResourceCard res={res} idx={idx} />
          </li>
        ))}
      </ul>
    );
  }

  // ── Grouped by type ──────────────────────────────────────────────────────
  const byType: Partial<Record<Resource["type"], Resource[]>> = {};
  for (const res of resources) {
    if (!byType[res.type]) byType[res.type] = [];
    byType[res.type]!.push(res);
  }

  const orderedTypes = TYPE_ORDER.filter(t => (byType[t]?.length ?? 0) > 0);

  let globalIdx = 0;
  return (
    <div className="space-y-5">
      {orderedTypes.map(type => {
        const group = byType[type]!;
        return (
          <div key={type}>
            <SectionHeader type={type} count={group.length} />
            <ul className="space-y-2">
              {group.map((res) => {
                const idx = globalIdx++;
                return (
                  <li key={`${res.url}-${idx}`}>
                    <ResourceCard res={res} idx={idx} />
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
