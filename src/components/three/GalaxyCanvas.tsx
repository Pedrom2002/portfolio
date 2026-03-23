"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import GalaxyParticles from "./GalaxyParticles";
import StarField from "./StarField";
import SolarSystem from "./SolarSystem";
import ScrollCamera from "./ScrollCamera";
import { getQualityConfig } from "@/lib/quality";

function SceneReadySignal() {
  const fired = useRef(false);
  useFrame(() => {
    if (!fired.current) {
      fired.current = true;
      window.dispatchEvent(new Event("scene-ready"));
    }
  });
  return null;
}

export default function GalaxyCanvas() {
  const q = getQualityConfig();

  return (
    <div
      className="fixed inset-0 z-0"
      aria-hidden="true"
      role="presentation"
      style={
        !q.postProcessing
          ? { boxShadow: "inset 0 0 200px rgba(0,0,0,0.5)" }
          : undefined
      }
    >
      <Canvas
        camera={{ position: [0, 3, 16], fov: 75, near: 0.1, far: 1000 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={q.dpr}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneReadySignal />
          <ScrollCamera />
          <StarField />
          <GalaxyParticles />
          <SolarSystem />
          {q.postProcessing && (
            <EffectComposer>
              <Bloom
                intensity={q.bloomIntensity}
                luminanceThreshold={0.8}
                luminanceSmoothing={0.7}
                mipmapBlur={q.mipmapBlur}
              />
              <Vignette offset={0.25} darkness={0.5} />
            </EffectComposer>
          )}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
