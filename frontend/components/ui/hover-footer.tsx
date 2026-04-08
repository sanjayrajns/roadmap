"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Mail,
  MapPin,
  Globe,
  Hash,
  MessageSquare,
  Code2
} from "lucide-react";

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none uppercase cursor-pointer", className)}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              {/* Using a sophisticated sharp gradient map to match the landing page */}
              <stop offset="0%" stopColor="#27272a" />
              <stop offset="25%" stopColor="#18181b" />
              <stop offset="50%" stopColor="#09090b" />
              <stop offset="75%" stopColor="#27272a" />
              <stop offset="100%" stopColor="#52525b" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      {/* Background skeleton text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-zinc-100 font-sans text-6xl md:text-7xl font-extrabold"
        style={{ opacity: hovered ? 0.9 : 0 }}
      >
        {text}
      </text>
      {/* Ghost text outline animating continuously */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-zinc-300 font-sans text-6xl md:text-7xl font-extrabold"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      {/* Foreground text resolving on hover mask mapping */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.4"
        mask="url(#textMask)"
        className="fill-transparent font-sans text-6xl md:text-7xl font-extrabold"
      >
        {text}
      </text>
    </svg>
  );
};


export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(120% 120% at 50% 10%, transparent 40%, rgba(244, 244, 245, 0.4) 100%)",
      }}
    />
  );
};

export default function HoverFooter() {
  // Footer link data aligned to SaaS ecosystem
  const footerLinks = [
    {
      title: "Platform",
      links: [
        { label: "Target Generator", href: "#" },
        { label: "Roadmap Topologies", href: "#" },
        { label: "AI Engine", href: "#" },
        { label: "Documentation", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "roadmap.sh", href: "https://roadmap.sh" },
        { label: "Open Source", href: "#" },
        {
          label: "Status",
          href: "#",
          pulse: true,
        },
      ],
    },
  ];

  // Contact info data
  const contactInfo = [
    {
      icon: <Mail size={18} className="text-zinc-600" />,
      text: "hello@airoadmap.dev",
      href: "mailto:hello@airoadmap.dev",
    },
    {
      icon: <Code2 size={18} className="text-zinc-600" />,
      text: "View Source",
      href: "#",
    },
    {
      icon: <MapPin size={18} className="text-zinc-600" />,
      text: "Open Source Globally",
    },
  ];

  // Social media icons
  const socialLinks = [
    { icon: <Code2 size={20} />, label: "Source", href: "#" },
    { icon: <Hash size={20} />, label: "Community", href: "#" },
    { icon: <MessageSquare size={20} />, label: "Discord", href: "#" },
    { icon: <Globe size={20} />, label: "Website", href: "#" },
  ];

  return (
    <footer className="bg-zinc-50 relative h-fit overflow-hidden border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 py-16 md:px-12 z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3 shadow-sm w-fit p-1 rounded-xl bg-white border border-zinc-100">
              <img src="/icon.png" alt="Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
              <span className="text-zinc-900 text-2xl font-extrabold tracking-tight px-1">
                AI Roadmap
              </span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-500 font-medium">
              Deterministic learning logic built explicitly for modern engineering curriculums.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-zinc-900 text-lg font-bold tracking-tight mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label} className="relative w-fit">
                    <a
                      href={link.href}
                      className="text-zinc-500 font-medium hover:text-zinc-900 transition-colors"
                    >
                      {link.label}
                    </a>
                    {link.pulse && (
                      <span className="absolute top-1.5 -right-3 w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-zinc-900 text-lg font-bold tracking-tight mb-6">
              Connect
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-zinc-500 font-medium hover:text-zinc-900 transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-zinc-500 font-medium hover:text-zinc-900 transition-colors">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-zinc-200/60 my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
          {/* Social icons */}
          <div className="flex space-x-6 text-zinc-400">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="hover:text-zinc-900 transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center md:text-left text-zinc-500 font-medium">
            &copy; {new Date().getFullYear()} AI Roadmap Generator.
          </p>
        </div>
      </div>

      {/* Text hover effect resolving exclusively in safe breakpoints */}
      <div className="lg:flex hidden h-[22rem] -mt-32 -mb-20 pointer-events-auto">
        <TextHoverEffect text="ROADMAP.SH" className="z-50" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}
