import type { CSSProperties } from "react";
import { useState } from "react";
import { GripVertical, Maximize2, Pencil, Settings, Trash2 } from "lucide-react";
import { useEditMode } from "./EditModeContext";

export function EditableFrame({
  sectionId,
  label,
  style,
  children,
}: {
  sectionId: string;
  label: string;
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  const edit = useEditMode();
  const editMode = edit;
  if (!editMode?.editing) return <>{children}</>;

  const selected = editMode.selectedSectionId === sectionId;
  const selectSection = editMode.selectSection;
  const openAdvancedEditor = editMode.openAdvancedEditor;
  const resizeSection = editMode.resizeSection;
  const deleteSection = editMode.deleteSection;
  const [resizing, setResizing] = useState(false);
  const [currentSize, setCurrentSize] = useState<{ width?: number; height?: number } | null>(null);
  const frameRef = useState<HTMLDivElement | null>(null)[0];

  function startResize(event: React.PointerEvent<HTMLButtonElement>) {
    if (!resizeSection) return;
    const activeResizeSection = resizeSection;
    const frame = event.currentTarget.closest(".editable-frame") as HTMLDivElement;
    if (!frame) return;

    event.preventDefault();
    event.stopPropagation();
    selectSection(sectionId);
    activeResizeSection(sectionId, { deltaX: 0, deltaY: 0, phase: "start" });
    setResizing(true);

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = frame.offsetWidth;
    const startHeight = frame.offsetHeight;

    function handleMove(moveEvent: PointerEvent) {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      activeResizeSection(sectionId, {
        deltaX,
        deltaY,
        phase: "move",
      });

      // 实时显示尺寸
      setCurrentSize({
        width: startWidth + deltaX,
        height: startHeight + deltaY,
      });
    }

    function handleEnd(endEvent: PointerEvent) {
      activeResizeSection(sectionId, {
        deltaX: endEvent.clientX - startX,
        deltaY: endEvent.clientY - startY,
        phase: "end",
      });
      setResizing(false);
      setCurrentSize(null);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleEnd);
      window.removeEventListener("pointercancel", handleEnd);
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleEnd);
    window.addEventListener("pointercancel", handleEnd);
  }

  return (
    <div
      className={`editable-frame ${selected ? "is-selected" : ""} ${resizing ? "is-resizing" : ""}`}
      style={style}
      onClick={() => selectSection(sectionId)}
    >
      <div className="editable-toolbar" onClick={(event) => event.stopPropagation()}>
        <span>
          <GripVertical aria-hidden="true" />
          {label}
        </span>
        <button onClick={() => selectSection(sectionId)}>
          <Pencil aria-hidden="true" />
          编辑
        </button>
        <button onClick={() => openAdvancedEditor(sectionId)}>
          <Settings aria-hidden="true" />
          高级编辑
        </button>
        {deleteSection ? (
          <button onClick={() => deleteSection(sectionId)} className="delete-button">
            <Trash2 aria-hidden="true" />
            删除
          </button>
        ) : null}
      </div>
      {resizeSection ? (
        <button className="editable-resize-handle" aria-label={`拖动缩放 ${label}`} onPointerDown={startResize}>
          <Maximize2 aria-hidden="true" />
        </button>
      ) : null}
      {resizing && currentSize ? (
        <div className="editable-size-indicator">
          {currentSize.width ? `${Math.round(currentSize.width)}px` : ""}
          {currentSize.width && currentSize.height ? " × " : ""}
          {currentSize.height ? `${Math.round(currentSize.height)}px` : ""}
        </div>
      ) : null}
      {children}
    </div>
  );
}
