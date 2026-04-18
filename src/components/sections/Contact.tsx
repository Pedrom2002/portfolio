"use client";

import { Github, Linkedin, Mail, Download } from "lucide-react";
import { personalInfo } from "@/lib/constants";
import GradientText from "@/components/ui/GradientText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionDivider from "@/components/ui/SectionDivider";
import ContactForm from "./ContactForm";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

export default function Contact() {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-12 md:px-12 md:pt-40 md:pb-16 xl:px-16">
      <SectionDivider />

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Heading */}
        <ScrollReveal>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/30" />
            <span className="font-display text-sm font-medium tracking-widest text-primary/60 uppercase">04</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/30" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <GradientText as="h2" className="mt-4 text-center font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Let&apos;s Work Together
          </GradientText>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-text-secondary md:text-lg">
            Whether you need a developer, have an idea worth building,
            or just want to talk tech — I&apos;m always open to connecting.
          </p>
        </ScrollReveal>

        {/* Two-column on desktop, stacked on mobile */}
        <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
          <ScrollReveal delay={0.15}>
            <ContactForm />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-white/[0.06] bg-galaxy-dark/40 p-6 backdrop-blur-md">
              {/* Direct email */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary/60">
                  Or email directly
                </h3>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="mt-2 block break-all font-medium text-primary underline-offset-4 hover:underline"
                >
                  {personalInfo.email}
                </a>
                <p className="mt-1 text-xs text-text-secondary/60">{personalInfo.location}</p>
              </div>

              {/* CV downloads */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary/60">
                  Download CV
                </h3>
                <div className="mt-2 flex flex-col gap-2">
                  <a
                    href="/Pedro_Marques_CV_Software_Developer.pdf"
                    download
                    className="group flex items-center justify-between gap-2 rounded-lg border border-glass-border bg-galaxy-darker/60 px-4 py-2.5 text-sm font-medium text-text-secondary transition-all duration-300 hover:border-primary/30 hover:text-white"
                  >
                    <span>Software Engineering</span>
                    <Download size={14} className="transition-colors group-hover:text-primary" />
                  </a>
                  <a
                    href="/Pedro_Marques_CV_Data_Scientist.pdf"
                    download
                    className="group flex items-center justify-between gap-2 rounded-lg border border-glass-border bg-galaxy-darker/60 px-4 py-2.5 text-sm font-medium text-text-secondary transition-all duration-300 hover:border-primary/30 hover:text-white"
                  >
                    <span>Data Science</span>
                    <Download size={14} className="transition-colors group-hover:text-primary" />
                  </a>
                </div>
              </div>

              {/* Social links */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary/60">
                  Find me on
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  {personalInfo.socials.map((social) => {
                    const Icon = iconMap[social.icon] || Mail;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target={social.url.startsWith("mailto") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        className="group flex h-10 w-10 items-center justify-center rounded-lg border border-glass-border bg-galaxy-darker/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30"
                        aria-label={social.name}
                      >
                        <Icon size={16} className="text-text-secondary transition-colors group-hover:text-primary" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
