# Pedro Marques — Portfolio

Personal portfolio featuring a 3D galaxy theme with an interactive solar system project showcase.

**Live:** [pedromarques.dev](https://pedromarques.dev)

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **3D:** React Three Fiber, Drei, Three.js
- **Animation:** GSAP (ScrollTrigger), Framer Motion
- **Scrolling:** Lenis (smooth scroll)
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript

## Features

- Interactive 3D galaxy background with adaptive quality detection
- Solar system visualization for project showcase
- Smooth scroll-driven animations
- Custom cursor, magnetic buttons, glass cards
- Full SEO (Open Graph, sitemap, robots)
- Responsive design with mobile optimizations

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/            # Pages, layout, SEO, providers
├── components/
│   ├── layout/     # Navigation, Footer, CustomCursor, Preloader
│   ├── sections/   # Hero, About, Projects, Skills, Contact
│   ├── three/      # Galaxy, StarField, SolarSystem, ScrollCamera
│   └── ui/         # GlassCard, ScrollReveal, GradientText, MagneticButton
├── hooks/          # useMediaQuery, useScrollProgress, useMousePosition
├── lib/            # Constants, utilities, GSAP config, quality detection
└── types/          # TypeScript interfaces
```

## Contact

- **Email:** pedrom02.dev@gmail.com
- **LinkedIn:** [Pedro Marques](https://www.linkedin.com/in/pedro-marques-056baa366/)
- **GitHub:** [Pedrom2002](https://github.com/Pedrom2002)
