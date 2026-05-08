import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const renderer = readFileSync(join(root, "src/page-renderer/BusinessPageRenderer.tsx"), "utf8");
const styles = readFileSync(join(root, "src/styles.css"), "utf8");

const checks = [
  ["renders the simplified task page", renderer.includes("ViralAnalysisTaskPage")],
  ["renders the manual segment confirmation view", renderer.includes("SegmentConfirmationView")],
  ["has exactly one upload CTA in the viral analysis implementation", count(renderer, "上传爆款视频") === 1],
  ["does not render video thumbnails on the task queue", !renderer.includes("video-thumbnail")],
  ["has a clickable pending segment confirmation action", renderer.includes("确认分段") && renderer.includes("showSegmentConfirmation")],
  ["includes the segment lock action", renderer.includes("确认并锁定分段")],
  ["keeps the required FFmpeg automatic segmentation step", renderer.includes("FFmpeg 自动分段")],
  ["styles the simplified viral analysis task layout", styles.includes(".viral-task-page")],
  ["styles the manual confirmation workspace", styles.includes(".segment-confirmation-page")],
];

const failures = checks.filter(([, passed]) => !passed);

if (failures.length) {
  console.error("Viral analysis UI checks failed:");
  for (const [label] of failures) {
    console.error(`- ${label}`);
  }
  process.exit(1);
}

console.log("Viral analysis UI checks passed");

function count(value, needle) {
  return value.split(needle).length - 1;
}
