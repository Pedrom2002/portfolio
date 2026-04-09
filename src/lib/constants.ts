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
    { label: "Projects Built", value: "12" },
    { label: "Full-Stack Apps", value: "4" },
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
    githubUrl: "https://github.com/Pedrom2002/dueit-showcase",
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
    githubUrl: "https://github.com/Pedrom2002/clutchlabs-showcase",
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
    githubUrl: "https://github.com/Pedrom2002/rushtalk-showcase",
    hasDemo: true,
    featured: true,
  },
  {
    id: "energy-forecast",
    title: "Energy Forecast PT",
    description:
      "A full-stack energy consumption forecasting system for Portugal by region. Uses gradient-boosted models (CatBoost, XGBoost, LightGBM) with Optuna tuning on 175K+ hourly samples, achieving R² 0.9913 and 90.7% RMSE improvement over baselines. Features a React 19 frontend, FastAPI backend with conformal prediction intervals, SHAP explainability, and 745+ tests.",
    technologies: ["Python", "CatBoost", "React", "FastAPI", "Docker"],
    image: "",
    githubUrl: "https://github.com/Pedrom2002/energy-forecast-pt",
    featured: true,
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
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];
