import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const configDir = path.join(root, "src", "config", "pages");
const allowedPages = new Set(["home", "ai-image", "viral-analysis", "ai-content", "sku"]);
const allowedLayouts = new Set(["home-workbench", "business-page"]);
const allowedSectionTypes = new Set([
  "hero",
  "module-showcase",
  "status-strip",
  "business-overview",
  "table",
  "workflow",
]);
const allowedActions = new Set(["navigate", "openModal", "openDrawer", "switchView", "runPresetAction"]);
let failures = 0;

function fail(file, message) {
  failures += 1;
  console.error(`${file}: ${message}`);
}

if (!fs.existsSync(configDir)) {
  fail("src/config/pages", "config directory is missing");
} else {
  const files = fs.readdirSync(configDir).filter((file) => file.endsWith(".json"));
  if (files.length === 0) fail("src/config/pages", "no page config files found");

  for (const fileName of files) {
    const filePath = path.join(configDir, fileName);
    let config;
    try {
      config = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (error) {
      fail(fileName, `invalid JSON: ${error.message}`);
      continue;
    }

    if (!allowedPages.has(config.pageId)) fail(fileName, `unknown pageId ${config.pageId}`);
    if (!config.title || !config.navLabel) fail(fileName, "title and navLabel are required");
    if (!config.status) fail(fileName, "status is required");
    if (!config.publishedVersion) fail(fileName, "publishedVersion is required");
    if (!config.layout || !Array.isArray(config.layout.sections)) {
      fail(fileName, "layout.sections must be an array");
      continue;
    }
    if (!allowedLayouts.has(config.layout.type)) fail(fileName, `invalid layout type ${config.layout.type}`);

    const sectionIds = new Set();
    const orders = new Set();
    for (const section of config.layout.sections) {
      if (!section.id) fail(fileName, "section.id is required");
      if (!allowedSectionTypes.has(section.type)) fail(fileName, `invalid section type ${section.type}`);
      if (sectionIds.has(section.id)) fail(fileName, `duplicate section id ${section.id}`);
      sectionIds.add(section.id);
      if (orders.has(section.order)) fail(fileName, `duplicate section order ${section.order}`);
      orders.add(section.order);
      if (typeof section.visible !== "boolean") fail(fileName, `section ${section.id} visible must be boolean`);
      if (!Number.isFinite(section.order)) fail(fileName, `section ${section.id} order must be a number`);

      for (const action of section.actions ?? []) {
        if (!allowedActions.has(action.actionType)) fail(fileName, `invalid action ${action.actionType}`);
        if (!action.id || !action.label || !action.target) {
          fail(fileName, `action in ${section.id} needs id, label, target`);
        }
      }
    }

    for (const field of config.fields ?? []) {
      if (!field.id || !field.label) fail(fileName, "field id and label are required");
      for (const key of ["visible", "tableColumn", "filterable", "required"]) {
        if (typeof field[key] !== "boolean") fail(fileName, `field ${field.id} ${key} must be boolean`);
      }
    }
  }
}

if (failures > 0) {
  console.error(`${failures} config validation failure(s)`);
  process.exit(1);
}

console.log("Page config validation passed");
