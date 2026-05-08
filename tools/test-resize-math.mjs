import assert from "node:assert/strict";
import {
  getNextSectionHeight,
  getNextSectionWidth,
  sectionHeightBounds,
} from "../src/page-editor/resizeMath.mjs";

assert.deepEqual(sectionHeightBounds("hero"), { min: 300, max: 620, fallback: 430 });
assert.equal(getNextSectionHeight("hero", undefined, 120), 550);
assert.equal(getNextSectionHeight("hero", 610, 80), 620);
assert.equal(getNextSectionHeight("module-showcase", undefined, -220), 170);
assert.equal(getNextSectionHeight("table", 420, -300), 260);

assert.equal(getNextSectionWidth("normal", 84), "wide");
assert.equal(getNextSectionWidth("normal", -84), "narrow");
assert.equal(getNextSectionWidth("wide", 120), "wide");
assert.equal(getNextSectionWidth(undefined, 12), "normal");

console.log("Resize math tests passed");
