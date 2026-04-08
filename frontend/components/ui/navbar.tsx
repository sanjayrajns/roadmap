"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Process", href: "#process" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Docs", href: "#docs" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname === '/onboarding') {
    return null;
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b-2 border-transparent",
        scrolled 
          ? "bg-[#0D0C22]/90 backdrop-blur-md border-zinc-200 py-2 shadow-sm" 
          : "bg-transparent border-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-zinc-900 flex items-center justify-center rounded-none transition-transform group-hover:scale-105">
              <img src="/icon.png" alt="AI Roadmap" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-xl font-medium tracking-tighter text-white hidden sm:block uppercase">
              AI Roadmap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium uppercase tracking-widest text-white border-b-2 border-transparent hover:border-white hover:text-zinc-200 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="h-6 w-px bg-zinc-200" />
            
            <div className="flex items-center space-x-4">
              <Link
                href="https://github.com"
                className="p-2 text-white hover:text-zinc-200 transition-colors"
              >
                <Code2 className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium uppercase tracking-widest text-white hover:text-zinc-200 transition-colors px-4"
              >
                Login
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center bg-zinc-900 text-white px-6 py-3 text-sm font-bold uppercase tracking-widest rounded-none hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 active:scale-95"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0D0C22] border-b border-zinc-200 p-6 flex flex-col space-y-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-base font-bold uppercase tracking-widest text-white hover:text-zinc-200"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="h-px w-full bg-zinc-100" />
          <div className="flex flex-col space-y-4">
            <Link
              href="/login"
              className="text-base font-bold uppercase tracking-widest text-white hover:text-zinc-200"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/onboarding"
              className="flex items-center justify-center bg-zinc-900 text-white px-6 py-4 text-sm font-bold uppercase tracking-widest rounded-none"
              onClick={() => setIsOpen(false)}
            >
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
