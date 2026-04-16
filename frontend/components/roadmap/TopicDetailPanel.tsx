"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ResourceList, { type Resource } from "./ResourceList";
import VerificationPanel from "./VerificationPanel";
import { BookOpen, FolderGit2, ShieldCheck, ChevronDown, ChevronUp, Layers } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from "@/lib/utils";

interface Stage {
  stage_name: string;
  skills: string[];
  resources?: Record<string, Resource[]>;
  recommended_projects?: string[];
}

interface TopicDetailPanelProps {
  stage: Stage;
  stageIndex: number;
  isCompleted: boolean;
  onComplete: () => void;
}

const TABS = [
  { id: "resources", label: "Resources", Icon: Layers },
  { id: "projects", label: "Projects", Icon: FolderGit2 },
  { id: "deep_dive", label: "Deep Dive", Icon: BookOpen },
  { id: "verify", label: "Verify", Icon: ShieldCheck },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** Get all resources for the stage, deduplicated by URL. */
function getAllResources(resources?: Record<string, Resource[]>): Resource[] {
  if (!resources) return [];
  const seen = new Set<string>();
  return Object.values(resources)
    .flat()
    .filter((r) => {
      if (seen.has(r.url)) return false;
      seen.add(r.url);
      return true;
    });
}

/** Get resources for a specific skill. */
function getSkillResources(skill: string, resources?: Record<string, Resource[]>): Resource[] {
  if (!resources) return [];
  // Try exact match
  if (resources[skill]) return resources[skill];
  // Try case-insensitive match
  const lkey = skill.toLowerCase();
  const match = Object.keys(resources).find(k => k.toLowerCase() === lkey);
  return match ? resources[match] : [];
}

/** Collect all skills in the stage that actually have resources. */
function getSkillsWithResources(stage: Stage): string[] {
  if (!stage.resources) return [];
  return stage.skills.filter(skill => {
    const res = getSkillResources(skill, stage.resources);
    return res.length > 0;
  });
}

/** Find the README URL from the first github resource available. */
function findTopReadmeUrl(resources?: Record<string, Resource[]>): string | null {
  if (!resources) return null;
  for (const list of Object.values(resources)) {
    const github = list.find(r => r.type === 'github' && r.readme_url);
    if (github?.readme_url) return github.readme_url;
  }
  return null;
}

export default function TopicDetailPanel({
  stage,
  stageIndex,
  isCompleted,
  onComplete,
}: TopicDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("resources");
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [readmeContent, setReadmeContent] = useState<string>('');
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [isReadmeExpanded, setIsReadmeExpanded] = useState(false);

  // Reset skill filter when stage changes
  useEffect(() => {
    setActiveSkill(null);
    setReadmeContent('');
    setIsReadmeExpanded(false);
  }, [stageIndex]);

  const skillsWithResources = getSkillsWithResources(stage);
  const hasMultipleSkillResources = skillsWithResources.length > 1;

  // Determine displayed resources based on skill filter
  const displayedResources: Resource[] = activeSkill
    ? getSkillResources(activeSkill, stage.resources)
    : getAllResources(stage.resources);

  const topReadmeUrl = findTopReadmeUrl(stage.resources);

  useEffect(() => {
    if (activeTab === 'deep_dive' && topReadmeUrl && !readmeContent) {
      setReadmeLoading(true);
      fetch(topReadmeUrl)
        .then(res => res.text())
        .then(text => {
          setReadmeContent(text);
          setReadmeLoading(false);
        })
        .catch(err => {
          console.error('Error fetching README:', err);
          setReadmeLoading(false);
        });
    }
  }, [activeTab, topReadmeUrl, readmeContent]);

  return (
    <div className="flex flex-col h-full">
      {/* Stage Header */}
      <div className="pb-5 border-b border-zinc-100 dark:border-zinc-800 mb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-2">
              Stage {stageIndex + 1}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
              {stage.stage_name}
            </h2>
          </div>
          {isCompleted && (
            <span className="shrink-0 text-[9px] font-bold tracking-widest bg-zinc-900 dark:bg-zinc-800 text-white px-3 py-1.5 uppercase">
              Completed
            </span>
          )}
        </div>

        {stage.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {stage.skills.map((skill, i) => (
              <span
                key={i}
                className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tab Bar */}
      <div className="flex border-b border-zinc-100 dark:border-zinc-800 mb-5 overflow-x-auto scrollbar-hide">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-bold tracking-widest uppercase border-b-2 transition-all duration-200 -mb-px whitespace-nowrap",
              activeTab === id
                ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
                : "border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {id === "resources" && displayedResources.length > 0 && (
              <span className="ml-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {getAllResources(stage.resources).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {/* ── RESOURCES TAB ──────────────────────────────────── */}
            {activeTab === "resources" && (
              <div className="space-y-4">
                {/* Skill Filter Pills */}
                {hasMultipleSkillResources && (
                  <div className="flex flex-wrap gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <button
                      onClick={() => setActiveSkill(null)}
                      className={cn(
                        "text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 border transition-all duration-150",
                        activeSkill === null
                          ? "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900"
                          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-700 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                      )}
                    >
                      All Topics
                    </button>
                    {skillsWithResources.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => setActiveSkill(activeSkill === skill ? null : skill)}
                        className={cn(
                          "text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 border transition-all duration-150",
                          activeSkill === skill
                            ? "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-700 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                        )}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}

                {/* Active Skill / "All Topics" Label */}
                {activeSkill && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                      Showing resources for:
                    </span>
                    <span className="text-[10px] font-bold tracking-widest text-zinc-900 dark:text-zinc-100 uppercase">
                      {activeSkill}
                    </span>
                  </div>
                )}

                {/* Resource List — grouped by type */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSkill ?? "all"}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ResourceList
                      resources={displayedResources}
                      emptyMessage={
                        activeSkill
                          ? `No curated resources found for "${activeSkill}" yet.`
                          : "No resources found for this stage."
                      }
                      grouped
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* ── DEEP DIVE TAB ──────────────────────────────────── */}
            {activeTab === "deep_dive" && (
              <div className="relative">
                {readmeLoading ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent dark:border-t-transparent animate-spin mx-auto" />
                    <p className="text-sm font-bold tracking-widest text-zinc-400 uppercase">Fetching Documentation...</p>
                  </div>
                ) : readmeContent ? (
                  <div className={cn(
                    "prose prose-zinc dark:prose-invert prose-sm max-w-none text-zinc-600 dark:text-zinc-400 font-light",
                    !isReadmeExpanded && "max-h-[400px] overflow-hidden"
                  )}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {readmeContent}
                    </ReactMarkdown>
                    {!isReadmeExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-50 dark:from-zinc-900 to-transparent pointer-events-none" />
                    )}
                    <div className={cn("mt-6 pb-12 text-center", !isReadmeExpanded && "relative z-10")}>
                      <button
                        onClick={() => setIsReadmeExpanded(!isReadmeExpanded)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold tracking-widest uppercase hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg"
                      >
                        {isReadmeExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {isReadmeExpanded ? 'Show Less' : 'Read More'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400 py-12 text-center italic">
                    {topReadmeUrl
                      ? "No README content found for this stage."
                      : "Select a stage with GitHub resources to access the Deep Dive."}
                  </p>
                )}
              </div>
            )}

            {/* ── PROJECTS TAB ──────────────────────────────────── */}
            {activeTab === "projects" && (
              <div className="space-y-2">
                {(stage.recommended_projects?.length ?? 0) > 0 ? (
                  stage.recommended_projects!.map((proj, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors hover:border-zinc-900 dark:hover:border-zinc-500"
                    >
                      <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase w-6 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{proj}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-400 py-6 text-center">
                    No projects defined for this stage.
                  </p>
                )}
              </div>
            )}

            {/* ── VERIFY TAB ──────────────────────────────────────── */}
            {activeTab === "verify" && (
              <VerificationPanel
                stageName={stage.stage_name}
                skills={stage.skills ?? []}
                isCompleted={isCompleted}
                onComplete={onComplete}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
