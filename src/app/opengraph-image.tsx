import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Pedro Marques — Full-Stack Developer & Data Scientist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #050812 0%, #0a0e27 40%, #1a1f3a 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(129,84,255,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Available badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: 999,
              border: "1px solid rgba(129,84,255,0.3)",
              background: "rgba(129,84,255,0.08)",
              fontSize: 14,
              color: "#a1b1c7",
              letterSpacing: 2,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#4ade80",
              }}
            />
            AVAILABLE FOR PROJECTS
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              background: "linear-gradient(135deg, #8154ff 0%, #00f5ff 50%, #a37fff 100%)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.1,
              marginTop: 8,
            }}
          >
            Pedro Marques
          </div>

          {/* Divider */}
          <div
            style={{
              width: 64,
              height: 1,
              background: "linear-gradient(90deg, transparent, #8154ff, transparent)",
              margin: "4px 0",
            }}
          />

          {/* Title */}
          <div
            style={{
              fontSize: 28,
              color: "#a37fff",
              fontWeight: 500,
            }}
          >
            Full-Stack Developer & Data Scientist
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 18,
              color: "#a1b1c7",
              maxWidth: 600,
              textAlign: "center",
              lineHeight: 1.5,
              marginTop: 4,
            }}
          >
            Building intelligent, immersive digital experiences
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
