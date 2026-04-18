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
cp .env.example .env.local   # then fill RESEND_API_KEY + CONTACT_TO_EMAIL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev           # next dev (Turbopack)
npm run build         # production build
npm run start         # serve production build
npm run lint          # eslint
npm run type-check    # tsc --noEmit
npm test              # vitest one-shot
npm run test:watch    # vitest watch mode
npm run test:coverage # vitest + v8 coverage report
```

## Testing

Vitest + @testing-library/react with jsdom. **125 tests across libs, hooks,
the contact API route, and every UI / layout / section component.** Coverage
sits around **83% statements / 78% branches**, with `lib/`, `hooks/`,
`api/contact`, and most components at or near 100%. See
[tests/README.md](tests/README.md) for the testing strategy and what is
intentionally covered by Playwright instead (3D / WebGL).

## Environment

The contact form (`src/app/api/contact/route.ts`) needs:

- `RESEND_API_KEY` — sign up at [resend.com](https://resend.com) (free tier: 100 emails/day)
- `CONTACT_TO_EMAIL` — where submissions are delivered
- `CONTACT_FROM_EMAIL` — optional verified sender (defaults to Resend's onboarding sender)

Without these set, the API endpoint returns 502 and the form gracefully falls back to the visible mailto link.

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
