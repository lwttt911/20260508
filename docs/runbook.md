# Runbook

Operational notes for running and checking the 2026-05-08 front-end prototype.

## Requirements

- Node.js and npm available in the local environment.
- Dependencies installed with `npm install`.

## Local Development

```bash
npm install
npm run dev -- --port 5173
```

Open:

```text
http://localhost:5173/
```

The Vite config also exposes the server on the local network when started with the package script because the script uses `--host 0.0.0.0`.

## Production Build

```bash
npm run build
```

Expected successful output includes:

```text
✓ built
```

Build artifacts are written to `dist/`.

## Preview Build

```bash
npm run preview -- --port 4173
```

## Troubleshooting

### Port 5173 Is Occupied

Run the dev server on another port:

```bash
npm run dev -- --port 5174
```

### React Type Errors

Ensure React type packages are installed:

```bash
npm install -D @types/react @types/react-dom
```

### Page Looks Different From Screenshot

Reload `http://localhost:5173/` and confirm the dev server is running from this project directory. The old A / A+B variant switch has been removed.

The 2026-05-08 screenshot at `/private/tmp/duole-v2-home-1440x900.png` is not an approved final direction. Use it only as a debugging reference for what went wrong: the module area became too unified, the hero / hook stage was too compressed, and the desktop one-screen goal was at risk of being faked by cropping or overflow.

### Mobile Layout

Mobile polish is deferred by user request on 2026-05-08. Do not spend design time on mobile unless the user reopens that scope.

## Smoke Check

1. Run `npm run build`.
2. Start the dev server.
3. Open the default homepage.
4. Confirm:
   - Sidebar logo is not a black square lettermark.
   - Icons render from Lucide.
   - Chinese text is readable and not visually scrambled.
   - The desktop first viewport shows the hero, three independent workflow boards, and status strip without vertical scrolling.
   - No content is hidden by `overflow: hidden`, cropped by a fixed module height, or covered by the status strip.
   - The right workbench reads as clean Apple-white rather than gray.
