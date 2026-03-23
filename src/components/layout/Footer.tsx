"use client";

import { personalInfo } from "@/lib/constants";
import { ArrowUp } from "lucide-react";
import { useLenis } from "lenis/react";

export default function Footer() {
  const lenis = useLenis();

  const scrollToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 2 });
  };

  return (
    <footer className="relative border-t border-glass-border px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-text-secondary/60">
          &copy; {new Date().getFullYear()} {personalInfo.name}
        </p>

        <p className="text-xs text-text-secondary/40">
          Built with Next.js, Three.js & GSAP
        </p>

        <button
          onClick={scrollToTop}
          className="group flex items-center gap-2 text-sm text-text-secondary/60 transition-colors hover:text-primary"
        >
          Back to top
          <ArrowUp size={14} className="transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  );
}
