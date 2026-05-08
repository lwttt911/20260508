const HEIGHT_BOUNDS = {
  hero: { min: 300, max: 620, fallback: 430 },
  "module-showcase": { min: 170, max: 520, fallback: 260 },
  "status-strip": { min: 38, max: 140, fallback: 42 },
  "business-overview": { min: 120, max: 360, fallback: 172 },
  table: { min: 260, max: 760, fallback: 420 },
  workflow: { min: 180, max: 620, fallback: 320 },
};

const WIDTH_STEPS = ["narrow", "normal", "wide"];

export function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function sectionHeightBounds(sectionType) {
  return HEIGHT_BOUNDS[sectionType] ?? { min: 120, max: 620, fallback: 260 };
}

export function getNextSectionHeight(sectionType, currentHeight, deltaY) {
  const bounds = sectionHeightBounds(sectionType);
  const start = Number.isFinite(currentHeight) ? currentHeight : bounds.fallback;
  return Math.round(clampNumber(start + deltaY, bounds.min, bounds.max));
}

export function getNextSectionWidth(currentWidth, deltaX) {
  if (Math.abs(deltaX) < 56) return currentWidth ?? "normal";

  const currentIndex = WIDTH_STEPS.indexOf(currentWidth ?? "normal");
  const nextIndex = currentIndex + (deltaX > 0 ? 1 : -1);
  return WIDTH_STEPS[clampNumber(nextIndex, 0, WIDTH_STEPS.length - 1)];
}
