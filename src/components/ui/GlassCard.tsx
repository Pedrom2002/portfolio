"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className,
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -6, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "glass overflow-hidden rounded-2xl p-6 transition-shadow duration-300",
        hover && "hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
