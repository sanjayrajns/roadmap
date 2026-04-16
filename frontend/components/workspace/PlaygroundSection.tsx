"use client";

import { motion } from "framer-motion";
import { TerminalSquare, Play, RefreshCw, FileCode } from "lucide-react";

export default function PlaygroundSection() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-4 shrink-0">
        <TerminalSquare className="w-5 h-5 text-zinc-900" />
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Playground</h2>
      </div>

      <div className="flex-1 min-h-[500px] border border-zinc-200 bg-white flex flex-col lg:flex-row overflow-hidden">
        {/* Exercises Sidebar */}
        <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-zinc-200 bg-zinc-50 shrink-0 flex flex-col">
          <div className="p-4 border-b border-zinc-200 bg-white">
            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Exercises
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {["JavaScript Basics", "Array Mapping", "Async/Await", "React Hooks"].map((task, i) => (
              <button
                key={i}
                className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {task}
              </button>
            ))}
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="flex-1 flex flex-col bg-[#0D0C22]">
          <div className="flex items-center justify-between p-3 border-b border-zinc-800 bg-[#0D0C22]">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-mono text-zinc-300">index.js</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-zinc-400 hover:text-white transition-colors p-1">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="bg-white text-zinc-900 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center gap-1.5">
                <Play className="w-3 h-3 fill-current" /> Run
              </button>
            </div>
          </div>
          <div className="flex-1 p-6 font-mono text-sm text-zinc-300 overflow-auto">
            <pre className="select-text">
              <code>{`// Exercise: JavaScript Basics
// Instructions: Write a function that returns "Hello World"

function greet() {
  // your code here
  return "Hello World";
}

console.log(greet());`}</code>
            </pre>
          </div>
          {/* Output Panel */}
          <div className="h-48 border-t border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-500 overflow-auto">
            <p className="text-[10px] font-bold tracking-widest uppercase mb-2 opacity-50">Output</p>
            <p className="text-green-400">{">"} "Hello World"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
