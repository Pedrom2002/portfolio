"use client";

import { Github, Linkedin, Mail, ArrowUpRight, Download } from "lucide-react";
import { personalInfo } from "@/lib/constants";
import GradientText from "@/components/ui/GradientText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import SectionDivider from "@/components/ui/SectionDivider";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

export default function Contact() {
  return (
    <section className="section-padding relative overflow-hidden">
      <SectionDivider />

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <ScrollReveal>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/30" />
            <span className="font-display text-sm font-medium tracking-widest text-primary/60 uppercase">04</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/30" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <GradientText as="h2" className="mt-6 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            Let&apos;s Work Together
          </GradientText>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-text-secondary">
            Whether you need a developer, have an idea worth building,
            or just want to talk tech — I&apos;m always open to connecting.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-14">
            <MagneticButton href={`mailto:${personalInfo.email}`} magneticStrength={0.4}>
              <Mail size={18} />
              Say Hello
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
          </div>
        </ScrollReveal>

        {/* CV downloads */}
        <ScrollReveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/Pedro_Marques_CV_Software_Developer.pdf"
              download
              className="group flex items-center gap-2 rounded-xl border border-glass-border bg-galaxy-dark/50 px-5 py-3 text-sm font-medium text-text-secondary transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:text-white hover:shadow-lg hover:shadow-primary/10"
            >
              <Download size={16} className="transition-colors group-hover:text-primary" />
              Software Engineering CV
            </a>
            <a
              href="/Pedro_Marques_CV_Data_Scientist.pdf"
              download
              className="group flex items-center gap-2 rounded-xl border border-glass-border bg-galaxy-dark/50 px-5 py-3 text-sm font-medium text-text-secondary transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:text-white hover:shadow-lg hover:shadow-primary/10"
            >
              <Download size={16} className="transition-colors group-hover:text-primary" />
              Data Science CV
            </a>
          </div>
        </ScrollReveal>

        {/* Social links */}
        <ScrollReveal delay={0.2}>
          <div className="mt-10 flex items-center justify-center gap-3">
            {personalInfo.socials.map((social) => {
              const Icon = iconMap[social.icon] || Mail;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target={social.url.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group relative flex h-12 w-12 items-center justify-center rounded-xl border border-glass-border bg-galaxy-dark/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                  aria-label={social.name}
                >
                  <Icon
                    size={18}
                    className="text-text-secondary transition-colors group-hover:text-primary"
                  />
                </a>
              );
            })}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <p className="mt-6 text-xs font-medium uppercase tracking-widest text-text-secondary/40">
            {personalInfo.email}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
