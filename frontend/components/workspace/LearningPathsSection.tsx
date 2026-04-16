"use client";

import { motion } from "framer-motion";
import { Layers, ArrowRight } from "lucide-react";

export default function LearningPathsSection() {
  const mockPaths = [
    {
      title: "Frontend Architect",
      topics: ["HTML/CSS", "JavaScript Deep Dive", "React internals", "System Design"],
      color: "bg-zinc-900 border-zinc-900",
      textColor: "text-white",
      badgeColor: "bg-white/10 text-zinc-300",
    },
    {
      title: "AI Practitioner",
      topics: ["Python", "Machine Learning Basics", "Deep Learning", "LLMs"],
      color: "bg-white border-zinc-200",
      textColor: "text-zinc-900",
      badgeColor: "bg-zinc-100 text-zinc-600",
    },
    {
      title: "Backend Specialist",
      topics: ["Node.js", "Databases", "APIs & Microservices", "CI/CD & Docker"],
      color: "bg-[#655C7A] border-[#655C7A]",
      textColor: "text-white",
      badgeColor: "bg-white/10 text-white",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
        <Layers className="w-5 h-5 text-zinc-900" />
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Learning Paths</h2>
      </div>
      <p className="text-sm text-zinc-500">
        Predefined sequences of topics grouped together for a comprehensive skill track.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockPaths.map((path, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className={`p-8 border flex flex-col justify-between group cursor-pointer ${path.color}`}
          >
            <div>
              <span className={`text-[10px] font-bold tracking-widest uppercase mb-4 block ${path.textColor} opacity-60`}>
                Sequence Track
              </span>
              <h3 className={`text-2xl font-bold mb-6 ${path.textColor}`}>{path.title}</h3>

              <div className="flex flex-col gap-2 relative pl-3">
                <div className={`absolute left-0 top-1 bottom-1 w-px ${path.badgeColor}`} />
                {path.topics.map((t, i) => (
                  <div key={i} className={`text-sm font-medium ${path.textColor}`}>
                    <span className="opacity-50 text-[10px] w-5 inline-block">{i + 1}.</span> {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                className={`inline-flex items-center text-[10px] font-bold uppercase tracking-widest ${path.textColor} group-hover:underline`}
              >
                Explore Path <ArrowRight className="ml-2 w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
