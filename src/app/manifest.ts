import type { MetadataRoute } from "next";
import { personalInfo } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${personalInfo.name} — Portfolio`,
    short_name: personalInfo.name,
    description: personalInfo.subtitle,
    start_url: "/",
    display: "standalone",
    background_color: "#050812",
    theme_color: "#8154ff",
    orientation: "portrait-primary",
    categories: ["portfolio", "business"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
