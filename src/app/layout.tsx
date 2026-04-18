import type { Metadata } from "next";
import { inter, spaceGrotesk } from "./fonts";
import { personalInfo } from "@/lib/constants";
import Providers from "./providers";
import "./globals.css";

const SITE_URL = "https://pedromarques.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  authors: [{ name: "Pedro Marques", url: SITE_URL }],
  creator: "Pedro Marques",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pedro Marques | Full-Stack Developer & Data Scientist",
    description:
      "Full-Stack Developer & Data Scientist building intelligent digital experiences.",
    type: "website",
    locale: "en_US",
    siteName: "Pedro Marques",
    url: SITE_URL,
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: personalInfo.name,
      url: SITE_URL,
      jobTitle: personalInfo.title,
      email: personalInfo.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: personalInfo.location,
      },
      sameAs: personalInfo.socials
        .filter((s) => !s.url.startsWith("mailto:"))
        .map((s) => s.url),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: `${personalInfo.name} — Portfolio`,
      description: personalInfo.subtitle,
      author: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <a href="#hero" className="skip-to-main">Skip to main content</a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
