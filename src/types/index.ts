export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  hasDemo?: boolean;
  featured?: boolean;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  icon?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  email: string;
  location: string;
  socials: SocialLink[];
  stats: Stat[];
}

export interface Stat {
  label: string;
  value: string;
}
