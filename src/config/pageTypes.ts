export type PageId = "home" | "ai-image" | "viral-analysis" | "ai-content" | "sku";

export type PageStatus = "draft" | "published";

export type SectionType =
  | "hero"
  | "module-showcase"
  | "status-strip"
  | "business-overview"
  | "table"
  | "workflow";

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
