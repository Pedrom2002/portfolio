"use client";

import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { projects } from "@/lib/constants";
import GradientText from "@/components/ui/GradientText";
import ScrollReveal from "@/components/ui/ScrollReveal";

const PLANET_NAMES = ["Earth", "Mars", "Jupiter", "Saturn"];

export function ProjectsHeader() {
  return (
    <div className="section-padding pb-0">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="flex items-center gap-4">
            <span className="font-display text-sm font-medium tracking-widest text-primary/60 uppercase">02</span>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
          <GradientText as="h2" className="mt-4 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Featured Projects
          </GradientText>
          <p className="mt-4 max-w-md text-text-secondary">
            Each planet represents a project. Scroll to explore.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}

export function ProjectDetail({ index }: { index: number }) {
  const project = projects[index];
  if (!project) return null;

  return (
    <div className="flex h-full items-center justify-end px-6 sm:px-12 lg:pr-24 lg:pl-[42%]">
      <div className="w-full max-w-xl rounded-3xl border border-white/[0.04] bg-[#050812]/90 p-8 text-center backdrop-blur-xl sm:p-10">
        {/* Badge */}
        <ScrollReveal>
          <span className="badge rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold uppercase tracking-widest text-primary-light">
            {PLANET_NAMES[index]} — Project {String(index + 1).padStart(2, "0")}
          </span>
        </ScrollReveal>

        {/* Logo + Title */}
        <ScrollReveal delay={0.05}>
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center">
              {project.image && (
                <div className="w-0 flex items-center overflow-visible">
                  <div className={`relative right-36 shrink-0 overflow-hidden rounded-2xl border p-3 ${
                    project.id === "clutchlabs"
                      ? "border-white/10 bg-white/90 shadow-lg shadow-primary/10"
                      : "border-glass-border bg-galaxy-dark/50"
                  }`}>
                    <Image
                      src={project.image}
                      alt={`${project.title} logo`}
                      width={96}
                      height={96}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                    {project.title}
                  </h3>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="badge gap-1.5 rounded-full bg-white/10 text-xs font-semibold text-white transition-all hover:bg-white/20 hover:scale-105"
                    >
                      <Github size={14} />
                      GitHub
                    </a>
                  )}
                </div>
                {project.hasDemo && (
                  <span className="badge gap-1.5 rounded-full bg-primary/20 text-xs font-semibold text-primary transition-all">
                    ✦ Live demo inside
                  </span>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Divider */}
        <div className="my-7 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

        {/* Description */}
        <ScrollReveal delay={0.1}>
          <p className="text-sm leading-[1.8] text-text-secondary">
            {project.description}
          </p>
        </ScrollReveal>

        {/* Tech tags + Links */}
        <ScrollReveal delay={0.15}>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="badge rounded-lg border border-white/[0.06] bg-white/[0.03] text-xs font-medium text-text-secondary"
              >
                {tech}
              </span>
            ))}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="badge group gap-2 rounded-full bg-primary text-xs font-semibold text-white transition-all hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20"
              >
                <ExternalLink size={12} />
                Live Demo
              </a>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
