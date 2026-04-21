"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personalInfo } from "@/lib/constants";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const minTime = 2200;
    let dismissed = false;

    const sceneReady = new Promise<void>((resolve) => {
      const handler = () => { resolve(); window.removeEventListener("scene-ready", handler); };
      window.addEventListener("scene-ready", handler);
      // Fallback if scene-ready never fires (e.g. WebGL crash without
      // CanvasErrorBoundary catch): keep tight so users aren't held hostage.
      setTimeout(resolve, 3000);
    });

    const minWait = new Promise<void>((resolve) => setTimeout(resolve, minTime));

    Promise.all([
      document.fonts.ready,
      sceneReady,
      minWait,
    ]).then(() => {
      if (!dismissed) {
        dismissed = true;
        setIsLoading(false);
      }
    });

    return () => {
      dismissed = true;
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-galaxy-darker"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Animated ring */}
            <motion.div
              className="h-16 w-16 rounded-full border-2 border-primary/30"
              style={{ borderTopColor: "var(--color-primary)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-display text-lg tracking-widest text-text-secondary"
            >
              {personalInfo.name}
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
