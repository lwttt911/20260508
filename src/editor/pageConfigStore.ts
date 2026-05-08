import { getDefaultPageConfig } from "../config/defaultPages";
import type { PageConfig, PageId, PageVersion } from "../config/pageTypes";

const DRAFT_KEY = "duole.pageEditor.drafts.v1";
const PUBLISHED_KEY = "duole.pageEditor.published.v1";
const VERSION_KEY = "duole.pageEditor.versions.v1";

type PageMap = Partial<Record<PageId, PageConfig>>;
type VersionMap = Partial<Record<PageId, PageVersion[]>>;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function cloneConfig(config: PageConfig): PageConfig {
  return structuredClone(config);
}

function normalizeConfig(config: PageConfig, status: "draft" | "published"): PageConfig {
  const cloned = cloneConfig(config);

  return {
    ...cloned,
    status,
    layout: {
      ...cloned.layout,
      sections: [...cloned.layout.sections].sort((a, b) => a.order - b.order),
    },
  };
}

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
  const now = new Date();
  const version: PageVersion = {
    versionId: `${draft.pageId}-${now.getTime()}`,
    pageId: draft.pageId,
    label: `草稿 ${now.toLocaleString("zh-CN")}`,
    createdAt: now.toISOString(),
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
