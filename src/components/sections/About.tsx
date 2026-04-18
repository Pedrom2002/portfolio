"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { personalInfo } from "@/lib/constants";
import GradientText from "@/components/ui/GradientText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionDivider from "@/components/ui/SectionDivider";

function AnimatedCounter({ value, label, index }: { value: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    gsap.from(ref.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      delay: index * 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 90%",
      },
    });
  }, { scope: ref });

  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="group relative flex flex-col items-center gap-1.5 rounded-xl border border-glass-border bg-galaxy-dark/50 p-4 text-center transition-colors duration-300 hover:border-primary/30 hover:bg-primary/5"
    >
      <span className="font-display text-3xl font-bold text-primary sm:text-4xl">
        {value}
      </span>
      <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
        {label}
      </span>
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-primary/5 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
}

export default function About() {
  return (
    <section className="section-padding relative">
      <SectionDivider />
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <ScrollReveal>
          <div className="flex items-center gap-4">
            <span className="font-display text-sm font-medium tracking-widest text-primary/60 uppercase">01</span>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
          <GradientText as="h2" className="mt-4 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            About Me
          </GradientText>
        </ScrollReveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-5">
          {/* Bio */}
          <div className="lg:col-span-3">
            <ScrollReveal delay={0.1}>
              <p className="text-lg leading-relaxed text-text-secondary">
                {personalInfo.bio}
              </p>
            </ScrollReveal>

            {/* Location badge */}
            <ScrollReveal delay={0.3}>
              <div className="badge mt-8 gap-1 whitespace-nowrap rounded-full border border-glass-border bg-glass-bg">
                <span className="text-sm">📍</span>
                <span className="text-sm text-text-secondary">Based in <span className="font-medium text-white">{personalInfo.location}</span></span>
              </div>
            </ScrollReveal>
            <div className="mt-14" />
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-3">
              {personalInfo.stats.map((stat, i) => (
                <AnimatedCounter
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
