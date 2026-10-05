"use client";

import { ExternalLink, Github } from "lucide-react";
import { otherProjects } from "@/lib/constants";
import GlassCard from "@/components/ui/GlassCard";
import GradientText from "@/components/ui/GradientText";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function OtherProjects() {
  return (
    <div className="section-padding">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="flex items-center gap-4">
            <span className="font-display text-sm font-medium tracking-widest text-primary/60 uppercase">03</span>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
          <GradientText as="h2" className="mt-4 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            More Projects
          </GradientText>
          <p className="mt-4 max-w-md text-text-secondary">
            Client work, event platforms and research.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {otherProjects.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 0.05}>
              <GlassCard className="flex h-full flex-col">
                <h3 className="font-display text-xl font-bold text-white">{project.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-[1.8] text-text-secondary">
                  {project.description}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="badge rounded-lg border border-white/[0.06] bg-white/[0.03] text-xs font-medium text-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="badge gap-1.5 rounded-full bg-white/10 text-xs font-semibold text-white transition-all hover:bg-white/20"
                    >
                      <Github size={14} />
                      Github repo link
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="badge gap-2 rounded-full bg-primary text-xs font-semibold text-white transition-all hover:bg-primary-light"
                    >
                      <ExternalLink size={12} />
                      Live Demo
                    </a>
                  )}
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
