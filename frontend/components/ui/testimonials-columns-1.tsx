"use client";

import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "This AI generator completely broke me out of tutorial hell. I finally have a deterministic, step-by-step logic path to transitioning from Frontend to DevOps.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    name: "Elena Rodriguez",
    role: "Frontend Developer",
  },
  {
    text: "The roadmap it built for my backend transition was stunningly accurate. It trimmed 40 hours of redundant learning nodes out of my weekly schedule.",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop",
    name: "Marcus Chen",
    role: "Software Engineer",
  },
  {
    text: "Instead of getting lost in YouTube recommended tabs, I now just follow the curated resources directly attached to my AI milestones. Flawless execution.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    name: "Sarah Jenkins",
    role: "Junior Web Dev",
  },
  {
    text: "As a mentor, I use this platform to instantly spin up customized learning curriculums for my interns based on our specific tech stack.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    name: "David Kim",
    role: "Engineering Manager",
  },
  {
    text: "The 3-layer architecture handles the prompt parsing so elegantly. It's the first learning tool I've seen that actually prevents LLM hallucination.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
    name: "Priya Patel",
    role: "AI Researcher",
  },
  {
    text: "It looked at my 10-hour weekly time budget and automatically dynamically shifted my React mastery timeline. Incredibly intelligent design.",
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=150&auto=format&fit=crop",
    name: "Alex Thompson",
    role: "Bootcamp Graduate",
  },
  {
    text: "Exporting the JSON roadmap into my personal Notion workspace took literally 3 clicks. It's built perfectly for productivity nerds.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    name: "Maya Garcia",
    role: "Product Designer",
  },
  {
    text: "We integrated it into our onboarding flow for new hires. It instantly maps their skills against our backend requirements.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
    name: "James Wilson",
    role: "CTO",
  },
  {
    text: "I was overwhelmed by roadmap.sh visually before this. Having the AI trim it down specifically to my goals was exactly what I needed to start coding.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=150&auto=format&fit=crop",
    name: "Emily Wang",
    role: "Career Switcher",
  },
];

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-8 rounded-3xl border border-zinc-100 bg-white shadow-lg shadow-zinc-200/40 max-w-sm w-full" key={i}>
                  <div className="text-zinc-700 leading-relaxed text-sm md:text-base">{text}</div>
                  <div className="flex items-center gap-4 mt-6">
                    <img
                      width={48}
                      height={48}
                      src={image}
                      alt={name}
                      className="h-12 w-12 rounded-full object-cover shadow-sm bg-zinc-100"
                    />
                    <div className="flex flex-col">
                      <div className="font-semibold tracking-tight text-zinc-900">{name}</div>
                      <div className="text-sm font-medium text-zinc-500 tracking-tight">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function Testimonials() {
  return (
    <section className="bg-white py-24 relative overflow-hidden">
      <div className="container z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto text-center"
        >
          <div className="inline-flex justify-center mb-6">
            <div className="border border-zinc-200 py-1.5 px-4 rounded-full text-sm font-medium tracking-wide text-zinc-600 bg-zinc-50">
              Community
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900">
            Escaping Tutorial Hell
          </h2>
          <p className="mt-6 text-lg text-zinc-500 leading-relaxed">
            See how developers are using deterministic learning paths to cut through the noise and achieve their career goals.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[800px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={35} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={45} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={40} />
        </div>
      </div>
    </section>
  );
}
