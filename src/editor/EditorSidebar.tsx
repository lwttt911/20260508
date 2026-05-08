import type { PageConfig, PageId } from "../config/pageTypes";

const componentLibrary = ["Hero", "模块卡片", "业务概览", "表格", "筛选项", "按钮"];

export function EditorSidebar({
  pageOrder,
  activePageId,
  activeSectionId,
  config,
  onSelectPage,
  onSelectSection,
}: {
  pageOrder: PageId[];
  activePageId: PageId;
  activeSectionId: string | null;
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
            {pageIdToLabel(pageId)}
          </button>
        ))}
      </section>

      <section>
        <h2>结构</h2>
        {config.layout.sections
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <button
              className={section.id === activeSectionId ? "is-active" : ""}
              key={section.id}
              onClick={() => onSelectSection(section.id)}
            >
              <span>{section.title ?? section.id}</span>
              {!section.visible ? <em>隐藏</em> : null}
            </button>
          ))}
      </section>

      <section>
        <h2>组件库</h2>
        {componentLibrary.map((item) => (
          <div className="editor-component-chip" key={item}>
            {item}
          </div>
        ))}
      </section>
    </aside>
  );
}

function pageIdToLabel(pageId: PageId) {
  if (pageId === "ai-image") return "AI 生图";
  if (pageId === "viral-analysis") return "爆款分析";
  if (pageId === "ai-content") return "AI 内容生产";
  if (pageId === "sku") return "SKU 运营";
  return "首页";
}
