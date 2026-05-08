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
import { getPublishedPageConfig } from "../editor/pageConfigStore";
import { EditorPage } from "../editor/EditorPage";
import { EditModeProvider } from "../page-editor/EditModeContext";
import { PageRenderer } from "../page-renderer/PageRenderer";

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
      { pageId: "ai-content", label: "AI 内容生产", icon: WandSparkles },
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

function getInitialMode() {
  return window.location.pathname === "/editor" ? "editor" : "app";
}

function getInitialPageId(): PageId {
  const path = window.location.pathname.replace(/^\/+/, "");
  if (path === "ai-image") return "ai-image";
  if (path === "viral-analysis") return "viral-analysis";
  if (path === "ai-content") return "ai-content";
  if (path === "sku") return "sku";
  return "home";
}

export function AppShell() {
  const [mode, setMode] = useState<"app" | "editor">(getInitialMode);
  const [activePageId, setActivePageId] = useState<PageId>(getInitialPageId);
  const [editing, setEditing] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0);
  const pageConfig = useMemo(() => getPublishedPageConfig(activePageId), [activePageId, revision]);

  function navigate(pageId: PageId) {
    setActivePageId(pageId);
    setMode("app");
    setEditing(false);
    setSelectedSectionId(null);
    setNotice("");
    setRevision((value) => value + 1);
    window.history.pushState({}, "", pageId === "home" ? "/" : `/${pageId}`);
  }

  function openEditor(pageId = activePageId, sectionId?: string) {
    setActivePageId(pageId);
    setMode("editor");
    setSelectedSectionId(sectionId ?? null);
    const suffix = sectionId ? `?section=${encodeURIComponent(sectionId)}` : "";
    window.history.pushState({}, "", `/editor${suffix}`);
  }

  if (mode === "editor") {
    return <EditorPage initialPageId={activePageId} onBack={() => navigate(activePageId)} />;
  }

  return (
    <div className="app-shell">
      <Sidebar activePageId={activePageId} onNavigate={navigate} />
      <main className="main" id="main-content">
        <Topbar
          title={pageConfig.title}
          editing={editing}
          onToggleEditing={() => {
            setEditing((value) => !value);
            setSelectedSectionId(null);
          }}
          onOpenEditor={() => openEditor(activePageId)}
        />
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
                  disabled={!item.pageId}
                  key={item.label}
                  onClick={() => item.pageId && onNavigate(item.pageId)}
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
      <div className="breadcrumb">
        <Home aria-hidden="true" />
        <span>{title} / 工作台</span>
      </div>

      <div className="top-actions">
        <button className={`team-button edit-page-button ${editing ? "is-active" : ""}`} onClick={onToggleEditing}>
          {editing ? "退出编辑" : "编辑页面"}
        </button>
        <button className="team-button" onClick={onOpenEditor}>
          高级编辑
        </button>
        <button className="icon-button" aria-label="搜索">
          <Search aria-hidden="true" />
        </button>
        <button className="icon-button has-dot" aria-label="通知">
          <Bell aria-hidden="true" />
        </button>
        <button className="team-button">
          <span className="avatar avatar--sm">DT</span>
          DuoLe Team
          <ChevronDown aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
