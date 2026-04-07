"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { projects } from "@/lib/constants";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getQualityConfig } from "@/lib/quality";

const CX = 30, CY = 0, CZ = 0;
const SUN_POS = new THREE.Vector3(CX, CY, CZ);

// Shared planet positions — read by ScrollCamera to follow planets
export const planetPositions: THREE.Vector3[] = [
  new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(),
];

// ===================== ATMOSPHERE SHADER =====================
const atmosVert = /* glsl */ `
varying vec3 vWorldNormal;
varying vec3 vWorldPos;
void main() {
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const atmosFrag = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uTwilightColor;
uniform vec3 uSunPos;
uniform vec3 uCameraPos;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;
void main() {
  vec3 viewDir = normalize(vWorldPos - uCameraPos);
  vec3 normal = normalize(vWorldNormal);
  vec3 sunDir = normalize(uSunPos - vWorldPos);
  float fresnel = 1.0 - abs(dot(viewDir, normal));
  float sunFacing = dot(normal, sunDir);
  vec3 color = mix(uTwilightColor, uColor, smoothstep(-0.3, 0.6, sunFacing));
  float glow = pow(fresnel, 2.5);
  float sunMask = smoothstep(-0.4, 0.3, sunFacing);
  float nightRim = pow(fresnel, 5.0) * 0.15;
  float alpha = glow * 0.6 * sunMask + nightRim;
  gl_FragColor = vec4(color, alpha);
}`;

// ===================== EARTH SHADER =====================
const earthVert = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;
void main() {
  vUv = uv;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const earthFrag = /* glsl */ `
uniform sampler2D uDayMap;
uniform sampler2D uNightMap;
uniform vec3 uSunPos;
uniform vec3 uCameraPos;
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;
void main() {
  vec3 normal = normalize(vWorldNormal);
  vec3 sunDir = normalize(uSunPos - vWorldPos);
  vec3 viewDir = normalize(uCameraPos - vWorldPos);
  float sunDot = dot(normal, sunDir);
  float dayStrength = smoothstep(-0.15, 0.4, sunDot);
  vec3 dayColor = texture2D(uDayMap, vUv).rgb;
  vec3 nightColor = texture2D(uNightMap, vUv).rgb * 1.8;
  vec3 color = mix(nightColor, dayColor, dayStrength);
  float diffuse = max(sunDot, 0.0);
  color *= 0.12 + diffuse * 0.88;
  vec3 halfDir = normalize(sunDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 48.0);
  color += spec * dayStrength * vec3(0.6, 0.7, 1.0) * 0.25;
  float rim = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
  color = mix(color, vec3(0.3, 0.6, 1.0), rim * 0.3 * smoothstep(-0.3, 0.8, sunDot));
  gl_FragColor = vec4(color, 1.0);
}`;

// ===================== CLOUD SHADER =====================
const cloudVert = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;
void main() {
  vUv = uv;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const cloudFrag = /* glsl */ `
uniform sampler2D uCloudMap;
uniform vec3 uSunPos;
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;
void main() {
  float clouds = texture2D(uCloudMap, vUv).r;
  vec3 sunDir = normalize(uSunPos - vWorldPos);
  float light = max(dot(normalize(vWorldNormal), sunDir), 0.0);
  float sunFacing = smoothstep(-0.2, 0.5, dot(normalize(vWorldNormal), sunDir));
  vec3 color = vec3(1.0) * (0.15 + 0.85 * light);
  gl_FragColor = vec4(color, clouds * 0.55 * sunFacing);
}`;

// ===================== CONFIGS =====================
interface PlanetConfig {
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  texture: string;
  atmosphere: string;
  twilight: string;
  tilt: number;
  hasRing: boolean;
  isEarth: boolean;
}

const PLANET_CONFIGS: PlanetConfig[] = [
  { orbitRadius: 6, orbitSpeed: 0.10, size: 1.2, texture: "/textures/2k_earth_daymap.jpg", atmosphere: "#4db2ff", twilight: "#ff6633", tilt: 0.41, hasRing: false, isEarth: true },
  { orbitRadius: 10, orbitSpeed: 0.06, size: 1.0, texture: "/textures/2k_mars.jpg", atmosphere: "#ff8844", twilight: "#cc4400", tilt: 0.44, hasRing: false, isEarth: false },
  { orbitRadius: 15, orbitSpeed: 0.035, size: 1.8, texture: "/textures/2k_jupiter.jpg", atmosphere: "#ddbb77", twilight: "#aa7744", tilt: 0.05, hasRing: false, isEarth: false },
  { orbitRadius: 20, orbitSpeed: 0.02, size: 1.4, texture: "/textures/2k_saturn.jpg", atmosphere: "#eedd88", twilight: "#aa8833", tilt: 0.47, hasRing: true, isEarth: false },
];

// ===================== SUN CORONA SHADER =====================
const coronaVert = /* glsl */ `
varying vec3 vWorldPos;
varying vec3 vNormal;
void main() {
  vNormal = normalize(mat3(modelMatrix) * normal);
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const coronaFrag = /* glsl */ `
uniform vec3 uCenterPos;
uniform vec3 uCameraPos;
uniform float uInnerRadius;
uniform float uOuterRadius;
varying vec3 vWorldPos;
varying vec3 vNormal;
void main() {
  vec3 viewDir = normalize(vWorldPos - uCameraPos);
  vec3 normal = normalize(vNormal);
  float edgeFactor = 1.0 - abs(dot(viewDir, normal));
  float dist = length(vWorldPos - uCenterPos);
  float normalized = (dist - uInnerRadius) / (uOuterRadius - uInnerRadius);
  float radialFade = pow(1.0 - clamp(normalized, 0.0, 1.0), 2.5);
  float glow = edgeFactor * radialFade;
  vec3 innerColor = vec3(1.0, 0.95, 0.7);
  vec3 outerColor = vec3(1.0, 0.4, 0.1);
  vec3 color = mix(outerColor, innerColor, radialFade);
  gl_FragColor = vec4(color, glow * 0.5);
}`;

// ===================== SUN =====================
function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.ShaderMaterial>(null);
  const sunTexture = useTexture("/textures/2k_sun.jpg");
  const { camera } = useThree();
  const q = useMemo(() => getQualityConfig(), []);

  useFrame(({ clock }) => {
    if (meshRef.current) meshRef.current.rotation.y = clock.elapsedTime * 0.02;
    if (coronaRef.current) coronaRef.current.uniforms.uCameraPos.value.copy(camera.position);
  });

  return (
    <group position={[CX, CY, CZ]}>
      {/* Sun surface — HDR emissive for Bloom */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, q.sphereSegments, q.sphereSegments]} />
        <meshStandardMaterial
          map={sunTexture}
          emissiveMap={sunTexture}
          emissive="#ff9900"
          emissiveIntensity={3.5}
          toneMapped={false}
        />
      </mesh>
      {/* Corona — shader-based radial glow (HIGH/MEDIUM) or simple glow (LOW) */}
      {q.showCorona ? (
        <mesh>
          <sphereGeometry args={[6, q.sphereSegments, q.sphereSegments]} />
          <shaderMaterial
            ref={coronaRef}
            vertexShader={coronaVert}
            fragmentShader={coronaFrag}
            uniforms={{
              uCenterPos: { value: new THREE.Vector3(CX, CY, CZ) },
              uCameraPos: { value: new THREE.Vector3() },
              uInnerRadius: { value: 2.0 },
              uOuterRadius: { value: 6.0 },
            }}
            transparent
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ) : (
        <mesh>
          <sphereGeometry args={[4, q.sphereSegments, q.sphereSegments]} />
          <meshBasicMaterial
            color="#ff9900"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

// ===================== ORBIT RING =====================
function OrbitRing({ radius }: { radius: number }) {
  const q = useMemo(() => getQualityConfig(), []);
  const line = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = q.orbitRingPoints;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(CX + Math.cos(a) * radius, CY, CZ + Math.sin(a) * radius));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.04 });
    const obj = new THREE.Line(geom, mat);
    obj.userData.dispose = () => { geom.dispose(); mat.dispose(); };
    return obj;
  }, [radius, q.orbitRingPoints]);

  useEffect(() => {
    return () => { line.userData.dispose?.(); };
  }, [line]);

  return <primitive object={line} />;
}

// ===================== EARTH CLOUDS =====================
function EarthClouds({ size, tilt }: { size: number; tilt: number }) {
  const cloudRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const cloudTexture = useTexture("/textures/2k_earth_clouds.jpg");
  const q = useMemo(() => getQualityConfig(), []);

  useFrame(({ clock }) => {
    if (cloudRef.current) cloudRef.current.rotation.y = clock.elapsedTime * 0.01;
  });

  return (
    <mesh ref={cloudRef} rotation={[tilt, 0, 0]}>
      <sphereGeometry args={[size * 1.012, q.sphereSegments, q.sphereSegments]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={cloudVert}
        fragmentShader={cloudFrag}
        uniforms={{
          uCloudMap: { value: cloudTexture },
          uSunPos: { value: SUN_POS },
        }}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

// ===================== SATURN RING =====================
function SaturnRing({ size }: { size: number }) {
  const ringTexture = useTexture("/textures/2k_saturn_ring_alpha.png");
  const q = useMemo(() => getQualityConfig(), []);

  return (
    <mesh rotation={[Math.PI * 0.45, 0, 0]}>
      <ringGeometry args={[size * 1.3, size * 2.3, q.orbitRingPoints]} />
      <meshStandardMaterial
        map={ringTexture}
        alphaMap={ringTexture}
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
        depthWrite={false}
        roughness={0.85}
        metalness={0.0}
      />
    </mesh>
  );
}

// ===================== ATMOSPHERE =====================
function Atmosphere({ size, tilt, color, twilight }: {
  size: number; tilt: number; color: string; twilight: string;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();
  const q = useMemo(() => getQualityConfig(), []);

  useFrame(() => {
    if (matRef.current) matRef.current.uniforms.uCameraPos.value.copy(camera.position);
  });

  return (
    <mesh rotation={[tilt, 0, 0]}>
      <sphereGeometry args={[size * 1.18, q.atmosphereSegments, q.atmosphereSegments]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={atmosVert}
        fragmentShader={atmosFrag}
        uniforms={{
          uColor: { value: new THREE.Color(color) },
          uTwilightColor: { value: new THREE.Color(twilight) },
          uSunPos: { value: SUN_POS },
          uCameraPos: { value: new THREE.Vector3() },
        }}
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ===================== PLANET =====================
function Planet({ project, config, index }: {
  project: (typeof projects)[0];
  config: PlanetConfig;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const earthMatRef = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();
  const q = useMemo(() => getQualityConfig(), []);

  // Load textures
  const mainTexture = useTexture(config.texture);
  const nightTexture = config.isEarth ? useTexture("/textures/2k_earth_nightmap.jpg") : null;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const angle = clock.elapsedTime * config.orbitSpeed + index * (Math.PI * 2) / projects.length;
    groupRef.current.position.x = CX + Math.cos(angle) * config.orbitRadius;
    groupRef.current.position.y = CY + Math.sin(angle * 0.4) * 0.3;
    groupRef.current.position.z = CZ + Math.sin(angle) * config.orbitRadius;

    // Share position with ScrollCamera
    if (index < planetPositions.length) {
      planetPositions[index].copy(groupRef.current.position);
    }

    if (planetRef.current) planetRef.current.rotation.y += 0.003;
    if (earthMatRef.current) earthMatRef.current.uniforms.uCameraPos.value.copy(camera.position);
  });

  return (
    <group ref={groupRef}>
      {/* Planet surface */}
      <mesh ref={planetRef} rotation={[config.tilt, 0, 0]}>
        <sphereGeometry args={[config.size, q.sphereSegments, q.sphereSegments]} />
        {config.isEarth ? (
          <shaderMaterial
            ref={earthMatRef}
            vertexShader={earthVert}
            fragmentShader={earthFrag}
            uniforms={{
              uDayMap: { value: mainTexture },
              uNightMap: { value: nightTexture },
              uSunPos: { value: SUN_POS },
              uCameraPos: { value: new THREE.Vector3() },
            }}
          />
        ) : (
          <meshStandardMaterial
            map={mainTexture}
            roughness={0.85}
            metalness={0.0}
          />
        )}
      </mesh>

      {/* Earth clouds — only on HIGH/MEDIUM */}
      {config.isEarth && q.showClouds && <EarthClouds size={config.size} tilt={config.tilt} />}

      {/* Saturn ring */}
      {config.hasRing && <SaturnRing size={config.size} />}
    </group>
  );
}

// ===================== SOLAR SYSTEM =====================
export default function SolarSystem() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollProgress = useScrollProgress();

  useFrame(() => {
    if (!groupRef.current) return;
    const p = scrollProgress.current;
    const fadeIn = p < 0.16 ? 0 : p < 0.20 ? (p - 0.16) / 0.04 : 1;
    const fadeOut = p < 0.88 ? 1 : p > 0.96 ? 0 : 1 - (p - 0.88) / 0.08;
    const visibility = fadeIn * fadeOut;
    groupRef.current.scale.setScalar(visibility);
    groupRef.current.visible = visibility > 0.01;
  });

  return (
    <group ref={groupRef}>
      <pointLight position={[CX, CY, CZ]} intensity={12} color="#fff5e0" distance={60} decay={1.5} />
      <ambientLight intensity={0.03} />
      <Sun />
      {PLANET_CONFIGS.map((c, i) => <OrbitRing key={`o-${i}`} radius={c.orbitRadius} />)}
      {projects.map((p, i) => (
        <Planet key={p.id} project={p} config={PLANET_CONFIGS[i] || PLANET_CONFIGS[0]} index={i} />
      ))}
    </group>
  );
}
