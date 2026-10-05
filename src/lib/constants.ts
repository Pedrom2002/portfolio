import type { PersonalInfo, Project, SkillCategory } from "@/types";

export const personalInfo: PersonalInfo = {
  name: "Pedro Marques",
  title: "Full-Stack Developer & Data Scientist",
  subtitle: "Building intelligent, immersive digital experiences — from data pipelines to interactive frontends",
  bio: "Full-stack developer and data scientist with hands-on experience shipping production software across mobile, web, and ML — from a React Native app backed by 2,200+ tests to machine learning systems processing millions of data points in real time. I completed a 6-month internship at Quic Portugal and hold a CTeSP in Mobile Development from ISTEC. I focus on clean architecture, solid test coverage, and building software that solves real problems.",
  email: "pedrom02.dev@gmail.com",
  location: "Lisbon, Portugal",
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/Pedrom2002",
      icon: "github",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/pedro-marques-056baa366/",
      icon: "linkedin",
    },
    {
      name: "Email",
      url: "mailto:pedrom02.dev@gmail.com",
      icon: "mail",
    },
  ],
  stats: [
    { label: "Projects Built", value: "16" },
    { label: "Full-Stack Apps", value: "8" },
    { label: "ML Models", value: "10" },
    { label: "Languages", value: "9" },
  ],
};

export const projects: Project[] = [
  {
    id: "dueit",
    title: "Dueit",
    description:
      "A mobile app that helps couples manage their home together — from shared tasks and burnout detection to AI-powered insights. Built with real-time sync, offline support, end-to-end encryption, and a gamification system. Backed by 2,200+ tests with 95% coverage.",
    technologies: ["React Native", "TypeScript", "Firebase", "Expo"],
    image: "/images/dueit-logo.png",
    githubUrl: "https://github.com/Pedrom2002/dueit",
    hasDemo: true,
    featured: true,
  },
  {
    id: "energy-forecast",
    title: "Energy Forecast PT",
    description:
      "A full-stack energy consumption forecasting system for Portugal by region. Gradient-boosted tree models (XGBoost / LightGBM / CatBoost) with Optuna tuning (30 trials × 5-fold walk-forward CV), permutation-importance feature selection, and split conformal prediction intervals on 40K+ real hourly samples — production model (with_lags) hits MAPE 1.44%, R² 0.998, 61% RMSE reduction vs. the best baseline. React 19 + TypeScript frontend (EN/PT, dark-only), FastAPI backend with 7 routers, one-click HuggingFace Spaces deploy, and 760+ tests.",
    technologies: ["Python", "XGBoost", "LightGBM", "React", "TypeScript", "FastAPI", "Docker"],
    image: "",
    githubUrl: "https://github.com/Pedrom2002/energy-forecast-pt",
    demoUrl: "https://pedrom02-energy-forecast-pt.hf.space",
    hasDemo: true,
    featured: true,
  },
  {
    id: "rushtalk",
    title: "RushTalk",
    description:
      "A Discord-like voice and text platform built from scratch for gamers. Features a custom Rust audio engine with sub-60ms latency, a Go backend with 41 REST endpoints, and cross-platform desktop apps. 12,000+ lines of code across 4 languages.",
    technologies: ["Rust", "Go", "Svelte", "Tauri"],
    image: "/images/rushtalk-logo.png",
    githubUrl: "https://github.com/Pedrom2002/rushtalk",
    hasDemo: true,
    featured: true,
  },
  {
    id: "clutchlabs",
    title: "Clutch Labs",
    description:
      "An AI-powered analytics platform for competitive CS2 players. Uses 7 specialized ML models to detect gameplay errors, predict round outcomes, and generate tactical insights from demo files — processing millions of data points per match in under 60 seconds.",
    technologies: ["Next.js", "FastAPI", "PostgreSQL", "Python"],
    image: "/images/clutchlabs-logo.png",
    githubUrl: "https://github.com/Pedrom2002/clutchlabs",
    hasDemo: true,
    featured: true,
  },
];

// Shipped client/production work and research, shown below the solar system.
export const otherProjects: Project[] = [
  {
    id: "quic-platform",
    title: "Quic Platform",
    description:
      "Multi-tenant event management SaaS built during my internship at Quic Portugal: client portal, automated email notifications via QStash queues, Stripe ticket checkout, Gemini-powered AI features, and an Expo staff app for QR check-in. Row-level security on Supabase, Vitest unit tests and Playwright e2e.",
    technologies: ["Next.js", "Supabase", "Stripe", "QStash", "Gemini"],
    image: "",
    githubUrl: "https://github.com/Pedrom2002/quic-platform",
    demoUrl: "https://quic-plat.vercel.app",
  },
  {
    id: "goalfest",
    title: "Goalfest Lisboa",
    description:
      "Official fanzone website for the 2026 FIFA World Cup in Lisbon. Statically generated Next.js site in PT/EN with an interactive 3D venue preview, Mapbox map, Sentry error tracking, accessibility tests (jest-axe) and Playwright e2e.",
    technologies: ["Next.js", "React Three Fiber", "Mapbox", "next-intl"],
    image: "",
    githubUrl: "https://github.com/Pedrom2002/goalfest-website",
  },
  {
    id: "activobank-raffle",
    title: "ActivoBank Fan Zone Raffle",
    description:
      "Real-time raffle system for the ActivoBank Fan Zone at the 2026 World Cup. Fans scan a TV QR code (HMAC-SHA256 time-windowed tokens against replay) to enter; admins draw winners live. JWT sessions, Supabase RLS, audit log and a daily GDPR cleanup cron.",
    technologies: ["Next.js", "Supabase", "JWT", "HMAC"],
    image: "",
    githubUrl: "https://github.com/Pedrom2002/active-bank-raffle",
  },
  {
    id: "metacognition-bench",
    title: "Metacognition Benchmark",
    description:
      "Kaggle x DeepMind hackathon submission: a 960-item benchmark probing 9 of 10 metacognition constructs across 11 frontier LLMs (11,726 evaluations). Finds a 66-point accuracy collapse under an authoritative-but-wrong prefix, and that calibration, not abstention, separates frontier models.",
    technologies: ["Python", "LLM Evaluation", "Wikidata", "Statistics"],
    image: "",
    githubUrl: "https://github.com/Pedrom2002/metacognition-bench",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    skills: [
      { name: "React / Next.js" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "HTML / CSS" },
    ],
  },
  {
    name: "Backend & Data",
    skills: [
      { name: "Python" },
      { name: "Node.js" },
      { name: "PostgreSQL" },
      { name: "REST APIs" },
      { name: "Pandas / NumPy" },
      { name: "Scikit-learn" },
    ],
  },
  {
    name: "Data Science & Tools",
    skills: [
      { name: "Machine Learning" },
      { name: "Data Visualization" },
      { name: "TensorFlow / PyTorch" },
      { name: "Git / GitHub" },
      { name: "Docker" },
      { name: "SQL" },
    ],
  },
];

export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "More", href: "#more-projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];
