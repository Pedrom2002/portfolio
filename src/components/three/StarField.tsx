"use client";

import { useRef, useMemo } from "react";
import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";
import { getQualityConfig } from "@/lib/quality";

export default function StarField() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useMousePosition();
  const smooth = useRef({ x: 0, y: 0 });
  const q = useMemo(() => getQualityConfig(), []);

  useFrame(() => {
    if (!groupRef.current) return;
    smooth.current.x += (mouse.current.normalizedX - smooth.current.x) * 0.015;
    smooth.current.y += (mouse.current.normalizedY - smooth.current.y) * 0.015;

    groupRef.current.rotation.y = smooth.current.x * 0.05;
    groupRef.current.rotation.x = smooth.current.y * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* Dense far background */}
      <Stars
        radius={300}
        depth={100}
        count={q.starCount1}
        factor={4}
        saturation={0.2}
        fade
        speed={0.5}
      />
      {/* Closer brighter layer */}
      {q.starCount2 > 0 && (
        <Stars
          radius={150}
          depth={60}
          count={q.starCount2}
          factor={6}
          saturation={0.4}
          fade
          speed={0.8}
        />
      )}
    </group>
  );
}
