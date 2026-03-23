import type { Metadata } from "next";
import { inter, spaceGrotesk } from "./fonts";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pedromarques.dev"),
  title: {
    default: "Pedro Marques | Full-Stack Developer & Data Scientist",
    template: "%s | Pedro Marques",
  },
  description:
    "Full-Stack Developer and Data Scientist building intelligent, immersive digital experiences — from data pipelines to interactive frontends.",
  keywords: [
    "portfolio",
    "developer",
    "web development",
    "React",
    "Next.js",
    "Three.js",
    "TypeScript",
    "creative developer",
  ],
  authors: [{ name: "Pedro Marques" }],
  openGraph: {
    title: "Pedro Marques | Full-Stack Developer & Data Scientist",
    description:
      "Full-Stack Developer & Data Scientist building intelligent digital experiences.",
    type: "website",
    locale: "en_US",
    siteName: "Pedro Marques",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pedro Marques | Full-Stack Developer & Data Scientist",
    description:
      "Full-Stack Developer & Data Scientist building intelligent digital experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta name="theme-color" content="#8154ff" />
      </head>
      <body className="antialiased">
        <a href="#hero" className="skip-to-main">Skip to main content</a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
