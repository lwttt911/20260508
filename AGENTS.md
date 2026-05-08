# Agent Guide

This project is the local front-end prototype for DuoLe TikTok Growth Studio.

## Current State

- Date of this handoff: 2026-05-08.
- Stack: React 19, Vite 6, TypeScript, plain CSS, `lucide-react`.
- Implemented surface: one default desktop home dashboard direction.
- The previous `A` / `A+B` variant switch has been removed from the UI.
- Backend, database, FFmpeg, AI provider integration, upload flow, and Feishu sync are not implemented.

## Required Product Context

Read these before changing UI or product behavior:

- `PRODUCT.md`
- `DESIGN.md`
- `docs/architecture.md`
- `docs/handoff.md`

## Design Constraints

- Use `ui-ux-pro-max` for UI/UX design-system guidance.
- Use `impeccable` for product UI shaping, critique, and polish.
- Use `lucide-react` icons. Do not introduce emoji icons or one-off hand-drawn SVG icons for app controls.
- Preserve the current non-letter brand mark direction. Do not return to a plain black square with a `D`.
- Desktop is the active design target. Mobile polish is deferred by user request on 2026-05-08.
- The user dislikes generic card-grid dashboards, messy Chinese text, low-fidelity visuals, ugly icons, and cropped screenshots that pretend to be responsive design.
- The user approved a black left navigation rail, light right-side workbench, and cyan/hot-pink TikTok creator-commerce accent system. Avoid reverting to the old light/blue dashboard palette or a deep-blue AI control-room look.
- The user specifically disliked pink UI text. Keep pink out of normal card copy, pills, secondary buttons, and labels.
- Latest explicit desktop homepage constraints from 2026-05-08:
  - The whole homepage must fit one desktop screen without vertical scrolling.
  - Do not fake the one-screen requirement by cropping content, hiding overflow, or letting the status strip cover modules.
  - Keep the hero / hook stage large enough to feel like the main poster moment.
  - The three workflow modules should be separate independent boards, not one unified panel.
  - Module content can be reduced aggressively; do not stuff detail-page lists into the homepage.
  - The right workbench should feel Apple-white / clean white, not gray.
  - The earlier separate-card module composition was closer to the desired direction than the unified panel experiment.
- The home page may be more product-led and polished. Future business pages should be denser, clearer, and shaped around each module's actual workflow.

## Development Commands

```bash
npm install
npm run dev -- --port 5173
npm run build
```

## Verification Before Claiming Completion

Run at least:

```bash
npm run build
```

For UI changes, also capture or inspect a real browser render at desktop width. Do not rely only on mental layout reasoning.

## File Ownership Notes

- `src/main.tsx` currently contains all React components and sample data.
- `src/styles.css` contains all design tokens, desktop layout, hero art, and responsive rules.
- `PRODUCT.md` and `DESIGN.md` are design context, not implementation changelogs.
- Put handoff status in `docs/handoff.md`.
