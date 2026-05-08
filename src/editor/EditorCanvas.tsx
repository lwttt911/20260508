import type { PageConfig } from "../config/pageTypes";
import { EditModeProvider } from "../page-editor/EditModeContext";
import { PageRenderer } from "../page-renderer/PageRenderer";

export function EditorCanvas({
  config,
  selectedSectionId,
  onSelectSection,
  onResizeSection,
  onDeleteSection,
  previewing,
}: {
  config: PageConfig;
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  onResizeSection: (
    sectionId: string,
    drag: {
      deltaX: number;
      deltaY: number;
      phase: "start" | "move" | "end";
    },
  ) => void;
  onDeleteSection: (sectionId: string) => void;
  previewing: boolean;
}) {
  return (
    <main className="editor-canvas">
      <div className="editor-canvas-toolbar">
        <span>实时画布</span>
        <span>{previewing ? "预览模式" : config.status === "draft" ? "编辑模式" : "已发布"}</span>
      </div>
      <div className="editor-canvas-surface">
        <EditModeProvider
          value={{
            editing: !previewing,
            selectedSectionId,
            selectSection: onSelectSection,
            openAdvancedEditor: onSelectSection,
            resizeSection: onResizeSection,
            deleteSection: onDeleteSection,
          }}
        >
          <PageRenderer config={config} navigate={() => undefined} notify={() => undefined} />
        </EditModeProvider>
      </div>
    </main>
  );
}
