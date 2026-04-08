"use client";
import React, { useState, useEffect } from "react";
import { 
  Code2, Terminal, Database, Server, Cpu, Cloud, Globe, 
  Palette, Shield, Settings, Workflow, Layers, Box, 
  Blocks, Container, GitBranch, Key, Search, Network, 
  Radio, MonitorSmartphone, Hexagon, Bot, Component 
} from "lucide-react";

const ICONS = [
  { icon: Code2, label: "Frontend" },
  { icon: Terminal, label: "CLI Tools" },
  { icon: Database, label: "Databases" },
  { icon: Server, label: "Backend" },
  { icon: Cpu, label: "System Design" },
  { icon: Cloud, label: "Cloud Services" },
  { icon: Globe, label: "Web Security" },
  { icon: Palette, label: "UI/UX" },
  { icon: Shield, label: "DevSecOps" },
  { icon: Settings, label: "Infrastructure" },
  { icon: Workflow, label: "CI/CD" },
  { icon: Layers, label: "Architecture" },
  { icon: Box, label: "Docker" },
  { icon: Blocks, label: "Microservices" },
  { icon: Container, label: "Kubernetes" },
  { icon: GitBranch, label: "Version Control" },
  { icon: Key, label: "Authentication" },
  { icon: Search, label: "SEO" },
  { icon: Network, label: "APIs & GraphQL" },
  { icon: Radio, label: "WebSockets" },
  { icon: MonitorSmartphone, label: "Mobile Dev" },
  { icon: Hexagon, label: "Data Structures" },
  { icon: Bot, label: "AI Integration" },
  { icon: Component, label: "Frameworks" }
];

function SemiCircleOrbit({ radius, centerX, centerY, count, iconSize, startIndex }: any) {
  return (
    <>
      {/* Semi-circle glow background */}
      <div className="absolute inset-0 flex justify-center">
        <div
          className="w-[1000px] h-[1000px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05),transparent_70%)] blur-3xl -mt-40 pointer-events-none"
          style={{ zIndex: 0 }}
        />
      </div>

      {/* Orbit icons */}
      {Array.from({ length: count }).map((_, index) => {
        const angle = (index / (count - 1)) * 180;
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);
        
        // Pick an icon from the massive array uniquely
        const iconData = ICONS[(startIndex + index) % ICONS.length];
        const IconComponent = iconData.icon;

        // Tooltip positioning — above or below based on angle
        const tooltipAbove = angle > 90;

        return (
          <div
            key={index}
            className="absolute flex flex-col items-center group"
            style={{
              left: `${centerX + x - iconSize / 2}px`,
              top: `${centerY - y - iconSize / 2}px`,
              zIndex: 5,
            }}
          >
            <div 
              className="bg-white border border-zinc-200 shadow-xl shadow-zinc-200/50 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110"
              style={{ width: iconSize, height: iconSize }}
            >
              <IconComponent 
                className="text-zinc-700" 
                style={{ width: iconSize * 0.5, height: iconSize * 0.5 }} 
              />
            </div>

            {/* Tooltip */}
            <div
              className={`absolute ${
                tooltipAbove ? "bottom-[calc(100%+12px)]" : "top-[calc(100%+12px)]"
              } hidden group-hover:block w-fit whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold tracking-wide text-white shadow-xl text-center z-50`}
            >
              {iconData.label}
              <div
                className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-zinc-900 ${
                  tooltipAbove ? "top-[calc(100%-6px)]" : "bottom-[calc(100%-6px)]"
                }`}
              ></div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default function MultiOrbitSemiCircle() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Only capture window logic safely internally upon client-side mount
    const updateSize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Avoid heavy render loops if window object hasn't snapped yet on hot-reload hooks
  if (size.width === 0) return null;

  const baseWidth = Math.min(size.width * 0.8, 800);
  const centerX = baseWidth / 2;
  const centerY = baseWidth * 0.5;

  const iconSize =
    size.width < 480
      ? Math.max(34, baseWidth * 0.05)
      : size.width < 768
      ? Math.max(40, baseWidth * 0.06)
      : Math.max(48, baseWidth * 0.07);

  return (
    <section className="py-24 relative w-full overflow-hidden bg-white border-t border-zinc-100">
      <div className="relative flex flex-col items-center text-center z-10 container mx-auto px-4 md:px-6">
        <h2 className="my-6 text-3xl md:text-5xl lg:text-5xl font-bold tracking-tight text-zinc-900">
           Massive Technological Coverage
        </h2>
        <p className="mb-24 mt-2 max-w-2xl text-zinc-500 text-lg leading-relaxed md:text-lg">
          Instantly generate highly detailed learning roadmaps explicitly mapped across the entire modern software engineering ecosystem. 
        </p>

        <div
          className="relative"
          style={{ width: baseWidth, height: baseWidth * 0.6 }}
        >
          <SemiCircleOrbit radius={baseWidth * 0.22} centerX={centerX} centerY={centerY} count={6} iconSize={iconSize} startIndex={0} />
          <SemiCircleOrbit radius={baseWidth * 0.36} centerX={centerX} centerY={centerY} count={8} iconSize={iconSize} startIndex={6} />
          <SemiCircleOrbit radius={baseWidth * 0.5} centerX={centerX} centerY={centerY} count={10} iconSize={iconSize} startIndex={14} />
        </div>
      </div>
    </section>
  );
}
