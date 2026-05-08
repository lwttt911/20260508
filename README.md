# DuoLe TikTok Growth Studio

Company-internal workbench for turning TikTok viral-video analysis into reusable content-production assets.

As of 2026-05-08 this repository contains a React + Vite + TypeScript desktop front-end prototype for the home dashboard. It is not connected to a backend database, FFmpeg pipeline, AI provider, or Feishu sync yet. The UI uses hard-coded sample data to validate the product shell, visual direction, and homepage information hierarchy.

## Product Goal

The system is designed as a closed loop:

1. Import viral TikTok videos.
2. Cut videos into segments with FFmpeg, then confirm segments manually.
3. Extract objective segment evidence.
4. Judge nine-part structure and execution factors.
5. Store reusable factors locally and sync selected tables to Feishu.
6. Match high-priority factors to SKU records.
7. Generate scripts, storyboards, material requirements, VEO prompts, and negative prompts.
8. Record publishing results.
9. Feed results back into the factor library to update factor effectiveness and reuse priority.

The first product surface focuses on helping one operator understand the workbench state and choose the next action.

## Current UI

The app has one default desktop homepage prototype: a product-led workbench with a TikTok creator-commerce poster hero, left black navigation, light right-side work area, three workflow modules, and a compact status strip.

The current homepage is still under visual iteration. The latest 2026-05-08 feedback requires the next UI pass to keep the whole desktop homepage in one screen without scrolling, keep the hero / hook stage large, use three independent module boards instead of one unified panel, reduce homepage module detail, and make the right workbench feel Apple-white rather than gray.

Open it with:

```bash
npm run dev -- --port 5173
```

Then visit:

- `http://localhost:5173/`

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev -- --port 5173
```

Build production assets:

```bash
npm run build
```

Preview a production build:

```bash
npm run preview -- --port 4173
```

## Project Structure

```text
.
├── PRODUCT.md              Product context for design decisions
├── DESIGN.md               Visual system and UI constraints
├── AGENTS.md               Project-specific guidance for AI agents
├── docs/
│   ├── architecture.md     Product and front-end architecture notes
│   ├── runbook.md          Local run, build, and troubleshooting steps
│   └── handoff.md          2026-05-08 handoff status
├── src/
│   ├── main.tsx            React application and default homepage
│   └── styles.css          Design tokens, layout, and responsive rules
├── package.json
└── vite.config.ts
```

## Design Rules

- Use `ui-ux-pro-max` and `impeccable` for UI direction, critique, and polish.
- Use `lucide-react` for icons.
- Keep desktop quality first for the 2026-05-08 review cycle. Mobile exists only as a basic responsive fallback.
- Do not return to a black square lettermark or hand-drawn icon set.
- Home can feel more branded and product-led; business pages should be denser and task-focused.
- Keep Chinese UI text readable and avoid tiny decorative labels.

## Known Gaps

- Navigation buttons are not wired to separate routes.
- No backend, database, Feishu sync, FFmpeg, AI calls, upload flow, or real persisted data.
- Home dashboard metrics are hard-coded sample values.
- Mobile polish is intentionally not part of the active 2026-05-08 review scope.
