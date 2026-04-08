"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, User, TerminalSquare, Loader2, Sparkles } from "lucide-react";

const interrogations = [
  {
    ai: "What specific role do you want to transition into?",
    user: "Full Stack DevOps Engineer",
    system: "Trimming 40% of standard backend nodes. Aligning cloud orchestration paths."
  },
  {
    ai: "What is your baseline knowledge level?",
    user: "Intermediate JS, Zero Infrastructure",
    system: "Bypassing foundational Javascript syntax. Loading AWS deployment layers."
  },
  {
    ai: "How do you internalize data best?",
    user: "Project-based learning",
    system: "Prioritizing open-source repository forks over standard documentation reading."
  },
  {
    ai: "What is your weekly execution bandwidth?",
    user: "10 hours maximum",
    system: "Stretching roadmap timeline vectors to 6 months. Optimizing milestone density."
  }
];

export default function CuriousQuestions() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState(0); 

  // Sequence: Step 0 (AI ASKS) -> Step 1 (USER TELLS) -> Step 2 (SYSTEM CALCULATES) -> loop next index
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (step === 0) {
      timeout = setTimeout(() => setStep(1), 2000); // Wait 2s before user answers
    } else if (step === 1) {
      timeout = setTimeout(() => setStep(2), 1500); // Wait 1.5s then systemic calculating starts
    } else if (step === 2) {
      timeout = setTimeout(() => {
        setStep(0);
        setCurrentIndex((prev) => (prev + 1) % interrogations.length);
      }, 4000); // Show calculation for 4 seconds before looping
    }

    return () => clearTimeout(timeout);
  }, [step, currentIndex]);

  const active = interrogations[currentIndex];

  return (
    <section className="py-24 bg-white relative z-20 overflow-hidden border-t border-zinc-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Text Column */}
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center justify-center bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-none">
              <span className="text-xs uppercase font-bold tracking-widest text-zinc-600">The Context Engine</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
              We interrogate before we generate.
            </h2>
            <p className="text-xl text-zinc-500 leading-relaxed max-w-xl">
              Generic roadmaps lead straight back into tutorial hell. To build a deterministic trajectory, our engine actively asks you a series of precise baseline queries—dynamically slicing away redundant nodes from the graph in real-time.
            </p>
          </div>

          {/* Right Interactive Column */}
          <div className="flex-1 w-full max-w-xl relative">
            {/* Visual Container */}
            <div className="bg-zinc-50/50 border border-zinc-200 rounded-none p-6 lg:p-8 shadow-xl shadow-zinc-200/50 h-[420px] flex flex-col justify-end relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-50/50 pointer-events-none z-10" />
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-6 relative z-20"
                >
                  
                  {/* AI Question Bubble */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-none bg-zinc-900 flex-shrink-0 flex items-center justify-center shadow-lg">
                      <BrainCircuit className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-none p-4 max-w-[85%]">
                      <p className="text-sm md:text-base font-semibold text-zinc-800 leading-relaxed">
                        {active.ai}
                      </p>
                    </div>
                  </div>

                  {/* User Response Bubble */}
                  <AnimatePresence>
                    {step >= 1 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="flex items-start gap-4 justify-end"
                      >
                        <div className="bg-zinc-100 text-zinc-900 border border-zinc-200/60 shadow-sm rounded-none p-4 max-w-[85%]">
                          <p className="text-sm md:text-base font-medium leading-relaxed">
                            {active.user}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-none bg-white border border-zinc-200 flex-shrink-0 flex items-center justify-center shadow-sm">
                          <User className="w-5 h-5 text-zinc-400" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* System Terminal Action */}
                  <AnimatePresence>
                    {step >= 2 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full mt-2"
                      >
                        <div className="bg-zinc-900 border-zinc-800 rounded-none p-4 shadow-2xl flex items-start gap-3">
                          <div className="mt-0.5">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                              >
                                <Loader2 className="w-4 h-4 text-emerald-400" />
                            </motion.div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-mono">
                              Recalibrating Graph Elements
                            </span>
                            <p className="text-sm leading-relaxed text-zinc-300 font-mono">
                              {"> "} {active.system}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
