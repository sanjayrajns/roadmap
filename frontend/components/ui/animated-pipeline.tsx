"use client";
import React from "react";
import { motion } from "framer-motion";
import { Database, User, BrainCircuit, Map as MapIcon, BookOpen, Sparkles } from "lucide-react";

export default function AnimatedPipeline() {
  const paths = [
    // Top Left to Center
    { d: "M 60 60 C 130 60 130 150 200 150", delay: 0 },
    // Bottom Left to Center
    { d: "M 60 240 C 130 240 130 150 200 150", delay: 0.5 },
    // Center to Top Right
    { d: "M 200 150 C 270 150 270 60 340 60", delay: 1.5 },
    // Center to Bottom Right
    { d: "M 200 150 C 270 150 270 240 340 240", delay: 2 },
  ];

  return (
    <div className="relative w-full aspect-[4/3] max-w-lg mx-auto flex items-center justify-center p-8 bg-zinc-50/50 rounded-none border border-zinc-100 shadow-xl shadow-zinc-200/40">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#18181b" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        
        {paths.map((p, i) => (
          <g key={i}>
            {/* Background Track */}
            <path
              d={p.d}
              fill="transparent"
              stroke="#e4e4e7" // zinc-200
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Firing Beam */}
            <motion.path
              d={p.d}
              fill="transparent"
              stroke="url(#beam-grad)"
              strokeWidth="3"
              strokeLinecap="square"
              initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 0.5, 0],
                pathOffset: [0, 0.5, 1],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: p.delay,
              }}
            />
          </g>
        ))}
      </svg>

      {/* Nodes matching SVG Coordinates relatively */}
      <div className="absolute inset-0 w-full h-full">
        {/* Node 1: Roadmap.sh Ingestion */}
        <div className="absolute top-[20%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-14 h-14 bg-white border border-zinc-200 shadow-lg rounded-none flex items-center justify-center relative z-10 transition-transform hover:scale-110">
            <Database className="w-6 h-6 text-zinc-600" />
          </div>
          <span className="absolute -bottom-6 text-[10px] uppercase font-bold tracking-wider text-zinc-400 whitespace-nowrap">
            Raw Topologies
          </span>
        </div>

        {/* Node 2: User Configuration */}
        <div className="absolute top-[80%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-14 h-14 bg-white border border-zinc-200 shadow-lg rounded-none flex items-center justify-center relative z-10 transition-transform hover:scale-110">
            <User className="w-6 h-6 text-zinc-600" />
          </div>
          <span className="absolute -top-6 text-[10px] uppercase font-bold tracking-wider text-zinc-400 whitespace-nowrap">
            User Metrics
          </span>
        </div>

        {/* Center Node: AI Processor */}
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-20 h-20 bg-zinc-900 shadow-2xl shadow-zinc-900/30 rounded-none flex items-center justify-center relative z-10">
            <BrainCircuit className="w-10 h-10 text-white" />
          </div>
          <span className="absolute -bottom-8 text-xs uppercase font-bold tracking-[0.2em] text-zinc-800 whitespace-nowrap font-mono">
             Engine
          </span>
        </div>

        {/* Output 1: Final Roadmap */}
        <div className="absolute top-[20%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-14 h-14 bg-white border border-zinc-200 shadow-lg rounded-none flex items-center justify-center relative z-10 transition-transform hover:scale-110">
            <MapIcon className="w-6 h-6 text-zinc-900" />
          </div>
          <span className="absolute -bottom-6 text-[10px] uppercase font-bold tracking-wider text-zinc-400 whitespace-nowrap">
            Validated Path
          </span>
        </div>

        {/* Output 2: Resources */}
        <div className="absolute top-[80%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-14 h-14 bg-white border border-zinc-200 shadow-lg rounded-none flex items-center justify-center relative z-10 transition-transform hover:scale-110">
            <BookOpen className="w-6 h-6 text-zinc-900" />
          </div>
          <span className="absolute -top-6 text-[10px] uppercase font-bold tracking-wider text-zinc-400 whitespace-nowrap">
            Curated Material
          </span>
        </div>
      </div>
    </div>
  );
}
