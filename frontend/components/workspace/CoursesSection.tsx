"use client";

import { motion } from "framer-motion";
import { BookOpen, ExternalLink, PlayCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoursesSectionProps {
  resources: any[];
}

export default function CoursesSection({ resources }: CoursesSectionProps) {
  // Only show generic courses/tutorials
  const sortedResources = [...resources].sort((a, b) => {
    // prioritize video over doc over project for "Courses"
    const order = { video: 1, documentation: 2, project: 3 };
    return (order[a.type as keyof typeof order] || 4) - (order[b.type as keyof typeof order] || 4);
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
        <BookOpen className="w-5 h-5 text-zinc-900" />
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Curated Courses</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedResources.map((res, i) => {
          const isVideo = res.type === "video";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="bg-white border border-zinc-200 flex flex-col group hover:border-zinc-900 transition-colors"
            >
              {/* Card Header / Graphic placeholder */}
              <div
                className={cn(
                  "h-32 flex items-center justify-center relative overflow-hidden",
                  isVideo ? "bg-[#655C7A]" : "bg-zinc-900"
                )}
              >
                {isVideo ? (
                  <PlayCircle className="w-12 h-12 text-white/50 group-hover:text-white group-hover:scale-110 transition-all" />
                ) : (
                  <FileText className="w-12 h-12 text-white/50 group-hover:text-white group-hover:scale-110 transition-all" />
                )}
                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm px-2 py-1 text-[9px] font-bold tracking-widest text-white uppercase">
                  {res.topic || res.type}
                </div>
              </div>

              {/* Info Area */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-sm font-bold text-zinc-900 mb-2 leading-snug">
                  {res.title}
                </h3>
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-zinc-100 justify-between">
                  <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                    {res.type}
                  </span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-900 hover:text-[#655C7A] transition-colors"
                  >
                    View Course <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
