import { useMemo, useRef, useState } from "react";
import { pageOrder } from "../config/defaultPages";
import type { PageConfig, PageId, PageSection } from "../config/pageTypes";
import { getNextSectionHeight, getNextSectionWidth } from "../page-editor/resizeMath.mjs";
import { EditorCanvas } from "./EditorCanvas";
import { EditorSidebar } from "./EditorSidebar";
import { InspectorPanel } from "./InspectorPanel";
import { getDraftPageConfig, getPageVersions, publishPageConfig, restorePageVersion, saveDraftPageConfig } from "./pageConfigStore";

export function EditorPage({ initialPageId, onBack }: { initialPageId: PageId; onBack: () => void }) {
  const initialSectionId = new URLSearchParams(window.location.search).get("section");
  const [pageId, setPageId] = useState<PageId>(initialPageId);
  const [draft, setDraft] = useState<PageConfig>(() => getDraftPageConfig(initialPageId));
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(initialSectionId);
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const resizeStartRef = useRef<PageSection | null>(null);

  const selectedSection = useMemo(
    () => draft.layout.sections.find((section) => section.id === selectedSectionId) ?? null,
    [draft, selectedSectionId],
  );

  function selectPage(nextPageId: PageId) {
    if (dirty && !window.confirm("当前草稿尚未保存，确认切换页面吗？")) return;
    setPageId(nextPageId);
    setDraft(getDraftPageConfig(nextPageId));
    setSelectedSectionId(null);
    setMessage("");
    setDirty(false);
    setPreviewing(false);
  }

  function updateDraft(updater: (config: PageConfig) => PageConfig) {
    setDraft((current) => updater(structuredClone(current)));
    setDirty(true);
  }

  function updateSection(sectionId: string, updater: (section: PageSection) => PageSection) {
    updateDraft((config) => ({
      ...config,
      layout: {
        ...config.layout,
        sections: config.layout.sections.map((section) => (section.id === sectionId ? updater(section) : section)),
      },
    }));
  }

  function resizeSection(
    sectionId: string,
    drag: {
      deltaX: number;
      deltaY: number;
      phase: "start" | "move" | "end";
    },
  ) {
    if (drag.phase === "start") {
      resizeStartRef.current = draft.layout.sections.find((section) => section.id === sectionId) ?? null;
      setSelectedSectionId(sectionId);
      return;
    }

    const startSection = resizeStartRef.current;
    if (!startSection) return;

    if (drag.phase === "end") {
      resizeStartRef.current = null;
      return;
    }

    updateSection(sectionId, (current) => {
      const nextHeight = getNextSectionHeight(startSection.type, startSection.style?.height, drag.deltaY);
      const nextWidth =
        current.type === "module-showcase" ? getNextSectionWidth(startSection.width, drag.deltaX) : current.width;

      return {
        ...current,
        width: nextWidth,
        style: {
          ...current.style,
          height: nextHeight,
        },
      };
    });
  }

  function deleteSection(sectionId: string) {
    const section = draft.layout.sections.find((s) => s.id === sectionId);
    if (!section) return;

    if (!window.confirm(`确认删除「${section.title || section.id}」吗？`)) return;

    updateDraft((config) => ({
      ...config,
      layout: {
        ...config.layout,
        sections: config.layout.sections.filter((s) => s.id !== sectionId),
      },
    }));

    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  }

  function saveDraft() {
    const version = saveDraftPageConfig(draft);
    setMessage(`已保存 ${version.label}`);
    setDirty(false);
  }

  function publishDraft() {
    saveDraftPageConfig(draft);
    const published = publishPageConfig(pageId);
    setDraft(published);
    setMessage("已发布到当前浏览器");
    setDirty(false);
  }

  function restore(versionId: string) {
    const version = getPageVersions(pageId).find((item) => item.versionId === versionId);
    if (!version) return;
    setDraft(restorePageVersion(version));
    setMessage(`已恢复 ${version.label}`);
    setDirty(false);
  }

  function safeBack() {
    if (dirty && !window.confirm("当前草稿尚未保存，确认返回页面吗？")) return;
    onBack();
  }

  return (
    <div className="editor-shell">
      <header className="editor-topbar">
        <div>
          <strong>DuoLe 页面编辑器</strong>
          <span>{draft.title}{dirty ? "，未保存" : ""}</span>
        </div>
        <div className="editor-topbar-actions">
          <button onClick={saveDraft}>保存草稿</button>
          <button onClick={() => setPreviewing((value) => !value)}>{previewing ? "退出预览" : "预览草稿"}</button>
          <button onClick={publishDraft}>发布</button>
          <button onClick={safeBack}>返回页面</button>
        </div>
      </header>
      <EditorSidebar
        pageOrder={pageOrder}
        activePageId={pageId}
        activeSectionId={selectedSectionId}
        config={draft}
        onSelectPage={selectPage}
        onSelectSection={setSelectedSectionId}
      />
      <EditorCanvas
        config={draft}
        selectedSectionId={previewing ? null : selectedSectionId}
        onSelectSection={setSelectedSectionId}
        onResizeSection={resizeSection}
        onDeleteSection={deleteSection}
        previewing={previewing}
      />
      <InspectorPanel
        config={draft}
        section={selectedSection}
        versions={getPageVersions(pageId)}
        onUpdatePage={(nextConfig) => updateDraft(() => nextConfig)}
        onUpdateSection={updateSection}
        onRestoreVersion={restore}
      />
      {message ? <div className="toast-status">{message}</div> : null}
    </div>
  );
}
