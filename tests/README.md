# Tests

## Stack

- **Vitest 4** (`pool: vmForks`, `isolate: false` — required for Windows + jsdom + Next imports)
- **@testing-library/react** + **user-event** for component tests
- **jsdom** for the DOM environment
- **@vitest/coverage-v8** for coverage

## Layout

```
tests/
├── lib/                    # Pure libs — 100% covered
│   ├── contact-schema.test.ts
│   ├── email.test.ts        # Resend mocked at module boundary
│   ├── rate-limit.test.ts
│   ├── quality.test.ts
│   └── utils.test.ts
├── hooks/                  # Custom hooks via renderHook
│   ├── useMediaQuery.test.tsx
│   ├── useMousePosition.test.ts
│   ├── useQuality.test.ts
│   └── useScrollProgress.test.ts
├── api/                    # Next.js Route Handlers
│   └── contact.test.ts      # email + rate-limit mocked
└── components/
    ├── ui/                 # Pure presentational
    ├── layout/             # Navigation, Footer, CustomCursor, Preloader, CanvasErrorBoundary
    └── sections/           # Hero, About, Projects, Skills, Contact, ContactForm
```

## Running

```bash
npm test               # one-shot
npm run test:watch     # watch mode
npm run test:coverage  # with v8 coverage report
```

## Coverage at a glance

```
All files          | 83.29% stmts | 77.29% branch | 80% funcs | 85.55% lines
 app/api/contact   |   93.10
 components/layout |   78.76
 components/sections |  79.20
 components/ui     |   78.94
 hooks             |   89.13
 lib               |   89.13
```

100% of files in `lib/`, `hooks/`, `app/api/`, `components/ui/`, `components/layout/`,
and `components/sections/` (excluding `ProjectSnapZone` and 3D) have at least one test.

## What is intentionally NOT unit-tested

These are excluded from the v8 coverage scope because jsdom can't model them
faithfully — they're covered by Playwright snapshot scripts under
`scripts/playwright-checks/` instead:

- **`src/components/three/**`** — React Three Fiber + WebGL. jsdom has no GPU.
- **`src/components/sections/ProjectSnapZone.tsx`** — pure GSAP `ScrollTrigger`
  driven by real scroll events; verified via E2E.
- **`src/lib/gsap-config.ts`** — side-effect plugin registration on import.
- **`src/app/{layout,page,providers,error,not-found,manifest,sitemap,robots,opengraph-image,fonts}.ts(x)`**
  — Next.js metadata / framework wiring, validated by `npm run build`.

## Patterns

### Mocking GSAP

The real `useGSAP` from `@gsap/react` runs after the ref is attached. To test
components that use it, mock it via `useEffect` so refs are populated:

```ts
import { useEffect } from "react";
vi.mock("@gsap/react", () => ({
  useGSAP: (cb: () => void) => useEffect(() => { cb(); }, []),
}));
vi.mock("@/lib/gsap-config", () => ({
  gsap: { from: vi.fn(), quickTo: vi.fn(() => vi.fn()) },
}));
```

### Mocking Lenis

Components using `useLenis` (Hero, Navigation, Footer):

```ts
const scrollToMock = vi.fn();
vi.mock("lenis/react", () => ({
  useLenis: () => ({ scrollTo: scrollToMock }),
}));
```

### Mocking Resend (email)

Email tests mock the SDK as a class:

```ts
const sendMock = vi.fn();
vi.mock("resend", () => ({
  Resend: class { emails = { send: sendMock }; },
}));
```

### Resetting the rate-limit bucket between tests

The in-memory bucket map is module-level state, so each test re-imports the
route via `vi.resetModules()` to start fresh.
