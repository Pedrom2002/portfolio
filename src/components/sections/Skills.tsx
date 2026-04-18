"use client";

import { motion, type Variants } from "framer-motion";
import { Code2, Database, Wrench } from "lucide-react";
import { skillCategories } from "@/lib/constants";
import GradientText from "@/components/ui/GradientText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionDivider from "@/components/ui/SectionDivider";
import { useQuality } from "@/hooks/useQuality";

const categoryIcons: Record<string, React.ReactNode> = {
  "Frontend": <Code2 size={20} />,
  "Backend & Data": <Database size={20} />,
  "Data Science & Tools": <Wrench size={20} />,
};

const categoryColors: Record<string, string> = {
  "Frontend": "from-primary to-primary-light",
  "Backend & Data": "from-secondary to-secondary/60",
  "Data Science & Tools": "from-accent to-nebula-warm",
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const containerVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function Skills() {
  const q = useQuality();
  const isLow = q.tier === "low";
  const variants = isLow ? containerVariantsReduced : q.tier === "medium" ? containerVariantsReduced : containerVariants;

  return (
    <section className="section-padding relative">
      <SectionDivider />
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="flex items-center gap-4">
            <span className="font-display text-sm font-medium tracking-widest text-primary/60 uppercase">03</span>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
          <GradientText as="h2" className="mt-4 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Skills & Technologies
          </GradientText>
          <p className="mt-4 max-w-2xl text-text-secondary">
            The tools and technologies I use to bring ideas to life.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {skillCategories.map((category, catIdx) => {
            const gradient = categoryColors[category.name] || "from-primary to-primary-light";
            return (
              <ScrollReveal key={category.name} delay={catIdx * 0.12}>
                <div className="group relative overflow-hidden rounded-2xl border border-glass-border bg-galaxy-dark/50 p-6 transition-all duration-500 hover:border-primary/20">
                  {/* Top gradient accent */}
                  <div className={`absolute left-0 right-0 top-0 h-px bg-gradient-to-r ${gradient} opacity-40 transition-opacity duration-300 group-hover:opacity-100`} />

                  {/* Category header */}
                  <div className="mb-5 flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                      {categoryIcons[category.name] || <Code2 size={20} />}
                    </div>
                    <h3 className="font-display text-base font-semibold text-white">
                      {category.name}
                    </h3>
                  </div>

                  {/* Skills grid */}
                  <motion.div
                    variants={variants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex flex-wrap gap-2"
                  >
                    {category.skills.map((skill) => (
                      isLow ? (
                        <span
                          key={skill.name}
                          className="badge cursor-default rounded-lg border border-glass-border bg-galaxy-darker/60 text-sm font-medium text-text-secondary transition-all duration-300 hover:border-primary/30 hover:text-white hover:shadow-[0_0_15px_rgba(129,84,255,0.15)] hover:-translate-y-0.5 hover:scale-105"
                        >
                          {skill.name}
                        </span>
                      ) : (
                        <motion.span
                          key={skill.name}
                          variants={badgeVariants}
                          whileHover={{
                            scale: 1.05,
                            y: -2,
                          }}
                          className="badge cursor-default rounded-lg border border-glass-border bg-galaxy-darker/60 text-sm font-medium text-text-secondary transition-all duration-300 hover:border-primary/30 hover:text-white hover:shadow-[0_0_15px_rgba(129,84,255,0.15)]"
                        >
                          {skill.name}
                        </motion.span>
                      )
                    ))}
                  </motion.div>

                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-primary/5 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
