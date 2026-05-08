import type { PageSection, SectionType } from "../config/pageTypes";

export function clampNumber(value: number, min: number, max: number): number;
export function sectionHeightBounds(sectionType: SectionType): { min: number; max: number; fallback: number };
export function getNextSectionHeight(sectionType: SectionType, currentHeight: number | undefined, deltaY: number): number;
export function getNextSectionWidth(currentWidth: PageSection["width"] | undefined, deltaX: number): PageSection["width"];
