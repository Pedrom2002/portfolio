"use client";

import dynamic from "next/dynamic";

const GalaxyCanvas = dynamic(
  () => import("@/components/three/GalaxyCanvas"),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-[#050812]" />,
  }
);

export default function GalaxyBackground() {
  return <GalaxyCanvas />;
}
