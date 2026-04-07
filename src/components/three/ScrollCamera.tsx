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

// Reusable vectors for getPlanetViewOffset to avoid allocations
const _radial = new THREE.Vector3();
const _tangent = new THREE.Vector3();
const _offset = new THREE.Vector3();

// Dynamic offset: positions camera so the sun always stays on the LEFT side of screen
function getPlanetViewOffset(planetPos: THREE.Vector3): THREE.Vector3 {
  _radial.subVectors(planetPos, SUN).normalize();
  _tangent.crossVectors(UP, _radial).normalize();
  _offset.set(
    _tangent.x * 4 + _radial.x * 2,
    1.5,
    _tangent.z * 4 + _radial.z * 2,
  );
  return _offset;
}

const S = 1 / 8;
const KEYFRAMES = [
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

// Reusable vectors to avoid GC pressure per frame
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _kfPos = new THREE.Vector3();
const _kfLook = new THREE.Vector3();
const _fallbackPos = new THREE.Vector3();
const _fallbackLook = new THREE.Vector3();

function getKeyframeTarget(kf: typeof KEYFRAMES[0]): { pos: THREE.Vector3; look: THREE.Vector3 } {
  if (kf.planet >= 0 && kf.planet < planetPositions.length) {
    const pp = planetPositions[kf.planet];
    if (pp.lengthSq() < 0.01) {
      _fallbackPos.set(SC.x, 8, SC.z + 18);
      _fallbackLook.set(SC.x, 0, SC.z);
      return { pos: _fallbackPos, look: _fallbackLook };
    }
    const offset = getPlanetViewOffset(pp);
    _kfPos.set(pp.x + offset.x, pp.y + offset.y, pp.z + offset.z);
    _kfLook.copy(pp);
    return { pos: _kfPos, look: _kfLook };
  }
  _kfPos.set(kf.pos[0], kf.pos[1], kf.pos[2]);
  _kfLook.set(kf.look[0], kf.look[1], kf.look[2]);
  return { pos: _kfPos, look: _kfLook };
}

export default function ScrollCamera() {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 4, 18));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));
  const ready = useRef(false);
  const scrollRef = useRef(0);

  // Cache scroll progress via event listener instead of reading DOM every frame
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useFrame(() => {
    const progress = scrollRef.current;

    let fromIdx = 0;
    for (let i = KEYFRAMES.length - 2; i >= 0; i--) {
      if (progress >= KEYFRAMES[i].t) {
        fromIdx = i;
        break;
      }
    }
    const toIdx = Math.min(fromIdx + 1, KEYFRAMES.length - 1);

    const from = getKeyframeTarget(KEYFRAMES[fromIdx]);
    const to = getKeyframeTarget(KEYFRAMES[toIdx]);

    const range = KEYFRAMES[toIdx].t - KEYFRAMES[fromIdx].t;
    const local = range > 0 ? smootherstep((progress - KEYFRAMES[fromIdx].t) / range) : 0;

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
