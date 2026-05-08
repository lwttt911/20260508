import { createContext, useContext } from "react";

export type EditModeContextValue = {
  editing: boolean;
  selectedSectionId: string | null;
  selectSection: (sectionId: string) => void;
  openAdvancedEditor: (sectionId: string) => void;
  resizeSection?: (
    sectionId: string,
    drag: {
      deltaX: number;
      deltaY: number;
      phase: "start" | "move" | "end";
    },
  ) => void;
  deleteSection?: (sectionId: string) => void;
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
