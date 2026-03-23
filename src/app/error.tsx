"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050812_80%)]" />

      <div className="relative z-10 max-w-md">
        <span className="font-display text-6xl font-bold gradient-text sm:text-7xl">
          Oops
        </span>

        <p className="mt-4 font-display text-xl font-medium text-white sm:text-2xl">
          Something went wrong
        </p>

        <p className="mt-3 text-text-secondary">
          An unexpected error occurred. This might be a temporary issue with the
          3D rendering engine.
        </p>

        <button
          onClick={reset}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    </div>
  );
}
