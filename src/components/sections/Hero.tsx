"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { personalInfo } from "@/lib/constants";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLenis } from "lenis/react";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    // .hero-name-line excluded — it's animated by CSS keyframes which
    // always complete; clearing its transform here would race the keyframe.
    const SAFETY_SELECTORS =
      ".hero-badge, .hero-title, .hero-subtitle, .hero-cta-btn, .hero-scroll, .hero-decoration";

    // Transform-only animations (no opacity). Hero text stays at full
    // opacity from SSR through hydration, so there's no flash-then-hide
    // window even on slow machines or if GSAP loads late.
    // Hero name reveal is a CSS keyframe animation (see .hero-name-line in
    // globals.css) — guarantees the line slides all the way back to y=0
    // even if GSAP's ticker stalls mid-animation, which used to leave the
    // text clipped behind the h1's overflow-hidden.
    tl.from(".hero-badge", {
      scale: 0.5,
      duration: 0.6,
      ease: "back.out(1.7)",
    })
      .from(".hero-title", {
        y: 40,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.5")
      .from(".hero-subtitle", {
        y: 30,
        duration: 0.7,
        ease: "power3.out",
      }, "-=0.4")
      .from(".hero-cta-btn", {
        y: 20,
        scale: 0.9,
        duration: 0.5,
        ease: "back.out(1.7)",
        stagger: 0.1,
      }, "-=0.3")
      .from(".hero-scroll", {
        y: -10,
        duration: 0.6,
      }, "-=0.2")
      .from(".hero-decoration", {
        scale: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      }, "-=0.6");

    // Safety net: if the timeline fails to complete (e.g. ticker stalls on
    // a slow device, third-party script throws, tab backgrounded mid-anim),
    // force every hero element back to a clean, visible state so the page
    // never looks empty.
    const safetyId = window.setTimeout(() => {
      if (!tl.isActive() && tl.progress() >= 0.99) return;
      gsap.set(SAFETY_SELECTORS, {
        opacity: 1, y: 0, x: 0, scale: 1, skewY: 0, clearProps: "transform",
      });
    }, 6000);

    return () => window.clearTimeout(safetyId);
  }, { scope: containerRef });

  const scrollToProjects = () => {
    const el = document.getElementById("projects");
    if (el && lenis) lenis.scrollTo(el, { offset: -80 });
  };

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el && lenis) lenis.scrollTo(el, { offset: -80 });
  };

  // Split name into words for dramatic line-by-line reveal
  const nameWords = personalInfo.name.split(" ");

  return (
    <section
      ref={containerRef}
      className="relative flex h-full flex-col items-center justify-center px-6 text-center"
    >
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050812_80%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-galaxy-darker/30 via-transparent to-galaxy-darker" />

      {/* Decorative elements */}
      <div className="hero-decoration absolute left-[10%] top-[20%] h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
      <div className="hero-decoration absolute right-[15%] top-[30%] h-24 w-24 rounded-full bg-secondary/5 blur-3xl" />
      <div className="hero-decoration absolute bottom-[25%] left-[20%] h-20 w-20 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative z-10 max-w-5xl">
        {/* Status badge */}
        <div className="hero-badge badge mb-8 gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          <span className="text-xs font-medium tracking-wider text-text-secondary">
            Available for work
          </span>
        </div>

        {/* Name - dramatic split reveal */}
        <h1 className="overflow-hidden font-display text-5xl font-bold leading-[1.1] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
          {nameWords.map((word, i) => (
            <span key={i} className="hero-name-line inline-block">
              <span className="hero-name">{word}</span>
              {i < nameWords.length - 1 && "\u00A0"}
            </span>
          ))}
        </h1>

        {/* Title with accent line */}
        <div className="hero-title mt-6 flex flex-col items-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <p className="font-display text-lg font-medium text-primary-light sm:text-xl md:text-2xl">
            {personalInfo.title}
          </p>
        </div>

        {/* Subtitle */}
        <p className="hero-subtitle mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
          {personalInfo.subtitle}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <div className="hero-cta-btn">
            <MagneticButton onClick={scrollToProjects}>
              View My Work
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </MagneticButton>
          </div>
          <div className="hero-cta-btn">
            <MagneticButton
              onClick={scrollToContact}
              className="border border-glass-border bg-transparent text-white hover:bg-white/5"
            >
              Get in Touch
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-text-secondary/50">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4 text-text-secondary/50" />
        </motion.div>
      </div>
    </section>
  );
}
