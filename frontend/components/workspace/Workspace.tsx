"use client";

import { useState } from "react";
import NavigationSidebar, { SectionId } from "./NavigationSidebar";
import DashboardSection from "./DashboardSection";
import RoadmapView from "../RoadmapView";
import CoursesSection from "./CoursesSection";
import LearningPathsSection from "./LearningPathsSection";
import PlaygroundSection from "./PlaygroundSection";
import ProfileSection from "./ProfileSection";
import { AnimatePresence, motion } from "framer-motion";

interface WorkspaceProps {
  roadmap: any;
  resources: any[];
  initialProgress: any;
}

export default function Workspace({ roadmap, resources, initialProgress }: WorkspaceProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");

  const roleTitle = roadmap?.role || "";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-zinc-50 dark:bg-zinc-950 w-full font-sans">
      <NavigationSidebar
        activeSection={activeSection}
        onSelect={setActiveSection}
        roleTitle={roleTitle}
      />

      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 min-h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeSection === "dashboard" && (
                <DashboardSection
                  roadmap={roadmap}
                  progress={initialProgress}
                  resources={resources}
                  onNavigateToRoadmap={() => setActiveSection("roadmaps")}
                />
              )}
              
              {activeSection === "roadmaps" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Reuse the existing RoadmapView here */}
                  <div className="-mx-4 md:-mx-8 lg:-mx-12 -my-10 md:-my-14">
                    <RoadmapView
                      roadmap={roadmap}
                      resources={resources}
                      initialProgress={initialProgress}
                      onReturnToDashboard={() => setActiveSection("dashboard")}
                    />
                  </div>
                </div>
              )}

              {activeSection === "courses" && (
                <CoursesSection resources={resources} />
              )}

              {activeSection === "paths" && (
                <LearningPathsSection />
              )}

              {activeSection === "playground" && (
                <PlaygroundSection />
              )}

              {activeSection === "profile" && (
                <ProfileSection progress={initialProgress} roleTitle={roleTitle} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
