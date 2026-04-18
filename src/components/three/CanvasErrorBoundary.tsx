"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[CanvasErrorBoundary]", error);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("scene-ready"));
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="fixed inset-0 -z-10 bg-[#050812]" aria-hidden="true" />
        )
      );
    }
    return this.props.children;
  }
}
