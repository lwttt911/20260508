# Architecture Notes

This document describes the 2026-05-08 front-end architecture and the intended product architecture for later backend work.

## Product Loop

DuoLe TikTok Growth Studio is a closed-loop content production system:

```text
Viral video
-> video segmentation
-> segment evidence table
-> nine-part structure table
-> factor execution evidence table
-> factor library
-> SKU profile
-> AI content production
-> publishing result
-> factor effectiveness feedback
```

The key product principle is to separate observation from judgement:

- Pass 1: identify objective evidence in each segment.
- Pass 2: judge structure and execution factors from the evidence table.

## Front-End Stack

- React 19 with functional components.
- Vite 6 for local development and production build.
- TypeScript strict mode.
- Plain CSS with OKLCH color tokens.
- `lucide-react` for icons.

The current UI is a single-page prototype. There is no router yet.

## Implemented Screens

### Home Dashboard

File: `src/main.tsx`

Implemented direction:

- Default product-led workbench homepage with a TikTok creator-commerce poster hero.
- Black left navigation rail with a light long-use workbench on the right.
- Three v2-aligned first-screen modules: `爆款分析`, `TOP 组合 / 因子库`, and `SKU 生产 / 回流裂变`.
- Compact status strip for local DB authority, Feishu sync queue, feedback, and A1-A5 tag calculation.

The homepage visual implementation is still being revised. The latest 2026-05-08 user correction rejects the unified-panel module experiment and asks for three independent module boards, no desktop scrolling, no cropped overflow, a larger hero / hook stage, lighter module content, and a cleaner Apple-white workbench surface.

The previous URL-driven variant switch was removed. No UI state is persisted beyond the current browser session.

### Navigation Shell

The sidebar shows intended modules:

- 首页
- 爆款分析
- 因子库
- SKU 档案
- AI 内容生产
- AI 生图
- 爆款裂变
- 结果回流

These are visual navigation items only. They do not route yet.

## Intended Data Model

No database exists in this repository as of 2026-05-08. The intended local-first data model should include these entities:

- Video
- VideoSegment
- SegmentEvidence
- NinePartStructure
- FactorExecutionEvidence
- Factor
- SKU
- ProductionTask
- GeneratedImageAsset
- VariantTask
- PublishedVideoResult
- FeishuSyncJob

Local database should be authoritative. Feishu is a collaboration and viewing sync layer.

## Intended Backend Responsibilities

The future backend should handle:

- File upload and storage path configuration.
- FFmpeg scene-change segmentation.
- Manual segment edit operations: edit time range, add, delete, merge adjacent, split.
- AI provider abstraction for segment evidence extraction and factor judgement.
- Local database persistence.
- Feishu sync queue, retry, and failure states.
- Result feedback calculations for factor priority and effectiveness.

## UI Architecture Direction

The current implementation keeps all components in `src/main.tsx` for speed. When module pages are added, split by surface:

```text
src/
├── app/
├── components/
├── data/
├── pages/
│   ├── Home/
│   ├── ViralAnalysis/
│   ├── FactorLibrary/
│   ├── SkuProfiles/
│   ├── ContentProduction/
│   ├── ImageGeneration/
│   ├── VariantLab/
│   └── ResultFeedback/
└── styles/
```

Do not split prematurely while only the home page exists. Split when a second real page is implemented.

## Design System Notes

- Black sidebar, Apple-white workbench, and poster-like TikTok commerce hero.
- Restrained product palette: neutral ink for UI text, cyan for operational accent, pink only for hero energy, tiny active indicators, gradient endpoints, and attention states.
- One icon family: Lucide.
- Product UI uses fixed rem-based type sizes, not viewport-scaled typography.
- Homepage must fit a normal desktop display without vertical scrolling, whole-page transform scaling, or hidden/cropped overflow.
- Homepage modules should be three separate boards, not a single merged panel.
- Home can carry stronger product identity. Operational pages should use tables, filters, steppers, drawers, and split panes.
