"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useQuality } from "@/hooks/useQuality";

const CONFIG = {
  radius: 9,
  branches: 5,
  spin: 1.4,
  randomness: 0.7,
  randomnessPower: 3,
  insideColor: "#ff6030",
  midColor: "#8154ff",
  outsideColor: "#1b3984",
  baseSize: 0.018,
};

// Smoothstep function — smooth S-curve with zero derivative at endpoints
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// React 19's hook purity/immutability rules flag this 60fps particle physics
// loop: the init uses Math.random() and the useFrame body mutates Float32Arrays
// that were created inside useMemo. Both are intentional — allocating new
// typed arrays every frame would trash the GC. The module-level disable keeps
// the file lint-clean without changing runtime behaviour.
/* eslint-disable react-hooks/purity, react-hooks/immutability */

export default function GalaxyParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useMousePosition();
  const smoothMouse = useRef({ x: 0, y: 0 });
  const scrollProgress = useScrollProgress();
  const { viewport } = useThree();
  const frameCount = useRef(0);
  const q = useQuality();
  const count = q.particleCount;

  const { positions, colors, originalPositions, velocities, magnetism, baseColors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const baseColors = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const magnetism = new Float32Array(count); // per-particle response variation

    const insideColor = new THREE.Color(CONFIG.insideColor);
    const midColor = new THREE.Color(CONFIG.midColor);
    const outsideColor = new THREE.Color(CONFIG.outsideColor);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const distance = Math.pow(Math.random(), 0.7) * CONFIG.radius;
      const branchAngle = ((i % CONFIG.branches) / CONFIG.branches) * Math.PI * 2;
      const spinAngle = distance * CONFIG.spin;

      const rp = CONFIG.randomnessPower;
      const rm = CONFIG.randomness;
      const randomX = Math.pow(Math.random(), rp) * (Math.random() < 0.5 ? 1 : -1) * rm;
      const randomY = Math.pow(Math.random(), rp) * (Math.random() < 0.5 ? 1 : -1) * rm * 0.35;
      const randomZ = Math.pow(Math.random(), rp) * (Math.random() < 0.5 ? 1 : -1) * rm;

      const x = Math.cos(branchAngle + spinAngle) * distance + randomX;
      const y = randomY;
      const z = Math.sin(branchAngle + spinAngle) * distance + randomZ;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;
      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;

      // Per-particle magnetism: how strongly each particle responds (0.3 to 2.0)
      magnetism[i] = 0.3 + Math.random() * 1.7;

      // 3-stop color gradient
      const t = distance / CONFIG.radius;
      const mixedColor = new THREE.Color();
      if (t < 0.5) {
        mixedColor.copy(insideColor).lerp(midColor, t * 2);
      } else {
        mixedColor.copy(midColor).lerp(outsideColor, (t - 0.5) * 2);
      }
      const brightness = 0.8 + Math.random() * 0.4;
      baseColors[i3] = mixedColor.r * brightness;
      baseColors[i3 + 1] = mixedColor.g * brightness;
      baseColors[i3 + 2] = mixedColor.b * brightness;
      colors[i3] = baseColors[i3];
      colors[i3 + 1] = baseColors[i3 + 1];
      colors[i3 + 2] = baseColors[i3 + 2];
    }

    return { positions, colors, originalPositions, velocities, magnetism, baseColors };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const dt = Math.min(delta, 0.05);

    // Fade out galaxy when solar system appears, bring it back at contact
    const sp = scrollProgress.current;
    const fadeOut = sp < 0.14 ? 1 : sp > 0.20 ? 0 : 1 - (sp - 0.14) / 0.06;
    const fadeIn = sp < 0.90 ? 0 : sp > 0.98 ? 1 : (sp - 0.90) / 0.08;
    const galaxyOpacity = Math.max(fadeOut, fadeIn * 0.7);
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.9 * galaxyOpacity;
    const visible = galaxyOpacity > 0.01;
    pointsRef.current.visible = visible;

    // Invisible → skip physics & color updates entirely. Saves a 28k-particle
    // loop per frame while user is on the solar-system / project sections.
    if (!visible) return;

    // Rotate galaxy slowly
    pointsRef.current.rotation.y += dt * 0.035;

    // At the end: galaxy enters from left and scales up
    if (fadeIn > 0) {
      const t = smoothstep(0, 1, fadeIn);
      const startX = -20;
      const endX = 15;
      const endZ = -5;
      pointsRef.current.position.set(
        startX + (endX - startX) * t,
        0,
        endZ,
      );
      pointsRef.current.scale.setScalar(2.5);
    } else if (fadeOut > 0) {
      pointsRef.current.position.set(0, 0, 0);
      pointsRef.current.scale.setScalar(1);
    }

    // LOW tier: skip physics entirely (static galaxy with rotation only)
    if (q.mouseInteraction === "off") return;

    // Mouse interaction: active during hero (first 20%) and contact (final section)
    const heroInteraction = Math.max(0, 1 - sp / 0.20);
    const contactInteraction = fadeIn;
    const interactionStrength = Math.max(heroInteraction, contactInteraction);

    smoothMouse.current.x += (mouse.current.normalizedX - smoothMouse.current.x) * 0.12;
    smoothMouse.current.y += (mouse.current.normalizedY - smoothMouse.current.y) * 0.12;

    const posAttr = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const colAttr = pointsRef.current.geometry.getAttribute("color") as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;
    const col = colAttr.array as Float32Array;
    const mx = smoothMouse.current.x * viewport.width * 0.5;
    const my = smoothMouse.current.y * viewport.height * 0.5;

    const maxRadius = 5.0;
    const damping = 0.94;
    const returnStrength = 0.002;

    // MEDIUM tier: process every 3rd particle for mouse interaction, update colors every 2nd frame
    const step = q.mouseInteraction === "reduced" ? 3 : 1;
    const skipColorUpdate = q.mouseInteraction === "reduced" && frameCount.current % 2 !== 0;
    frameCount.current++;

    for (let i = 0; i < count; i += step) {
      const i3 = i * 3;
      const dx = pos[i3] - mx;
      const dy = pos[i3 + 1] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const mag = magnetism[i];

      if (dist < maxRadius && dist > 0.01) {
        const normalizedDist = dist / maxRadius;
        const dirX = dx / dist;
        const dirY = dy / dist;

        // Multi-zone smoothstep force — no hard edges
        const innerForce = smoothstep(0.3, 0.0, normalizedDist) * 1.8;
        const midForce = smoothstep(0.7, 0.3, normalizedDist) * 0.6;
        const outerForce = smoothstep(1.0, 0.7, normalizedDist) * 0.15;
        const totalForce = (innerForce + midForce + outerForce) * mag * 0.025 * interactionStrength;

        // Perpendicular direction for swirl effect
        const perpX = -dirY;
        const perpY = dirX;
        const swirlStrength = smoothstep(0.0, 0.3, normalizedDist) * smoothstep(1.0, 0.5, normalizedDist) * 0.6;

        // Push away + swirl with momentum
        velocities[i3] += dirX * totalForce + perpX * swirlStrength * totalForce;
        velocities[i3 + 1] += dirY * totalForce + perpY * swirlStrength * totalForce;
        // Z-axis perturbation for depth
        velocities[i3 + 2] += (Math.random() - 0.5) * totalForce * 0.3;

        // Velocity-based brightness — disturbed particles glow
        if (!skipColorUpdate) {
          const speed = Math.sqrt(
            velocities[i3] * velocities[i3] +
            velocities[i3 + 1] * velocities[i3 + 1]
          );
          const glow = Math.min(speed * 12, 1.0);
          col[i3] = baseColors[i3] + glow * 0.5;
          col[i3 + 1] = baseColors[i3 + 1] + glow * 0.4;
          col[i3 + 2] = baseColors[i3 + 2] + glow * 0.7;
        }
      } else if (!skipColorUpdate) {
        // Fade color back to base
        col[i3] += (baseColors[i3] - col[i3]) * dt * 3;
        col[i3 + 1] += (baseColors[i3 + 1] - col[i3 + 1]) * dt * 3;
        col[i3 + 2] += (baseColors[i3 + 2] - col[i3 + 2]) * dt * 3;
      }

      // Damping — smooth deceleration
      velocities[i3] *= damping;
      velocities[i3 + 1] *= damping;
      velocities[i3 + 2] *= damping;

      // Apply velocity
      pos[i3] += velocities[i3];
      pos[i3 + 1] += velocities[i3 + 1];
      pos[i3 + 2] += velocities[i3 + 2];

      // Gentle spring back to original (slow drift, not snap)
      const springX = originalPositions[i3] - pos[i3];
      const springY = originalPositions[i3 + 1] - pos[i3 + 1];
      const springZ = originalPositions[i3 + 2] - pos[i3 + 2];
      velocities[i3] += springX * returnStrength;
      velocities[i3 + 1] += springY * returnStrength;
      velocities[i3 + 2] += springZ * returnStrength;
    }

    posAttr.needsUpdate = true;
    if (!skipColorUpdate) colAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={CONFIG.baseSize}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        transparent
        opacity={0.9}
      />
    </points>
  );
}
