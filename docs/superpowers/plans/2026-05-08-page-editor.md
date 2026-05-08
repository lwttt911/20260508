# Page Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first version of DuoLe's hybrid page editor: in-page quick editing plus a standalone three-column editor for homepage and core business-page layout, field display, filters, table columns, and preset button actions.

**Architecture:** Keep the app frontend-only for the first implementation. Use checked-in JSON page configs as defaults, render pages from typed config, and persist draft/published versions in `localStorage` so the editor does not mutate source files at runtime. Add an editor route that edits config objects and publishes them to the current browser session; the checked-in JSON remains the recovery baseline.

**Tech Stack:** React 19, TypeScript, Vite 6, plain CSS, `lucide-react`, built-in browser `localStorage`, no new runtime dependencies.

---

## Important Project Notes

- Project root: `C:\Users\Administrator\Desktop\MAC\TKDUOLE`
- Current app has only `src/main.tsx` and `src/styles.css`.
- The project is not a git repository. Use filesystem checkpoints instead of git commits.
- Current source contains Chinese text that may appear garbled in some PowerShell output. Preserve the text as rendered in browser unless actively replacing it with known-correct Chinese copy.
- Do not delete existing image assets or screenshots.

## File Structure

Create or modify these files:

- Create `src/config/pageTypes.ts`: shared page-config types and allowed action types.
- Create `src/config/pages/home.json`: default homepage config.
- Create `src/config/pages/ai-image.json`: default AI image page config.
- Create `src/config/pages/viral-analysis.json`: default viral-analysis page config.
- Create `src/config/pages/sku.json`: default SKU operations page config.
- Create `src/config/defaultPages.ts`: imports JSON configs and exposes default config lookup.
- Create `src/config/pageActions.ts`: maps allowed action types to UI behavior.
- Create `src/editor/pageConfigStore.ts`: localStorage-backed draft, publish, version, rollback functions.
- Create `src/editor/EditorPage.tsx`: standalone three-column editor route.
- Create `src/editor/EditorSidebar.tsx`: page list, structure tree, component list.
- Create `src/editor/EditorCanvas.tsx`: live draft canvas.
- Create `src/editor/InspectorPanel.tsx`: content, layout, fields, actions, versions panels.
- Create `src/page-editor/EditModeContext.tsx`: in-page edit-mode state.
- Create `src/page-editor/EditableFrame.tsx`: wrapper around editable sections.
- Create `src/page-renderer/PageRenderer.tsx`: config-driven page renderer.
- Create `src/page-renderer/HomePageRenderer.tsx`: config-driven homepage renderer.
- Create `src/page-renderer/BusinessPageRenderer.tsx`: config-driven business page renderer.
- Create `src/components/AppShell.tsx`: sidebar/topbar shell and route state.
- Modify `src/main.tsx`: slim entry point that renders `AppShell`.
- Modify `src/styles.css`: add editor, editable-frame, and business-page styles without disturbing existing homepage visual tokens.
- Modify `package.json`: add `validate:config` script.
- Create `tools/validate-page-config.mjs`: validates default JSON configs and catches broken config before build.

## Checkpoint Command

Run this at the end of each task instead of git commit:

```powershell
$project='C:\Users\Administrator\Desktop\MAC\TKDUOLE'
$backupRoot='C:\Users\Administrator\Desktop\MAC\TKDUOLE_BACKUPS'
$timestamp=Get-Date -Format 'yyyyMMdd-HHmmss'
$dest=Join-Path $backupRoot "task-checkpoint-$timestamp"
$excludeDirs=@('node_modules','.npm-cache','dist')
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Get-ChildItem -LiteralPath $project -Force | Where-Object { $excludeDirs -notcontains $_.Name } | ForEach-Object {
  $target=Join-Path $dest $_.Name
  if ($_.PSIsContainer) { Copy-Item -LiteralPath $_.FullName -Destination $target -Recurse -Force }
  else { Copy-Item -LiteralPath $_.FullName -Destination $target -Force }
}
Write-Output "checkpoint=$dest"
```

Expected: prints `checkpoint=C:\Users\Administrator\Desktop\MAC\TKDUOLE_BACKUPS\task-checkpoint-...`.

---

### Task 1: Add Typed Page Config Model and Default JSON Files

**Files:**
- Create: `src/config/pageTypes.ts`
- Create: `src/config/pages/home.json`
- Create: `src/config/pages/ai-image.json`
- Create: `src/config/pages/viral-analysis.json`
- Create: `src/config/pages/sku.json`
- Create: `src/config/defaultPages.ts`
- Create: `tools/validate-page-config.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create the config types**

Create `src/config/pageTypes.ts`:

```ts
export type PageId = "home" | "ai-image" | "viral-analysis" | "sku";

export type PageStatus = "draft" | "published";

export type SectionType = "hero" | "module-showcase" | "status-strip" | "business-overview" | "table" | "workflow";

export type ActionType = "navigate" | "openModal" | "openDrawer" | "switchView" | "runPresetAction";

export type PageAction = {
  id: string;
  label: string;
  actionType: ActionType;
  target: string;
};

export type FieldConfig = {
  id: string;
  label: string;
  visible: boolean;
  tableColumn: boolean;
  filterable: boolean;
  required: boolean;
};

export type PageSection = {
  id: string;
  type: SectionType;
  title?: string;
  subtitle?: string;
  visible: boolean;
  order: number;
  width?: "wide" | "normal" | "narrow";
  style?: {
    height?: number;
    backgroundImage?: string;
    accent?: "cyan" | "pink" | "green" | "neutral";
  };
  content?: Record<string, string | number | boolean>;
  actions?: PageAction[];
  fields?: FieldConfig[];
};

export type PageConfig = {
  pageId: PageId;
  title: string;
  navLabel: string;
  status: PageStatus;
  publishedVersion: string;
  layout: {
    type: "home-workbench" | "business-page";
    sections: PageSection[];
  };
  fields?: FieldConfig[];
};

export type PageVersion = {
  versionId: string;
  pageId: PageId;
  label: string;
  createdAt: string;
  config: PageConfig;
};
```

- [ ] **Step 2: Add default homepage JSON**

Create `src/config/pages/home.json`:

```json
{
  "pageId": "home",
  "title": "首页",
  "navLabel": "首页",
  "status": "published",
  "publishedVersion": "baseline-home",
  "layout": {
    "type": "home-workbench",
    "sections": [
      {
        "id": "hero",
        "type": "hero",
        "visible": true,
        "order": 1,
        "style": {
          "height": 430,
          "backgroundImage": "/hero-new.webp",
          "accent": "cyan"
        },
        "content": {
          "eyebrow": "TikTok Growth Studio",
          "headline": "把爆款流量变成销量资产",
          "body": "从内容灵感、购物信号到 SKU 任务，沉淀成下一批短视频的可复用打法。"
        },
        "actions": [
          {
            "id": "import-video",
            "label": "导入爆款视频",
            "actionType": "navigate",
            "target": "viral-analysis"
          },
          {
            "id": "view-top",
            "label": "查看 TOP 组合",
            "actionType": "switchView",
            "target": "top-combinations"
          }
        ]
      },
      {
        "id": "content-production",
        "type": "module-showcase",
        "title": "AI 内容生产",
        "subtitle": "SKU 匹配因子后生成脚本、分镜和 Prompt",
        "visible": true,
        "order": 2,
        "width": "wide",
        "style": { "accent": "pink" },
        "content": {
          "badge": "7 条待制作",
          "metricLabel": "脚本生成中...",
          "metricValue": "66%",
          "buttonLabel": "继续制作"
        },
        "actions": [
          {
            "id": "continue-production",
            "label": "继续制作",
            "actionType": "navigate",
            "target": "ai-image"
          }
        ]
      },
      {
        "id": "viral-analysis",
        "type": "module-showcase",
        "title": "爆款分析",
        "subtitle": "发现潜力商品和可复用执行因子",
        "visible": true,
        "order": 3,
        "width": "normal",
        "style": { "accent": "green" },
        "content": {
          "badge": "2 个在处理中",
          "score": 92,
          "trend": "较昨日 +12%",
          "buttonLabel": "查看分析"
        },
        "actions": [
          {
            "id": "open-analysis",
            "label": "查看分析",
            "actionType": "navigate",
            "target": "viral-analysis"
          }
        ]
      },
      {
        "id": "sku-operations",
        "type": "module-showcase",
        "title": "SKU 运营",
        "subtitle": "SKU 策略与库存分配",
        "visible": true,
        "order": 4,
        "width": "normal",
        "style": { "accent": "neutral" },
        "content": {
          "badge": "35 SKU 生效",
          "total": 35,
          "hot": 12,
          "potential": 15,
          "new": 8,
          "buttonLabel": "进入管理"
        },
        "actions": [
          {
            "id": "open-sku",
            "label": "进入管理",
            "actionType": "navigate",
            "target": "sku"
          }
        ]
      },
      {
        "id": "status-strip",
        "type": "status-strip",
        "visible": true,
        "order": 5,
        "content": {
          "database": "Local DB 为准",
          "syncQueue": "飞书同步队列 5",
          "feedback": "待回流视频 6",
          "tags": "A1-A5 标签待计算 4"
        }
      }
    ]
  }
}
```

- [ ] **Step 3: Add default business page JSON files**

Create `src/config/pages/ai-image.json`:

```json
{
  "pageId": "ai-image",
  "title": "AI 生图",
  "navLabel": "AI 生图",
  "status": "published",
  "publishedVersion": "baseline-ai-image",
  "layout": {
    "type": "business-page",
    "sections": [
      {
        "id": "overview",
        "type": "business-overview",
        "title": "AI 生图工作台",
        "subtitle": "管理 SKU 图片资产、生成风格和待审核结果",
        "visible": true,
        "order": 1,
        "content": {
          "primaryMetric": "24",
          "primaryLabel": "待生成任务",
          "secondaryMetric": "8",
          "secondaryLabel": "待审核图片"
        },
        "actions": [
          { "id": "new-image-task", "label": "新建生图任务", "actionType": "openDrawer", "target": "image-task-drawer" }
        ]
      },
      {
        "id": "asset-table",
        "type": "table",
        "title": "图片资产列表",
        "visible": true,
        "order": 2
      }
    ]
  },
  "fields": [
    { "id": "skuName", "label": "SKU 名称", "visible": true, "tableColumn": true, "filterable": true, "required": true },
    { "id": "style", "label": "风格", "visible": true, "tableColumn": true, "filterable": true, "required": false },
    { "id": "status", "label": "状态", "visible": true, "tableColumn": true, "filterable": true, "required": false }
  ]
}
```

Create `src/config/pages/viral-analysis.json`:

```json
{
  "pageId": "viral-analysis",
  "title": "爆款分析",
  "navLabel": "爆款分析",
  "status": "published",
  "publishedVersion": "baseline-viral-analysis",
  "layout": {
    "type": "business-page",
    "sections": [
      {
        "id": "overview",
        "type": "business-overview",
        "title": "爆款分析队列",
        "subtitle": "从视频证据提炼结构判断和可复用因子",
        "visible": true,
        "order": 1,
        "content": {
          "primaryMetric": "6",
          "primaryLabel": "待分析视频",
          "secondaryMetric": "2",
          "secondaryLabel": "处理中"
        },
        "actions": [
          { "id": "import-video", "label": "导入视频", "actionType": "openModal", "target": "import-video-modal" }
        ]
      },
      {
        "id": "analysis-table",
        "type": "table",
        "title": "分析记录",
        "visible": true,
        "order": 2
      }
    ]
  },
  "fields": [
    { "id": "videoTitle", "label": "视频标题", "visible": true, "tableColumn": true, "filterable": true, "required": true },
    { "id": "category", "label": "品类", "visible": true, "tableColumn": true, "filterable": true, "required": false },
    { "id": "analysisStatus", "label": "分析状态", "visible": true, "tableColumn": true, "filterable": true, "required": false }
  ]
}
```

Create `src/config/pages/sku.json`:

```json
{
  "pageId": "sku",
  "title": "SKU 运营",
  "navLabel": "SKU 运营",
  "status": "published",
  "publishedVersion": "baseline-sku",
  "layout": {
    "type": "business-page",
    "sections": [
      {
        "id": "overview",
        "type": "business-overview",
        "title": "SKU 运营中心",
        "subtitle": "管理 SKU 档案、策略标签和内容生产入口",
        "visible": true,
        "order": 1,
        "content": {
          "primaryMetric": "35",
          "primaryLabel": "SKU 生效",
          "secondaryMetric": "15",
          "secondaryLabel": "潜力 SKU"
        },
        "actions": [
          { "id": "new-sku", "label": "新增 SKU", "actionType": "openDrawer", "target": "sku-drawer" }
        ]
      },
      {
        "id": "sku-table",
        "type": "table",
        "title": "SKU 列表",
        "visible": true,
        "order": 2
      }
    ]
  },
  "fields": [
    { "id": "skuName", "label": "SKU 名称", "visible": true, "tableColumn": true, "filterable": true, "required": true },
    { "id": "tier", "label": "策略分层", "visible": true, "tableColumn": true, "filterable": true, "required": false },
    { "id": "stockStatus", "label": "库存状态", "visible": true, "tableColumn": true, "filterable": true, "required": false }
  ]
}
```

- [ ] **Step 4: Import defaults with a typed lookup**

Create `src/config/defaultPages.ts`:

```ts
import homeConfig from "./pages/home.json";
import aiImageConfig from "./pages/ai-image.json";
import viralAnalysisConfig from "./pages/viral-analysis.json";
import skuConfig from "./pages/sku.json";
import type { PageConfig, PageId } from "./pageTypes";

export const defaultPageConfigs: Record<PageId, PageConfig> = {
  home: homeConfig as PageConfig,
  "ai-image": aiImageConfig as PageConfig,
  "viral-analysis": viralAnalysisConfig as PageConfig,
  sku: skuConfig as PageConfig,
};

export const pageOrder: PageId[] = ["home", "ai-image", "viral-analysis", "sku"];

export function getDefaultPageConfig(pageId: PageId): PageConfig {
  return structuredClone(defaultPageConfigs[pageId]);
}
```

- [ ] **Step 5: Add config validator script and npm command**

Create `tools/validate-page-config.mjs`:

```js
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const configDir = path.join(root, "src", "config", "pages");
const allowedPages = new Set(["home", "ai-image", "viral-analysis", "sku"]);
const allowedActions = new Set(["navigate", "openModal", "openDrawer", "switchView", "runPresetAction"]);
let failures = 0;

function fail(file, message) {
  failures += 1;
  console.error(`${file}: ${message}`);
}

for (const fileName of fs.readdirSync(configDir).filter((file) => file.endsWith(".json"))) {
  const filePath = path.join(configDir, fileName);
  const config = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!allowedPages.has(config.pageId)) fail(fileName, `unknown pageId ${config.pageId}`);
  if (!config.title || !config.navLabel) fail(fileName, "title and navLabel are required");
  if (!config.layout || !Array.isArray(config.layout.sections)) fail(fileName, "layout.sections must be an array");
  const sectionIds = new Set();
  for (const section of config.layout.sections ?? []) {
    if (!section.id) fail(fileName, "section.id is required");
    if (sectionIds.has(section.id)) fail(fileName, `duplicate section id ${section.id}`);
    sectionIds.add(section.id);
    if (typeof section.visible !== "boolean") fail(fileName, `section ${section.id} visible must be boolean`);
    for (const action of section.actions ?? []) {
      if (!allowedActions.has(action.actionType)) fail(fileName, `invalid action ${action.actionType}`);
      if (!action.id || !action.label || !action.target) fail(fileName, `action in ${section.id} needs id, label, target`);
    }
  }
  for (const field of config.fields ?? []) {
    if (!field.id || !field.label) fail(fileName, "field id and label are required");
    for (const key of ["visible", "tableColumn", "filterable", "required"]) {
      if (typeof field[key] !== "boolean") fail(fileName, `field ${field.id} ${key} must be boolean`);
    }
  }
}

if (failures > 0) {
  console.error(`${failures} config validation failure(s)`);
  process.exit(1);
}

console.log("Page config validation passed");
```

Modify `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "validate:config": "node tools/validate-page-config.mjs"
  }
}
```

- [ ] **Step 6: Run validation**

Run:

```powershell
npm.cmd run validate:config
```

Expected:

```text
Page config validation passed
```

- [ ] **Step 7: Run build**

Run:

```powershell
npm.cmd run build
```

Expected: exit code `0`, Vite build completes.

- [ ] **Step 8: Create checkpoint**

Run the checkpoint command from the top of this plan.

---

### Task 2: Add LocalStorage Draft, Publish, Version, and Rollback Store

**Files:**
- Create: `src/editor/pageConfigStore.ts`
- Create: `src/config/pageActions.ts`
- Modify: `tools/validate-page-config.mjs`

- [ ] **Step 1: Create action handler registry**

Create `src/config/pageActions.ts`:

```ts
import type { PageAction, PageId } from "./pageTypes";

export type PageActionContext = {
  navigate: (pageId: PageId) => void;
  notify: (message: string) => void;
};

export function runPageAction(action: PageAction, context: PageActionContext) {
  if (action.actionType === "navigate") {
    context.navigate(action.target as PageId);
    return;
  }

  if (action.actionType === "switchView") {
    context.notify(`已切换视图：${action.target}`);
    return;
  }

  if (action.actionType === "openModal") {
    context.notify(`打开弹窗：${action.target}`);
    return;
  }

  if (action.actionType === "openDrawer") {
    context.notify(`打开抽屉：${action.target}`);
    return;
  }

  context.notify(`执行预设动作：${action.target}`);
}
```

- [ ] **Step 2: Create store keys and clone helpers**

Create `src/editor/pageConfigStore.ts`:

```ts
import { getDefaultPageConfig } from "../config/defaultPages";
import type { PageConfig, PageId, PageVersion } from "../config/pageTypes";

const DRAFT_KEY = "duole.pageEditor.drafts.v1";
const PUBLISHED_KEY = "duole.pageEditor.published.v1";
const VERSION_KEY = "duole.pageEditor.versions.v1";

type PageMap = Partial<Record<PageId, PageConfig>>;
type VersionMap = Partial<Record<PageId, PageVersion[]>>;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function cloneConfig(config: PageConfig): PageConfig {
  return structuredClone(config);
}

function normalizeConfig(config: PageConfig, status: "draft" | "published"): PageConfig {
  return {
    ...cloneConfig(config),
    status,
    layout: {
      ...config.layout,
      sections: [...config.layout.sections].sort((a, b) => a.order - b.order),
    },
  };
}
```

- [ ] **Step 3: Add read/write functions**

Append to `src/editor/pageConfigStore.ts`:

```ts
export function getPublishedPageConfig(pageId: PageId): PageConfig {
  const published = readJson<PageMap>(PUBLISHED_KEY, {});
  return normalizeConfig(published[pageId] ?? getDefaultPageConfig(pageId), "published");
}

export function getDraftPageConfig(pageId: PageId): PageConfig {
  const drafts = readJson<PageMap>(DRAFT_KEY, {});
  return normalizeConfig(drafts[pageId] ?? getPublishedPageConfig(pageId), "draft");
}

export function saveDraftPageConfig(config: PageConfig): PageVersion {
  const drafts = readJson<PageMap>(DRAFT_KEY, {});
  const versions = readJson<VersionMap>(VERSION_KEY, {});
  const draft = normalizeConfig(config, "draft");
  const version: PageVersion = {
    versionId: `${draft.pageId}-${Date.now()}`,
    pageId: draft.pageId,
    label: `草稿 ${new Date().toLocaleString("zh-CN")}`,
    createdAt: new Date().toISOString(),
    config: draft,
  };
  drafts[draft.pageId] = draft;
  versions[draft.pageId] = [version, ...(versions[draft.pageId] ?? [])].slice(0, 20);
  writeJson(DRAFT_KEY, drafts);
  writeJson(VERSION_KEY, versions);
  return version;
}

export function publishPageConfig(pageId: PageId): PageConfig {
  const drafts = readJson<PageMap>(DRAFT_KEY, {});
  const published = readJson<PageMap>(PUBLISHED_KEY, {});
  const draft = drafts[pageId] ?? getPublishedPageConfig(pageId);
  const next = normalizeConfig(
    {
      ...draft,
      publishedVersion: `${pageId}-${Date.now()}`,
    },
    "published",
  );
  published[pageId] = next;
  writeJson(PUBLISHED_KEY, published);
  return next;
}

export function getPageVersions(pageId: PageId): PageVersion[] {
  return readJson<VersionMap>(VERSION_KEY, {})[pageId] ?? [];
}

export function restorePageVersion(version: PageVersion): PageConfig {
  const restored = normalizeConfig(version.config, "draft");
  saveDraftPageConfig(restored);
  return restored;
}

export function resetPageConfig(pageId: PageId): PageConfig {
  const drafts = readJson<PageMap>(DRAFT_KEY, {});
  const published = readJson<PageMap>(PUBLISHED_KEY, {});
  delete drafts[pageId];
  delete published[pageId];
  writeJson(DRAFT_KEY, drafts);
  writeJson(PUBLISHED_KEY, published);
  return getDefaultPageConfig(pageId);
}
```

- [ ] **Step 4: Add validator sanity checks for page order**

Append this check inside the JSON loop in `tools/validate-page-config.mjs`, after the section loop:

```js
const orders = new Set();
for (const section of config.layout.sections ?? []) {
  if (orders.has(section.order)) fail(fileName, `duplicate section order ${section.order}`);
  orders.add(section.order);
}
```

- [ ] **Step 5: Run validation and build**

Run:

```powershell
npm.cmd run validate:config
npm.cmd run build
```

Expected:

```text
Page config validation passed
```

Build exits `0`.

- [ ] **Step 6: Create checkpoint**

Run the checkpoint command.

---

### Task 3: Split App Shell and Add Config-Driven Routing

**Files:**
- Create: `src/components/AppShell.tsx`
- Create: `src/page-renderer/PageRenderer.tsx`
- Create: `src/page-renderer/HomePageRenderer.tsx`
- Create: `src/page-renderer/BusinessPageRenderer.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Move shell types and navigation into `AppShell`**

Create `src/components/AppShell.tsx` with the shell from current `main.tsx`, but make `activePageId` state-driven:

```tsx
import { useMemo, useState } from "react";
import {
  Bell,
  Boxes,
  ChevronDown,
  Database,
  Home,
  Image,
  LineChart,
  Play,
  RefreshCcw,
  Search,
  WandSparkles,
} from "lucide-react";
import type { PageId } from "../config/pageTypes";
import { pageOrder } from "../config/defaultPages";
import { getPublishedPageConfig } from "../editor/pageConfigStore";
import { PageRenderer } from "../page-renderer/PageRenderer";
import { EditorPage } from "../editor/EditorPage";

type NavItem = {
  pageId?: PageId;
  label: string;
  icon: typeof Home;
};

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "生产工具",
    items: [
      { pageId: "home", label: "首页", icon: Home },
      { pageId: "ai-image", label: "AI 生图", icon: Image },
      { pageId: "viral-analysis", label: "爆款分析", icon: Play },
      { label: "AI 内容生产", icon: WandSparkles },
      { label: "爆款裂变", icon: RefreshCcw },
    ],
  },
  {
    label: "资产管理",
    items: [
      { pageId: "sku", label: "SKU 运营", icon: Boxes },
      { label: "运营数据", icon: LineChart },
      { label: "因子库", icon: Database },
    ],
  },
];

export function AppShell() {
  const initialPath = window.location.pathname === "/editor" ? "editor" : "app";
  const [mode, setMode] = useState<"app" | "editor">(initialPath);
  const [activePageId, setActivePageId] = useState<PageId>("home");
  const [notice, setNotice] = useState("");
  const pageConfig = useMemo(() => getPublishedPageConfig(activePageId), [activePageId, notice]);

  function navigate(pageId: PageId) {
    setActivePageId(pageId);
    setMode("app");
    window.history.pushState({}, "", "/");
  }

  function openEditor(pageId = activePageId) {
    setActivePageId(pageId);
    setMode("editor");
    window.history.pushState({}, "", "/editor");
  }

  if (mode === "editor") {
    return <EditorPage initialPageId={activePageId} onBack={() => navigate(activePageId)} />;
  }

  return (
    <div className="app-shell">
      <Sidebar activePageId={activePageId} onNavigate={navigate} />
      <main className="main" id="main-content">
        <Topbar title={pageConfig.title} onOpenEditor={() => openEditor(activePageId)} />
        <PageRenderer config={pageConfig} navigate={navigate} notify={setNotice} />
        {notice ? <div className="toast-status">{notice}</div> : null}
      </main>
    </div>
  );
}

function Sidebar({ activePageId, onNavigate }: { activePageId: PageId; onNavigate: (pageId: PageId) => void }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <span className="brand-mark__rail" />
          <span className="brand-mark__node brand-mark__node--one" />
          <span className="brand-mark__node brand-mark__node--two" />
          <span className="brand-mark__node brand-mark__node--three" />
        </div>
        <div>
          <strong>DuoLe</strong>
          <span>TikTok Growth Studio</span>
        </div>
      </div>
      <nav className="nav" aria-label="主导航">
        {navGroups.map((group) => (
          <section className="nav-group" key={group.label}>
            <div className="nav-label">{group.label}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = item.pageId === activePageId;
              return (
                <button
                  className={`nav-item ${active ? "is-active" : ""}`}
                  key={item.label}
                  onClick={() => item.pageId && onNavigate(item.pageId)}
                  disabled={!item.pageId}
                >
                  <Icon aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </section>
        ))}
      </nav>
      <div className="team-card">
        <div className="avatar">DT</div>
        <div>
          <strong>DuoLe Team</strong>
          <span>专业版</span>
        </div>
        <ChevronDown aria-hidden="true" />
      </div>
    </aside>
  );
}

function Topbar({ title, onOpenEditor }: { title: string; onOpenEditor: () => void }) {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        <Home aria-hidden="true" />
        <span>{title} / 工作台</span>
      </div>
      <div className="top-actions">
        <button className="team-button edit-page-button" onClick={onOpenEditor}>编辑页面</button>
        <button className="icon-button" aria-label="搜索"><Search aria-hidden="true" /></button>
        <button className="icon-button has-dot" aria-label="通知"><Bell aria-hidden="true" /></button>
        <button className="team-button"><span className="avatar avatar--sm">DT</span>DuoLe Team<ChevronDown aria-hidden="true" /></button>
      </div>
    </header>
  );
}

export { pageOrder };
```

- [ ] **Step 2: Add slim entry point**

Replace `src/main.tsx` with:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppShell } from "./components/AppShell";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppShell />
  </StrictMode>,
);
```

- [ ] **Step 3: Add renderer dispatcher**

Create `src/page-renderer/PageRenderer.tsx`:

```tsx
import type { PageConfig, PageId } from "../config/pageTypes";
import { HomePageRenderer } from "./HomePageRenderer";
import { BusinessPageRenderer } from "./BusinessPageRenderer";

export function PageRenderer({
  config,
  navigate,
  notify,
}: {
  config: PageConfig;
  navigate: (pageId: PageId) => void;
  notify: (message: string) => void;
}) {
  if (config.layout.type === "home-workbench") {
    return <HomePageRenderer config={config} navigate={navigate} notify={notify} />;
  }

  return <BusinessPageRenderer config={config} navigate={navigate} notify={notify} />;
}
```

- [ ] **Step 4: Add homepage renderer**

Create `src/page-renderer/HomePageRenderer.tsx` by moving the current `Hero`, `ModuleShowcase`, and `StatusStrip` markup from `main.tsx` and reading labels from config. Start with this implementation:

```tsx
import type { CSSProperties } from "react";
import { BadgeCheck, Boxes, Clapperboard, FileText, LineChart, Rocket, Sparkles } from "lucide-react";
import { runPageAction } from "../config/pageActions";
import type { PageAction, PageConfig, PageId, PageSection } from "../config/pageTypes";

const scriptSegments = [
  { id: "01", duration: "3.2s" },
  { id: "02", duration: "2.8s" },
  { id: "03", duration: "3.6s" },
  { id: "04", duration: "2.4s" },
];

const categorySignals = ["瓶", "耳机", "椅", "灯"];

export function HomePageRenderer({
  config,
  navigate,
  notify,
}: {
  config: PageConfig;
  navigate: (pageId: PageId) => void;
  notify: (message: string) => void;
}) {
  const sections = config.layout.sections.filter((section) => section.visible).sort((a, b) => a.order - b.order);
  const hero = sections.find((section) => section.type === "hero");
  const modules = sections.filter((section) => section.type === "module-showcase");
  const status = sections.find((section) => section.type === "status-strip");

  return (
    <section className="home-workbench" aria-label="DuoLe 首页工作台">
      {hero ? <Hero section={hero} navigate={navigate} notify={notify} /> : null}
      <section className="module-showcase">
        {modules.map((section) => <ModuleCard key={section.id} section={section} navigate={navigate} notify={notify} />)}
      </section>
      {status ? <StatusStrip section={status} /> : null}
    </section>
  );
}

function firstAction(section: PageSection): PageAction | undefined {
  return section.actions?.[0];
}

function Hero({ section, navigate, notify }: { section: PageSection; navigate: (pageId: PageId) => void; notify: (message: string) => void }) {
  const action = firstAction(section);
  return (
    <section className="hero" style={{ "--hero-height": `${section.style?.height ?? 430}px` } as CSSProperties}>
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles aria-hidden="true" />{String(section.content?.eyebrow ?? "")}</div>
        <h1>{String(section.content?.headline ?? "")}</h1>
        <p>{String(section.content?.body ?? "")}</p>
        <div className="hero-actions">
          {section.actions?.map((item, index) => (
            <button
              className={index === 0 ? "primary-button" : "secondary-button"}
              key={item.id}
              onClick={() => runPageAction(item, { navigate, notify })}
            >
              {item.label}
              {index === 0 ? <Rocket aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModuleCard({ section, navigate, notify }: { section: PageSection; navigate: (pageId: PageId) => void; notify: (message: string) => void }) {
  const accent = section.style?.accent ?? "neutral";
  const Icon = section.id === "viral-analysis" ? LineChart : section.id === "sku-operations" ? Boxes : Clapperboard;
  return (
    <article className={`module-card module-card--${section.id === "content-production" ? "content" : section.id === "viral-analysis" ? "analysis" : "sku"}`}>
      <div className="module-head">
        <span className={`module-icon module-icon--${accent === "green" ? "green" : accent === "pink" ? "rose" : "violet"}`}><Icon aria-hidden="true" /></span>
        <div>
          <h2>{section.title}</h2>
          <p>{section.subtitle}</p>
        </div>
        <span className={`module-badge ${accent === "green" ? "module-badge--green" : accent === "neutral" ? "module-badge--neutral" : ""}`}>{String(section.content?.badge ?? "")}</span>
      </div>
      {section.id === "content-production" ? <ProductionBody section={section} /> : null}
      {section.id === "viral-analysis" ? <AnalysisBody section={section} /> : null}
      {section.id === "sku-operations" ? <SkuBody section={section} /> : null}
      {firstAction(section) ? (
        <button className="module-cta" onClick={() => runPageAction(firstAction(section)!, { navigate, notify })}>
          {String(section.content?.buttonLabel ?? firstAction(section)!.label)}
        </button>
      ) : null}
    </article>
  );
}

function ProductionBody({ section }: { section: PageSection }) {
  return (
    <>
      <div className="production-progress">
        <div className="module-metric-row"><strong>{String(section.content?.metricLabel ?? "")}</strong><span>{String(section.content?.metricValue ?? "")}</span></div>
        <div className="progress-track"><span /></div>
      </div>
      <div className="segment-grid">
        {scriptSegments.map((segment) => <div className="segment-tile" key={segment.id}><span>{segment.id}</span><strong>{segment.duration}</strong></div>)}
        <button className="segment-add" aria-label="新增分镜片段">+</button>
      </div>
    </>
  );
}

function AnalysisBody({ section }: { section: PageSection }) {
  return (
    <>
      <div className="signal-tabs">{categorySignals.map((item) => <button key={item}>{item}</button>)}</div>
      <div className="trend-panel"><div><span>趋势评分</span><strong>{String(section.content?.trend ?? "")}</strong></div><div className="trend-score">{String(section.content?.score ?? "")}</div></div>
      <div className="mini-bars">{[34, 48, 39, 57, 50].map((height, index) => <span style={{ "--bar-height": `${height}px` } as CSSProperties} key={index} />)}</div>
    </>
  );
}

function SkuBody({ section }: { section: PageSection }) {
  return (
    <div className="sku-chart-row">
      <div className="donut-chart"><div><strong>{String(section.content?.total ?? "")}</strong><span>SKU 生效</span></div></div>
      <div className="sku-legend">
        {[
          ["热销", section.content?.hot],
          ["潜力", section.content?.potential],
          ["新品", section.content?.new],
        ].map(([label, value], index) => <div key={label}><span className={`legend-dot legend-dot--${index + 1}`} /><strong>{label}</strong><em>{String(value ?? "")}</em></div>)}
      </div>
    </div>
  );
}

function StatusStrip({ section }: { section: PageSection }) {
  return (
    <footer className="status-strip">
      <div className="live-indicator"><BadgeCheck aria-hidden="true" />{String(section.content?.database ?? "")}</div>
      <span>{String(section.content?.syncQueue ?? "")}</span>
      <span>{String(section.content?.feedback ?? "")}</span>
      <span>{String(section.content?.tags ?? "")}</span>
      <button><FileText aria-hidden="true" />打开任务</button>
    </footer>
  );
}
```

- [ ] **Step 5: Add business page renderer**

Create `src/page-renderer/BusinessPageRenderer.tsx`:

```tsx
import { runPageAction } from "../config/pageActions";
import type { FieldConfig, PageConfig, PageId, PageSection } from "../config/pageTypes";

export function BusinessPageRenderer({
  config,
  navigate,
  notify,
}: {
  config: PageConfig;
  navigate: (pageId: PageId) => void;
  notify: (message: string) => void;
}) {
  const fields = config.fields ?? [];
  const sections = config.layout.sections.filter((section) => section.visible).sort((a, b) => a.order - b.order);
  return (
    <section className="business-page">
      {sections.map((section) => {
        if (section.type === "business-overview") {
          return <BusinessOverview key={section.id} section={section} navigate={navigate} notify={notify} />;
        }
        if (section.type === "table") {
          return <ConfigTable key={section.id} title={section.title ?? "列表"} fields={fields} />;
        }
        return null;
      })}
    </section>
  );
}

function BusinessOverview({
  section,
  navigate,
  notify,
}: {
  section: PageSection;
  navigate: (pageId: PageId) => void;
  notify: (message: string) => void;
}) {
  return (
    <article className="business-overview">
      <div>
        <h1>{section.title}</h1>
        <p>{section.subtitle}</p>
      </div>
      <div className="business-metrics">
        <div><strong>{String(section.content?.primaryMetric ?? "")}</strong><span>{String(section.content?.primaryLabel ?? "")}</span></div>
        <div><strong>{String(section.content?.secondaryMetric ?? "")}</strong><span>{String(section.content?.secondaryLabel ?? "")}</span></div>
      </div>
      <div className="business-actions">
        {section.actions?.map((action) => (
          <button className="primary-button" key={action.id} onClick={() => runPageAction(action, { navigate, notify })}>{action.label}</button>
        ))}
      </div>
    </article>
  );
}

function ConfigTable({ title, fields }: { title: string; fields: FieldConfig[] }) {
  const columns = fields.filter((field) => field.visible && field.tableColumn);
  const filters = fields.filter((field) => field.visible && field.filterable);
  return (
    <article className="business-table-panel">
      <div className="business-filter-row">
        {filters.map((field) => <button key={field.id}>{field.label}</button>)}
      </div>
      <h2>{title}</h2>
      <table>
        <thead><tr>{columns.map((field) => <th key={field.id}>{field.label}</th>)}</tr></thead>
        <tbody>
          {[1, 2, 3].map((row) => (
            <tr key={row}>{columns.map((field) => <td key={field.id}>{field.label} {row}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
```

- [ ] **Step 6: Add minimal route styles**

Append to `src/styles.css`:

```css
.edit-page-button {
  border-color: color-mix(in oklch, var(--cyan), white 56%);
  background: color-mix(in oklch, var(--cyan), white 90%);
}

.toast-status {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 30;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface-raised);
  padding: 10px 14px;
  color: var(--text);
  box-shadow: var(--shadow-soft);
  font-size: 13px;
  font-weight: 760;
}

.business-page {
  min-height: calc(100dvh - 100px);
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 16px;
}

.business-overview,
.business-table-panel {
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface-raised);
  box-shadow: var(--shadow-soft);
}

.business-overview {
  padding: 22px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 18px;
}

.business-overview h1,
.business-table-panel h2 {
  margin: 0;
  color: var(--text);
}

.business-overview p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 13px;
  font-weight: 680;
}

.business-metrics {
  display: flex;
  gap: 10px;
}

.business-metrics div {
  min-width: 96px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface-soft);
  padding: 10px;
}

.business-metrics strong {
  display: block;
  font-size: 24px;
  line-height: 1;
}

.business-metrics span {
  display: block;
  margin-top: 4px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 760;
}

.business-table-panel {
  padding: 16px;
}

.business-filter-row {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.business-filter-row button {
  min-height: 34px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface-soft);
  padding: 0 12px;
  color: var(--text);
  font-size: 12px;
  font-weight: 760;
}

.business-table-panel table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 13px;
}

.business-table-panel th,
.business-table-panel td {
  border-bottom: 1px solid var(--line);
  padding: 12px 8px;
  text-align: left;
}
```

- [ ] **Step 7: Run validation and build**

Run:

```powershell
npm.cmd run validate:config
npm.cmd run build
```

Expected: validation passed and build exits `0`.

- [ ] **Step 8: Manual browser check**

Run dev server if not already running:

```powershell
npm.cmd run dev -- --port 57260
```

Open `http://localhost:57260/` and check:

- Homepage still renders.
- Sidebar buttons for 首页, AI 生图, 爆款分析, SKU 运营 switch pages.
- “编辑页面” button appears in topbar.

- [ ] **Step 9: Create checkpoint**

Run the checkpoint command.

---

### Task 4: Build In-Page Quick Edit Mode

**Files:**
- Create: `src/page-editor/EditModeContext.tsx`
- Create: `src/page-editor/EditableFrame.tsx`
- Modify: `src/components/AppShell.tsx`
- Modify: `src/page-renderer/HomePageRenderer.tsx`
- Modify: `src/page-renderer/BusinessPageRenderer.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add edit-mode context**

Create `src/page-editor/EditModeContext.tsx`:

```tsx
import { createContext, useContext } from "react";

export type EditModeContextValue = {
  editing: boolean;
  selectedSectionId: string | null;
  selectSection: (sectionId: string) => void;
  openAdvancedEditor: (sectionId: string) => void;
};

const EditModeContext = createContext<EditModeContextValue | null>(null);

export function EditModeProvider({
  value,
  children,
}: {
  value: EditModeContextValue;
  children: React.ReactNode;
}) {
  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
}

export function useEditMode() {
  return useContext(EditModeContext);
}
```

- [ ] **Step 2: Add editable frame wrapper**

Create `src/page-editor/EditableFrame.tsx`:

```tsx
import { GripVertical, Pencil, Settings } from "lucide-react";
import { useEditMode } from "./EditModeContext";

export function EditableFrame({
  sectionId,
  label,
  children,
}: {
  sectionId: string;
  label: string;
  children: React.ReactNode;
}) {
  const edit = useEditMode();
  if (!edit?.editing) return <>{children}</>;

  const selected = edit.selectedSectionId === sectionId;

  return (
    <div className={`editable-frame ${selected ? "is-selected" : ""}`} onClick={() => edit.selectSection(sectionId)}>
      <div className="editable-toolbar" onClick={(event) => event.stopPropagation()}>
        <span><GripVertical aria-hidden="true" />{label}</span>
        <button onClick={() => edit.selectSection(sectionId)}><Pencil aria-hidden="true" />编辑</button>
        <button onClick={() => edit.openAdvancedEditor(sectionId)}><Settings aria-hidden="true" />高级编辑</button>
      </div>
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Wire edit state into `AppShell`**

In `src/components/AppShell.tsx`, add state:

```tsx
const [editing, setEditing] = useState(false);
const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
```

Wrap `PageRenderer`:

```tsx
<EditModeProvider
  value={{
    editing,
    selectedSectionId,
    selectSection: setSelectedSectionId,
    openAdvancedEditor: (sectionId) => openEditor(activePageId, sectionId),
  }}
>
  <PageRenderer config={pageConfig} navigate={navigate} notify={setNotice} />
</EditModeProvider>
```

Change `openEditor` signature:

```tsx
function openEditor(pageId = activePageId, sectionId?: string) {
  setActivePageId(pageId);
  setMode("editor");
  const suffix = sectionId ? `?section=${encodeURIComponent(sectionId)}` : "";
  window.history.pushState({}, "", `/editor${suffix}`);
}
```

Change topbar call:

```tsx
<Topbar
  title={pageConfig.title}
  editing={editing}
  onToggleEditing={() => setEditing((value) => !value)}
  onOpenEditor={() => openEditor(activePageId)}
/>
```

Update `Topbar` props and edit button:

```tsx
function Topbar({
  title,
  editing,
  onToggleEditing,
  onOpenEditor,
}: {
  title: string;
  editing: boolean;
  onToggleEditing: () => void;
  onOpenEditor: () => void;
}) {
  return (
    <header className="topbar">
      <div className="breadcrumb"><Home aria-hidden="true" /><span>{title} / 工作台</span></div>
      <div className="top-actions">
        <button className={`team-button edit-page-button ${editing ? "is-active" : ""}`} onClick={onToggleEditing}>
          {editing ? "退出编辑" : "编辑页面"}
        </button>
        <button className="team-button" onClick={onOpenEditor}>高级编辑</button>
        <button className="icon-button" aria-label="搜索"><Search aria-hidden="true" /></button>
        <button className="icon-button has-dot" aria-label="通知"><Bell aria-hidden="true" /></button>
        <button className="team-button"><span className="avatar avatar--sm">DT</span>DuoLe Team<ChevronDown aria-hidden="true" /></button>
      </div>
    </header>
  );
}
```

Also import:

```ts
import { EditModeProvider } from "../page-editor/EditModeContext";
```

- [ ] **Step 4: Wrap homepage sections**

In `HomePageRenderer.tsx`, import `EditableFrame`:

```ts
import { EditableFrame } from "../page-editor/EditableFrame";
```

Wrap hero:

```tsx
{hero ? <EditableFrame sectionId={hero.id} label="Hero"><Hero section={hero} navigate={navigate} notify={notify} /></EditableFrame> : null}
```

Wrap module cards:

```tsx
{modules.map((section) => (
  <EditableFrame key={section.id} sectionId={section.id} label={section.title ?? section.id}>
    <ModuleCard section={section} navigate={navigate} notify={notify} />
  </EditableFrame>
))}
```

Wrap status strip:

```tsx
{status ? <EditableFrame sectionId={status.id} label="状态条"><StatusStrip section={status} /></EditableFrame> : null}
```

- [ ] **Step 5: Wrap business page sections**

In `BusinessPageRenderer.tsx`, import `EditableFrame` and wrap each rendered section:

```tsx
import { EditableFrame } from "../page-editor/EditableFrame";
```

Use:

```tsx
if (section.type === "business-overview") {
  return (
    <EditableFrame key={section.id} sectionId={section.id} label={section.title ?? section.id}>
      <BusinessOverview section={section} navigate={navigate} notify={notify} />
    </EditableFrame>
  );
}
```

For table:

```tsx
return (
  <EditableFrame key={section.id} sectionId={section.id} label={section.title ?? section.id}>
    <ConfigTable title={section.title ?? "列表"} fields={fields} />
  </EditableFrame>
);
```

- [ ] **Step 6: Add edit frame styles**

Append to `src/styles.css`:

```css
.edit-page-button.is-active {
  background: linear-gradient(135deg, var(--cyan), oklch(72% 0.15 350));
  color: oklch(9% 0.018 250);
}

.editable-frame {
  position: relative;
  min-width: 0;
  min-height: 0;
  outline: 2px dashed color-mix(in oklch, var(--cyan), white 26%);
  outline-offset: 4px;
  border-radius: var(--radius-lg);
}

.editable-frame.is-selected {
  outline-style: solid;
  outline-color: color-mix(in oklch, var(--pink), white 18%);
}

.editable-toolbar {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid oklch(98% 0.006 250 / 0.22);
  border-radius: var(--radius);
  background: oklch(9% 0.018 250 / 0.88);
  color: oklch(96% 0.008 250);
  padding: 6px;
  box-shadow: 0 14px 28px oklch(0% 0 0 / 0.24);
}

.editable-toolbar span,
.editable-toolbar button {
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: inherit;
  font-size: 11px;
  font-weight: 800;
}

.editable-toolbar button {
  border: 1px solid oklch(98% 0.006 250 / 0.18);
  border-radius: 6px;
  background: oklch(98% 0.006 250 / 0.1);
  padding: 0 8px;
}

.editable-toolbar svg {
  width: 13px;
  height: 13px;
}
```

- [ ] **Step 7: Run validation and build**

Run:

```powershell
npm.cmd run validate:config
npm.cmd run build
```

Expected: validation passed and build exits `0`.

- [ ] **Step 8: Manual browser check**

Open `http://localhost:57260/`, click `编辑页面`.

Expected:

- Edit button changes to `退出编辑`.
- Hero, modules, and status strip show editable frames.
- Clicking `高级编辑` changes URL to `/editor?section=<id>`.

- [ ] **Step 9: Create checkpoint**

Run the checkpoint command.

---

### Task 5: Build Standalone Three-Column Editor

**Files:**
- Create: `src/editor/EditorPage.tsx`
- Create: `src/editor/EditorSidebar.tsx`
- Create: `src/editor/EditorCanvas.tsx`
- Create: `src/editor/InspectorPanel.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Create editor page shell**

Create `src/editor/EditorPage.tsx`:

```tsx
import { useMemo, useState } from "react";
import { getDraftPageConfig, getPageVersions, publishPageConfig, restorePageVersion, saveDraftPageConfig } from "./pageConfigStore";
import { pageOrder } from "../config/defaultPages";
import type { PageConfig, PageId, PageSection } from "../config/pageTypes";
import { EditorSidebar } from "./EditorSidebar";
import { EditorCanvas } from "./EditorCanvas";
import { InspectorPanel } from "./InspectorPanel";

export function EditorPage({ initialPageId, onBack }: { initialPageId: PageId; onBack: () => void }) {
  const initialSectionId = new URLSearchParams(window.location.search).get("section");
  const [pageId, setPageId] = useState<PageId>(initialPageId);
  const [draft, setDraft] = useState<PageConfig>(() => getDraftPageConfig(initialPageId));
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(initialSectionId);
  const [message, setMessage] = useState("");

  const selectedSection = useMemo(
    () => draft.layout.sections.find((section) => section.id === selectedSectionId) ?? null,
    [draft, selectedSectionId],
  );

  function selectPage(nextPageId: PageId) {
    setPageId(nextPageId);
    setDraft(getDraftPageConfig(nextPageId));
    setSelectedSectionId(null);
  }

  function updateDraft(updater: (config: PageConfig) => PageConfig) {
    setDraft((current) => updater(structuredClone(current)));
  }

  function updateSection(sectionId: string, updater: (section: PageSection) => PageSection) {
    updateDraft((config) => ({
      ...config,
      layout: {
        ...config.layout,
        sections: config.layout.sections.map((section) => section.id === sectionId ? updater(section) : section),
      },
    }));
  }

  function saveDraft() {
    const version = saveDraftPageConfig(draft);
    setMessage(`已保存 ${version.label}`);
  }

  function publishDraft() {
    saveDraftPageConfig(draft);
    const published = publishPageConfig(pageId);
    setDraft(published);
    setMessage("已发布到当前浏览器");
  }

  function restore(versionId: string) {
    const version = getPageVersions(pageId).find((item) => item.versionId === versionId);
    if (!version) return;
    setDraft(restorePageVersion(version));
    setMessage(`已恢复 ${version.label}`);
  }

  return (
    <div className="editor-shell">
      <header className="editor-topbar">
        <div><strong>DuoLe 页面编辑器</strong><span>{draft.title}</span></div>
        <div className="editor-topbar-actions">
          <button onClick={saveDraft}>保存草稿</button>
          <button onClick={publishDraft}>发布</button>
          <button onClick={onBack}>返回页面</button>
        </div>
      </header>
      <EditorSidebar pageOrder={pageOrder} activePageId={pageId} config={draft} onSelectPage={selectPage} onSelectSection={setSelectedSectionId} />
      <EditorCanvas config={draft} selectedSectionId={selectedSectionId} onSelectSection={setSelectedSectionId} />
      <InspectorPanel
        config={draft}
        section={selectedSection}
        versions={getPageVersions(pageId)}
        onUpdatePage={setDraft}
        onUpdateSection={updateSection}
        onRestoreVersion={restore}
      />
      {message ? <div className="toast-status">{message}</div> : null}
    </div>
  );
}
```

- [ ] **Step 2: Create editor sidebar**

Create `src/editor/EditorSidebar.tsx`:

```tsx
import type { PageConfig, PageId } from "../config/pageTypes";

export function EditorSidebar({
  pageOrder,
  activePageId,
  config,
  onSelectPage,
  onSelectSection,
}: {
  pageOrder: PageId[];
  activePageId: PageId;
  config: PageConfig;
  onSelectPage: (pageId: PageId) => void;
  onSelectSection: (sectionId: string) => void;
}) {
  return (
    <aside className="editor-sidebar">
      <section>
        <h2>页面</h2>
        {pageOrder.map((pageId) => (
          <button className={pageId === activePageId ? "is-active" : ""} key={pageId} onClick={() => onSelectPage(pageId)}>
            {pageId}
          </button>
        ))}
      </section>
      <section>
        <h2>结构</h2>
        {config.layout.sections
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <button key={section.id} onClick={() => onSelectSection(section.id)}>
              {section.title ?? section.id}
            </button>
          ))}
      </section>
      <section>
        <h2>组件库</h2>
        <div className="editor-component-chip">Hero</div>
        <div className="editor-component-chip">模块卡片</div>
        <div className="editor-component-chip">表格</div>
        <div className="editor-component-chip">筛选项</div>
        <div className="editor-component-chip">按钮</div>
      </section>
    </aside>
  );
}
```

- [ ] **Step 3: Create editor canvas**

Create `src/editor/EditorCanvas.tsx`:

```tsx
import { EditModeProvider } from "../page-editor/EditModeContext";
import { PageRenderer } from "../page-renderer/PageRenderer";
import type { PageConfig } from "../config/pageTypes";

export function EditorCanvas({
  config,
  selectedSectionId,
  onSelectSection,
}: {
  config: PageConfig;
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
}) {
  return (
    <main className="editor-canvas">
      <div className="editor-canvas-toolbar">
        <span>实时画布</span>
        <span>{config.status === "draft" ? "草稿" : "已发布"}</span>
      </div>
      <div className="editor-canvas-surface">
        <EditModeProvider
          value={{
            editing: true,
            selectedSectionId,
            selectSection: onSelectSection,
            openAdvancedEditor: onSelectSection,
          }}
        >
          <PageRenderer config={config} navigate={() => undefined} notify={() => undefined} />
        </EditModeProvider>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Create inspector panel**

Create `src/editor/InspectorPanel.tsx`:

```tsx
import type { FieldConfig, PageConfig, PageSection, PageVersion } from "../config/pageTypes";

export function InspectorPanel({
  config,
  section,
  versions,
  onUpdatePage,
  onUpdateSection,
  onRestoreVersion,
}: {
  config: PageConfig;
  section: PageSection | null;
  versions: PageVersion[];
  onUpdatePage: (config: PageConfig) => void;
  onUpdateSection: (sectionId: string, updater: (section: PageSection) => PageSection) => void;
  onRestoreVersion: (versionId: string) => void;
}) {
  return (
    <aside className="inspector-panel">
      <h2>属性</h2>
      {section ? (
        <SectionInspector section={section} onUpdate={(updater) => onUpdateSection(section.id, updater)} />
      ) : (
        <PageInspector config={config} onUpdatePage={onUpdatePage} />
      )}
      {config.fields ? <FieldInspector config={config} onUpdatePage={onUpdatePage} /> : null}
      <VersionInspector versions={versions} onRestoreVersion={onRestoreVersion} />
    </aside>
  );
}

function PageInspector({ config, onUpdatePage }: { config: PageConfig; onUpdatePage: (config: PageConfig) => void }) {
  return (
    <section className="inspector-section">
      <h3>页面</h3>
      <label>页面标题<input value={config.title} onChange={(event) => onUpdatePage({ ...config, title: event.target.value })} /></label>
      <label>导航名称<input value={config.navLabel} onChange={(event) => onUpdatePage({ ...config, navLabel: event.target.value })} /></label>
    </section>
  );
}

function SectionInspector({ section, onUpdate }: { section: PageSection; onUpdate: (updater: (section: PageSection) => PageSection) => void }) {
  return (
    <section className="inspector-section">
      <h3>区块</h3>
      <label>标题<input value={section.title ?? ""} onChange={(event) => onUpdate((current) => ({ ...current, title: event.target.value }))} /></label>
      <label>副标题<textarea value={section.subtitle ?? ""} onChange={(event) => onUpdate((current) => ({ ...current, subtitle: event.target.value }))} /></label>
      <label>顺序<input type="number" value={section.order} onChange={(event) => onUpdate((current) => ({ ...current, order: Number(event.target.value) }))} /></label>
      <label><input type="checkbox" checked={section.visible} onChange={(event) => onUpdate((current) => ({ ...current, visible: event.target.checked }))} /> 显示区块</label>
      {section.type === "hero" ? (
        <label>Hero 高度<input type="number" value={section.style?.height ?? 430} onChange={(event) => onUpdate((current) => ({ ...current, style: { ...current.style, height: Number(event.target.value) } }))} /></label>
      ) : null}
      {section.content ? Object.entries(section.content).map(([key, value]) => (
        <label key={key}>{key}<input value={String(value)} onChange={(event) => onUpdate((current) => ({ ...current, content: { ...current.content, [key]: event.target.value } }))} /></label>
      )) : null}
      {section.actions?.map((action) => (
        <div className="action-editor" key={action.id}>
          <strong>{action.id}</strong>
          <label>按钮文案<input value={action.label} onChange={(event) => onUpdate((current) => ({ ...current, actions: current.actions?.map((item) => item.id === action.id ? { ...item, label: event.target.value } : item) }))} /></label>
          <label>目标<input value={action.target} onChange={(event) => onUpdate((current) => ({ ...current, actions: current.actions?.map((item) => item.id === action.id ? { ...item, target: event.target.value } : item) }))} /></label>
        </div>
      ))}
    </section>
  );
}

function FieldInspector({ config, onUpdatePage }: { config: PageConfig; onUpdatePage: (config: PageConfig) => void }) {
  function updateField(fieldId: string, updater: (field: FieldConfig) => FieldConfig) {
    onUpdatePage({ ...config, fields: config.fields?.map((field) => field.id === fieldId ? updater(field) : field) });
  }

  return (
    <section className="inspector-section">
      <h3>字段显示</h3>
      {config.fields?.map((field) => (
        <div className="field-editor" key={field.id}>
          <label>名称<input value={field.label} onChange={(event) => updateField(field.id, (current) => ({ ...current, label: event.target.value }))} /></label>
          <label><input type="checkbox" checked={field.visible} onChange={(event) => updateField(field.id, (current) => ({ ...current, visible: event.target.checked }))} /> 显示</label>
          <label><input type="checkbox" checked={field.tableColumn} onChange={(event) => updateField(field.id, (current) => ({ ...current, tableColumn: event.target.checked }))} /> 表格列</label>
          <label><input type="checkbox" checked={field.filterable} onChange={(event) => updateField(field.id, (current) => ({ ...current, filterable: event.target.checked }))} /> 筛选项</label>
        </div>
      ))}
    </section>
  );
}

function VersionInspector({ versions, onRestoreVersion }: { versions: PageVersion[]; onRestoreVersion: (versionId: string) => void }) {
  return (
    <section className="inspector-section">
      <h3>版本</h3>
      {versions.length === 0 ? <p>暂无草稿版本</p> : null}
      {versions.map((version) => <button key={version.versionId} onClick={() => onRestoreVersion(version.versionId)}>{version.label}</button>)}
    </section>
  );
}
```

- [ ] **Step 5: Add editor styles**

Append to `src/styles.css`:

```css
.editor-shell {
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 236px minmax(0, 1fr) 300px;
  grid-template-rows: 52px minmax(0, 1fr);
  background: oklch(97.4% 0.006 250);
  color: var(--text);
}

.editor-topbar {
  grid-column: 1 / -1;
  border-bottom: 1px solid var(--line);
  background: var(--surface-raised);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.editor-topbar strong,
.editor-topbar span {
  display: block;
}

.editor-topbar span {
  color: var(--muted);
  font-size: 11px;
  font-weight: 760;
}

.editor-topbar-actions,
.editor-sidebar,
.inspector-panel {
  display: flex;
  gap: 8px;
}

.editor-topbar-actions button,
.editor-sidebar button,
.inspector-panel button {
  min-height: 32px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface-raised);
  color: var(--text);
  padding: 0 10px;
  font-size: 12px;
  font-weight: 780;
}

.editor-sidebar,
.inspector-panel {
  min-height: 0;
  overflow: auto;
  flex-direction: column;
  background: var(--surface-raised);
  padding: 14px;
}

.editor-sidebar {
  border-right: 1px solid var(--line);
}

.inspector-panel {
  border-left: 1px solid var(--line);
}

.editor-sidebar h2,
.inspector-panel h2,
.inspector-section h3 {
  margin: 0 0 10px;
  font-size: 12px;
  color: var(--muted);
}

.editor-sidebar section,
.inspector-section {
  display: grid;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

.editor-sidebar button.is-active {
  background: color-mix(in oklch, var(--cyan), white 88%);
  border-color: color-mix(in oklch, var(--cyan), white 48%);
}

.editor-component-chip {
  min-height: 30px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 760;
}

.editor-canvas {
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: 42px minmax(0, 1fr);
}

.editor-canvas-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 780;
}

.editor-canvas-surface {
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding: 16px;
}

.editor-canvas-surface .main,
.editor-canvas-surface .home-workbench {
  min-height: auto;
}

.inspector-panel label {
  display: grid;
  gap: 5px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 760;
}

.inspector-panel input,
.inspector-panel textarea {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface-soft);
  padding: 8px;
  color: var(--text);
  font: inherit;
  font-size: 12px;
}

.inspector-panel textarea {
  min-height: 68px;
  resize: vertical;
}

.field-editor,
.action-editor {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 10px;
  display: grid;
  gap: 8px;
}
```

- [ ] **Step 6: Run validation and build**

Run:

```powershell
npm.cmd run validate:config
npm.cmd run build
```

Expected: validation passed and build exits `0`.

- [ ] **Step 7: Manual browser check**

Open `http://localhost:57260/editor`.

Expected:

- Editor opens with three columns.
- Clicking page buttons changes draft page.
- Clicking sections selects them.
- Editing title/subtitle/fields updates canvas.

- [ ] **Step 8: Create checkpoint**

Run the checkpoint command.

---

### Task 6: Finish Draft, Preview, Publish, and Rollback Flow

**Files:**
- Modify: `src/editor/EditorPage.tsx`
- Modify: `src/editor/InspectorPanel.tsx`
- Modify: `src/components/AppShell.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add unsaved-change tracking**

In `EditorPage.tsx`, add:

```tsx
const [dirty, setDirty] = useState(false);
```

Change `updateDraft`:

```tsx
function updateDraft(updater: (config: PageConfig) => PageConfig) {
  setDraft((current) => updater(structuredClone(current)));
  setDirty(true);
}
```

After `saveDraft()` succeeds:

```tsx
setDirty(false);
```

In `publishDraft()` after setDraft:

```tsx
setDirty(false);
```

Before returning page:

```tsx
function safeBack() {
  if (dirty && !window.confirm("当前草稿尚未保存，确认返回页面吗？")) return;
  onBack();
}
```

Use:

```tsx
<button onClick={safeBack}>返回页面</button>
```

- [ ] **Step 2: Add preview state**

In `EditorPage.tsx`, add:

```tsx
const [previewing, setPreviewing] = useState(false);
```

In topbar:

```tsx
<button onClick={() => setPreviewing((value) => !value)}>{previewing ? "退出预览" : "预览草稿"}</button>
```

Pass to `EditorCanvas`:

```tsx
<EditorCanvas config={draft} selectedSectionId={previewing ? null : selectedSectionId} onSelectSection={setSelectedSectionId} previewing={previewing} />
```

Update `EditorCanvas` props:

```tsx
export function EditorCanvas({
  config,
  selectedSectionId,
  onSelectSection,
  previewing,
}: {
  config: PageConfig;
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  previewing: boolean;
}) {
  return (
    <main className="editor-canvas">
      <div className="editor-canvas-toolbar">
        <span>实时画布</span>
        <span>{previewing ? "预览模式" : "编辑模式"}</span>
      </div>
      <div className="editor-canvas-surface">
        <EditModeProvider value={{ editing: !previewing, selectedSectionId, selectSection: onSelectSection, openAdvancedEditor: onSelectSection }}>
          <PageRenderer config={config} navigate={() => undefined} notify={() => undefined} />
        </EditModeProvider>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Make publish reload app page config**

In `AppShell.tsx`, replace notice refresh coupling with a numeric revision:

```tsx
const [revision, setRevision] = useState(0);
const pageConfig = useMemo(() => getPublishedPageConfig(activePageId), [activePageId, revision]);
```

In `navigate`:

```tsx
setRevision((value) => value + 1);
```

When returning from editor:

```tsx
if (mode === "editor") {
  return <EditorPage initialPageId={activePageId} onBack={() => { setRevision((value) => value + 1); navigate(activePageId); }} />;
}
```

- [ ] **Step 4: Add version restore affordance copy**

In `VersionInspector`, change button label:

```tsx
{versions.map((version) => (
  <button key={version.versionId} onClick={() => onRestoreVersion(version.versionId)}>
    恢复为草稿：{version.label}
  </button>
))}
```

- [ ] **Step 5: Run validation and build**

Run:

```powershell
npm.cmd run validate:config
npm.cmd run build
```

Expected: validation passed and build exits `0`.

- [ ] **Step 6: Manual publish check**

Open `http://localhost:57260/editor`.

Check:

- Change homepage hero headline.
- Click `保存草稿`.
- Click `预览草稿`.
- Click `发布`.
- Click `返回页面`.
- Homepage displays new headline.
- Return to editor and use a version restore button.

- [ ] **Step 7: Create checkpoint**

Run the checkpoint command.

---

### Task 7: Polish Responsive Layout and Final Verification

**Files:**
- Modify: `src/styles.css`
- Verify: browser screenshots

- [ ] **Step 1: Add editor responsive styles**

Append to `src/styles.css`:

```css
@media (max-width: 1080px) {
  .editor-shell {
    grid-template-columns: 180px minmax(0, 1fr);
  }

  .inspector-panel {
    grid-column: 1 / -1;
    border-left: 0;
    border-top: 1px solid var(--line);
    max-height: 38dvh;
  }
}

@media (max-width: 860px) {
  .editor-shell {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto minmax(0, 1fr) auto;
  }

  .editor-sidebar {
    border-right: 0;
    border-bottom: 1px solid var(--line);
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .editor-canvas-surface {
    padding: 10px;
  }

  .business-overview {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Add config corruption fallback**

In `pageConfigStore.ts`, update `readJson` catch path to clear bad data:

```ts
function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}
```

- [ ] **Step 3: Run full verification**

Run:

```powershell
npm.cmd run validate:config
npm.cmd run build
Invoke-WebRequest -Uri 'http://localhost:57260/' -UseBasicParsing | Select-Object StatusCode,StatusDescription
```

Expected:

- `Page config validation passed`
- Build exits `0`
- Web request returns `200 OK`

- [ ] **Step 4: Capture desktop screenshots**

Run:

```powershell
$chrome='C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chrome)) { $chrome='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' }
& $chrome --headless=new --disable-gpu --window-size=1440,900 --screenshot='C:\Users\Administrator\Desktop\MAC\TKDUOLE\page-editor-home-1440x900.png' 'http://localhost:57260/'
& $chrome --headless=new --disable-gpu --window-size=1440,900 --screenshot='C:\Users\Administrator\Desktop\MAC\TKDUOLE\page-editor-editor-1440x900.png' 'http://localhost:57260/editor'
Get-Item 'C:\Users\Administrator\Desktop\MAC\TKDUOLE\page-editor-home-1440x900.png','C:\Users\Administrator\Desktop\MAC\TKDUOLE\page-editor-editor-1440x900.png' | Select-Object FullName,Length
```

Expected:

- Both screenshot files exist.
- Homepage does not visually regress.
- Editor shows three columns.
- No text overlaps inside primary buttons, module cards, topbar, or inspector controls.

- [ ] **Step 5: Create final desktop backup**

Run:

```powershell
$project='C:\Users\Administrator\Desktop\MAC\TKDUOLE'
$timestamp=Get-Date -Format 'yyyyMMdd-HHmmss'
$desktopCopy="C:\Users\Administrator\Desktop\TKDUOLE_PAGE_EDITOR_DONE_$timestamp"
$excludeDirs=@('node_modules','.npm-cache','dist')
New-Item -ItemType Directory -Force -Path $desktopCopy | Out-Null
Get-ChildItem -LiteralPath $project -Force | Where-Object { $excludeDirs -notcontains $_.Name } | ForEach-Object {
  $target=Join-Path $desktopCopy $_.Name
  if ($_.PSIsContainer) { Copy-Item -LiteralPath $_.FullName -Destination $target -Recurse -Force }
  else { Copy-Item -LiteralPath $_.FullName -Destination $target -Force }
}
Write-Output "desktop-copy=$desktopCopy"
```

Expected: prints `desktop-copy=C:\Users\Administrator\Desktop\TKDUOLE_PAGE_EDITOR_DONE_...`.

---

## Self-Review

Spec coverage:

- Hybrid mode: covered in Tasks 4 and 5.
- Standard three-column editor: covered in Task 5.
- Page scope: covered in Task 1 JSON defaults and Task 3 routing.
- Page config JSON: covered in Task 1.
- Draft, preview, publish, rollback: covered in Tasks 2 and 6.
- Field display, table columns, filters: covered in Tasks 1, 3, and 5.
- Button actions: covered in Tasks 1, 2, and 5.
- Damaged config fallback: covered in Task 7.

Known implementation compromise:

- First version stores edits in `localStorage`, not by writing back to source JSON files. This keeps the frontend safe and avoids adding a backend. The checked-in JSON files remain the baseline recovery configs.

Placeholder scan:

- This plan avoids unfinished markers and unnamed follow-up steps.

Verification:

- Every task ends with validation/build or browser checks plus a filesystem checkpoint because the project is not currently a git repository.
