"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  /** Use "icon" for a compact icon-only button, "pill" for a labeled toggle */
  variant?: "icon" | "pill";
}

export default function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  if (variant === "pill") {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "flex items-center gap-2 px-4 py-2 text-[10px] font-bold tracking-widest uppercase border transition-all duration-300",
          isDark
            ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
            : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200",
          className
        )}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 30, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </motion.div>
        </AnimatePresence>
        {isDark ? "Light" : "Dark"}
      </button>
    );
  }

  // Icon-only variant
  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-none transition-all duration-300",
        isDark
          ? "text-zinc-300 hover:text-white hover:bg-zinc-800"
          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ rotate: -30, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 30, opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
