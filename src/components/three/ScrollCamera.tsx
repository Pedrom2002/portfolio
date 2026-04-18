"use client";

import { useRef, useCallback, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { planetPositions } from "./SolarSystem";

function smootherstep(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Solar system center (sun position)
const SC = { x: 30, y: 0, z: 0 };
const SUN = new THREE.Vector3(SC.x, SC.y, SC.z);
const UP = new THREE.Vector3(0, 1, 0);

// Dynamic offset: positions camera so the sun always stays on the LEFT side of screen
function getPlanetViewOffset(planetPos: THREE.Vector3): THREE.Vector3 {
  const radial = new THREE.Vector3().subVectors(planetPos, SUN).normalize();
  const tangent = new THREE.Vector3().crossVectors(UP, radial).normalize();
  return new THREE.Vector3(
    tangent.x * 4 + radial.x * 2,
    1.5,
    tangent.z * 4 + radial.z * 2,
  );
}

interface Keyframe {
  t: number;
  pos: [number, number, number];
  look: [number, number, number];
  planet: number;
}

// Default keyframe shape — `t` for planet keyframes is overwritten at runtime
// from the actual section positions so the camera stays in sync with the cards
// regardless of total page height.
function buildDefaultKeyframes(): Keyframe[] {
  const S = 1 / 8;
  return [
    { t: 0,       pos: [0, 4, 18], look: [0, 0, 0], planet: -1 },
    { t: S * 0.8, pos: [0, 1.5, 7], look: [0, 0, 0], planet: -1 },
    { t: S * 1.3, pos: [0, 0.2, -2], look: [5, 0, -10], planet: -1 },
    { t: S * 2,   pos: [SC.x, 28, SC.z + 10], look: [SC.x, 0, SC.z], planet: -1 },
    { t: S * 3,   pos: [0, 0, 0], look: [0, 0, 0], planet: 0 },
    { t: S * 4,   pos: [0, 0, 0], look: [0, 0, 0], planet: 1 },
    { t: S * 5,   pos: [0, 0, 0], look: [0, 0, 0], planet: 2 },
    { t: S * 6,   pos: [0, 0, 0], look: [0, 0, 0], planet: 3 },
    { t: S * 7,   pos: [SC.x - 8, 14, SC.z + 25], look: [SC.x, 0, SC.z], planet: -1 },
    { t: 1.00,    pos: [5, 12, 40], look: [15, 0, -5], planet: -1 },
  ];
}

// Compute keyframe `t` values from real DOM section positions so the planet
// transitions are anchored to the project cards, not arbitrary page fractions.
function computeKeyframes(): Keyframe[] {
  const kf = buildDefaultKeyframes();
  if (typeof window === "undefined") return kf;

  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return kf;

  for (let i = 0; i < kf.length; i++) {
    const k = kf[i];
    if (k.planet < 0) continue;
    const el = document.getElementById(`project-${k.planet}`);
    if (!el) continue;
    const top = el.getBoundingClientRect().top + window.scrollY;
    k.t = Math.max(0, Math.min(1, top / max));
  }

  // Pin the post-planet keyframe to start right after the last planet ends.
  const lastPlanetIdx = kf.findIndex((k) => k.planet === 3);
  if (lastPlanetIdx >= 0 && lastPlanetIdx + 1 < kf.length) {
    const lastEl = document.getElementById("project-3");
    if (lastEl) {
      const bottom =
        lastEl.getBoundingClientRect().bottom + window.scrollY;
      kf[lastPlanetIdx + 1].t = Math.max(
        kf[lastPlanetIdx].t + 0.01,
        Math.min(1, bottom / max),
      );
    }
  }

  // Ensure monotonic order.
  for (let i = 1; i < kf.length; i++) {
    if (kf[i].t < kf[i - 1].t) kf[i].t = kf[i - 1].t + 0.001;
  }
  return kf;
}

// Reusable vectors to avoid GC pressure per frame
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();

function getKeyframeTarget(kf: Keyframe): { pos: THREE.Vector3; look: THREE.Vector3 } {
  if (kf.planet >= 0 && kf.planet < planetPositions.length) {
    const pp = planetPositions[kf.planet];
    if (pp.lengthSq() < 0.01) {
      return {
        pos: new THREE.Vector3(SC.x, 8, SC.z + 18),
        look: new THREE.Vector3(SC.x, 0, SC.z),
      };
    }
    const offset = getPlanetViewOffset(pp);
    return {
      pos: new THREE.Vector3(
        pp.x + offset.x,
        pp.y + offset.y,
        pp.z + offset.z,
      ),
      look: pp.clone(),
    };
  }
  return {
    pos: new THREE.Vector3(kf.pos[0], kf.pos[1], kf.pos[2]),
    look: new THREE.Vector3(kf.look[0], kf.look[1], kf.look[2]),
  };
}

export default function ScrollCamera() {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 4, 18));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));
  const ready = useRef(false);
  const keyframesRef = useRef<Keyframe[]>(buildDefaultKeyframes());

  useEffect(() => {
    const refresh = () => {
      keyframesRef.current = computeKeyframes();
    };
    // Initial compute after layout settles.
    const t = setTimeout(refresh, 100);
    window.addEventListener("resize", refresh);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", refresh);
    };
  }, []);

  const getScrollProgress = useCallback(() => {
    if (typeof window === "undefined") return 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
  }, []);

  useFrame(() => {
    const progress = getScrollProgress();
    const KF = keyframesRef.current;

    let fromIdx = 0;
    for (let i = KF.length - 2; i >= 0; i--) {
      if (progress >= KF[i].t) {
        fromIdx = i;
        break;
      }
    }
    const toIdx = Math.min(fromIdx + 1, KF.length - 1);

    const from = getKeyframeTarget(KF[fromIdx]);
    const to = getKeyframeTarget(KF[toIdx]);

    const range = KF[toIdx].t - KF[fromIdx].t;
    const local = range > 0 ? smootherstep((progress - KF[fromIdx].t) / range) : 0;

    _targetPos.lerpVectors(from.pos, to.pos, local);
    _targetLook.lerpVectors(from.look, to.look, local);

    if (!ready.current) {
      currentPos.current.copy(_targetPos);
      currentLook.current.copy(_targetLook);
      ready.current = true;
    } else {
      currentPos.current.lerp(_targetPos, 0.08);
      currentLook.current.lerp(_targetLook, 0.08);
    }

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLook.current);
  });

  return null;
}
