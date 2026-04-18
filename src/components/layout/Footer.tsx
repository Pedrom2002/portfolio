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
    <footer className="relative border-t border-glass-border px-6 py-3">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-1 text-xs sm:flex-row sm:gap-4">
        <p className="text-text-secondary/60">
          &copy; {new Date().getFullYear()} {personalInfo.name}
        </p>

        <p className="text-text-secondary/40">
          Built with Next.js, Three.js & GSAP
        </p>

        <button
          onClick={scrollToTop}
          className="group flex items-center gap-1.5 text-text-secondary/60 transition-colors hover:text-primary"
        >
          Back to top
          <ArrowUp size={12} className="transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  );
}
