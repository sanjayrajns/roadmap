"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Layers, BookOpen, Zap, CheckCircle2, Sparkles
} from "lucide-react";

interface GeneratingScreenProps {
  role: string;
  experience: string;
  interest: string;
  learningStyle: string;
  timeCommitment: number;
  onComplete?: () => void;
}

const STEPS = [
  {
    id: "structure",
    label: "Building Roadmap Structure",
    sublabel: "Mapping canonical stages from roadmap.sh",
    Icon: MapPin,
    duration: 3500,
  },
  {
    id: "skills",
    label: "Resolving Skill Graph",
    sublabel: "Computing dependencies and topic depth",
    Icon: Layers,
    duration: 2800,
  },
  {
    id: "resources",
    label: "Discovering Resources",
    sublabel: "Curating videos, docs and GitHub repos",
    Icon: BookOpen,
    duration: 4000,
  },
  {
    id: "personalizing",
    label: "Personalizing Your Path",
    sublabel: "Filtering by experience level and learning style",
    Icon: Zap,
    duration: 2500,
  },
  {
    id: "finalizing",
    label: "Finalizing Roadmap",
    sublabel: "Saving your personalized learning path",
    Icon: Sparkles,
    duration: 2000,
  },
];

const STYLE_LABELS: Record<string, string> = {
  video: "Video Tutorials",
  documentation: "Reading Docs",
  project_based: "Project-Based",
  interactive: "Interactive",
};

const EXP_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const ROLE_LABELS: Record<string, string> = {
  frontend: "Frontend Developer",
  backend: "Backend Developer",
  fullstack: "Full Stack Developer",
  devops: "DevOps Engineer",
  "ai-engineer": "AI Engineer",
  "data-scientist": "AI & Data Scientist",
  android: "Android Developer",
  ios: "iOS Developer",
  "software-architect": "Software Architect",
  "cyber-security": "Cyber Security",
  "ux-design": "UX Designer",
  qa: "QA Engineer",
  blockchain: "Blockchain Developer",
  react: "React",
  vue: "Vue.js",
  angular: "Angular",
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  node: "Node.js",
  java: "Java",
  go: "Go",
  rust: "Rust",
};

export default function GeneratingScreen({
  role,
  experience,
  interest,
  learningStyle,
  timeCommitment,
  onComplete,
}: GeneratingScreenProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Advance steps on timer — purely cosmetic, the real API runs in parallel
  useEffect(() => {
    let idx = 0;
    const advance = () => {
      if (idx >= STEPS.length) return;
      const duration = STEPS[idx].duration;
      setTimeout(() => {
        setCompletedSteps((prev) => {
          const next = new Set(prev);
          next.add(idx);
          return next;
        });
        idx++;
        if (idx < STEPS.length) {
          setActiveStep(idx);
          advance();
        } else {
          if (onComplete) {
            setTimeout(onComplete, 1000);
          }
        }
      }, duration);
    };
    advance();
  }, [onComplete]);

  const roleLabel = ROLE_LABELS[role] ?? role.charAt(0).toUpperCase() + role.slice(1);
  const progress = Math.round((completedSteps.size / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">

      {/* Ambient background grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Floating glow blobs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#655C7A]/10 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.07, 0.14, 0.07] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-zinc-700/20 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative z-10 w-full max-w-xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase block mb-4">
            Synthesizing Your Path
          </span>
          <h1 className="text-4xl md:text-5xl font-thin tracking-tighter text-white leading-tight">
            Building your<br />
            <span className="text-zinc-400">{roleLabel}</span> roadmap
          </h1>
        </motion.div>

        {/* Config Summary Chips */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {[
            EXP_LABELS[experience] ?? experience,
            STYLE_LABELS[learningStyle] ?? learningStyle,
            timeCommitment ? `${timeCommitment}h / week` : null,
            interest ? interest.replace(/_/g, " ") : null,
          ]
            .filter(Boolean)
            .map((chip) => (
              <span
                key={chip}
                className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 border border-zinc-700 text-zinc-400 bg-zinc-900"
              >
                {chip}
              </span>
            ))}
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
              Progress
            </span>
            <motion.span
              key={progress}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase tabular-nums"
            >
              {progress}%
            </motion.span>
          </div>

          {/* Track */}
          <div className="h-px bg-zinc-800 w-full relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-white"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            {/* Shimmer effect on the progress bar */}
            <motion.div
              className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ left: ["-10%", "110%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
              style={{ left: `${progress - 10}%` }}
            />
          </div>
        </motion.div>

        {/* Step List */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="space-y-1"
        >
          {STEPS.map((step, i) => {
            const isDone = completedSteps.has(i);
            const isActive = activeStep === i && !isDone;
            const isPending = !isDone && !isActive;
            const Icon = step.Icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className={`flex items-center gap-4 px-5 py-4 border transition-all duration-500 ${
                  isDone
                    ? "border-zinc-800 bg-zinc-900/40"
                    : isActive
                    ? "border-zinc-600 bg-zinc-900"
                    : "border-transparent bg-transparent"
                }`}
              >
                {/* Icon / Status */}
                <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isDone ? (
                      <motion.div
                        key="done"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-zinc-400" />
                      </motion.div>
                    ) : isActive ? (
                      <motion.div
                        key="active"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="relative"
                      >
                        {/* Spinning ring */}
                        <motion.div
                          className="w-5 h-5 border-2 border-zinc-700 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="pending"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Icon className="w-4 h-4 text-zinc-700" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Labels */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-bold tracking-wide transition-colors duration-300 ${
                      isDone
                        ? "text-zinc-500"
                        : isActive
                        ? "text-white"
                        : "text-zinc-700"
                    }`}
                  >
                    {step.label}
                  </p>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-[11px] text-zinc-500 font-light mt-0.5 leading-snug"
                      >
                        {step.sublabel}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right: done indicator or step number */}
                <div className="shrink-0">
                  {isDone ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[9px] font-bold tracking-widest text-zinc-600 uppercase"
                    >
                      Done
                    </motion.span>
                  ) : (
                    <span
                      className={`text-[9px] font-bold tracking-widest uppercase ${
                        isActive ? "text-zinc-500" : "text-zinc-800"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom pulse dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-2 mt-10"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-zinc-600"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-[10px] font-bold tracking-widest text-zinc-700 uppercase mt-4"
        >
          This usually takes 15–30 seconds
        </motion.p>
      </div>
    </div>
  );
}
