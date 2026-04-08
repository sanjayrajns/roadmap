"use client";

import { BackgroundPaths } from "@/components/ui/background-paths";

import DigitalSerenity from "@/components/ui/digital-serenity-animated-landing-page";
import CuriousQuestions from "@/components/ui/curious-questions";
import { FeatureCard, AnimatedContainer } from "@/components/ui/grid-feature-cards";
import Testimonials from "@/components/ui/testimonials-columns-1";
import MultiOrbitSemiCircle from "@/components/ui/multi-orbit-semi-circle";
import AnimatedPipeline from "@/components/ui/animated-pipeline";
import HoverFooter from "@/components/ui/hover-footer";
import { Compass, BookOpen, Map, ArrowRight, BrainCircuit, ShieldCheck, Rocket } from "lucide-react";
import Link from "next/link";

const features = [
	{
		title: 'Goal Discovery',
		icon: Compass,
		description: 'Tell us your role target and learning style. We map out the exact baseline logic required for you.',
	},
	{
		title: 'Deterministic AI',
		icon: BrainCircuit,
		description: 'We process raw graphs through LLM pipelines tightly constrained to output exact JSON schemas, preventing hallucination.',
	},
	{
		title: 'Structured Timelines',
		icon: Map,
		description: 'The AI logically trims massive roadmap graphs down to the exact nodes you need based on your weekly availability.',
	},
	{
		title: 'Curated Resources',
		icon: BookOpen,
		description: 'Get high-quality, vetted material attached directly to your milestones without endless searching.',
	},
	{
		title: 'Guaranteed Reliability',
		icon: ShieldCheck,
		description: 'Our proprietary 3-layer architecture cleanly isolates external LLM probabilities from your core navigation routes.',
	},
	{
		title: 'Fast Deployment',
		icon: Rocket,
		description: 'Export your roadmap to PDF, map it to local tickets, or share your learning path immediately with your team.',
	},
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Dynamic Animated Hero Section */}
      <BackgroundPaths title="Design Your Developer Path" />

      {/* Deep Serenity Meditation Block */}
      <DigitalSerenity />

      {/* Curious Questions Interactive Engine */}
      <CuriousQuestions />

      {/* Grid Feature Cards Section */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-100 relative z-20">
        <div className="mx-auto w-full max-w-5xl space-y-12 px-4">
          <AnimatedContainer className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 text-balance md:text-5xl lg:text-5xl xl:font-extrabold">
              Logic. Structure. Control.
            </h2>
            <p className="text-zinc-500 mt-6 text-sm tracking-wide text-balance md:text-base md:leading-relaxed">
              Everything you need to navigate tutorial hell securely. Discover structured learning paths tailored to your exact career goals.
            </p>
          </AnimatedContainer>

          <AnimatedContainer
            delay={0.4}
            className="grid grid-cols-1 divide-x divide-y divide-dashed divide-zinc-200 border border-dashed border-zinc-200 sm:grid-cols-2 md:grid-cols-3 bg-white shadow-sm"
          >
            {features.map((feature, i) => (
              <FeatureCard key={i} feature={feature} />
            ))}
          </AnimatedContainer>
        </div>
      </section>

      {/* Dynamic Testimonials Columns */}
      <Testimonials />

      {/* Semi Circle Tech Integrations Orbital */}
      <MultiOrbitSemiCircle />

      {/* Image & Context Section -> Replaced with Animated Pipeline */}
      <section className="py-24 overflow-hidden relative z-20 bg-zinc-50 border-t border-zinc-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900">
                Deterministic Processing
              </h2>
              <p className="text-xl text-zinc-500 leading-relaxed">
                We safely ingest raw topologies from roadmap.sh, fuse them with your explicit career metrics, and run them through our proprietary AI trimming pipeline. The output is a flawless, mathematically verified learning node path.
              </p>
              <Link 
                href="/onboarding"
                className="inline-flex items-center justify-center rounded-none bg-zinc-900 text-white px-8 py-5 font-semibold text-lg hover:bg-zinc-800 transition-colors shadow-xl shadow-zinc-900/20"
              >
                Start Onboarding
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            <div className="flex-1 w-full relative">
              <AnimatedPipeline />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Global Footer */}
      <HoverFooter />
    </div>
  );
}
