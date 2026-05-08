import type { CSSProperties } from "react";
import { BadgeCheck, Boxes, Clapperboard, FileText, LineChart, Rocket, Sparkles } from "lucide-react";
import { runPageAction } from "../config/pageActions";
import type { PageAction, PageConfig, PageId, PageSection } from "../config/pageTypes";
import { EditableFrame } from "../page-editor/EditableFrame";

const scriptSegments = [
  { id: "01", duration: "3.2s" },
  { id: "02", duration: "2.8s" },
  { id: "03", duration: "3.6s" },
  { id: "04", duration: "2.4s" },
];

const categorySignals = ["瓶", "耳机", "椅", "灯"];

function sectionSizingStyle(section: PageSection): CSSProperties {
  const style = {
    "--section-grow": String(section.width === "wide" ? 1.28 : section.width === "narrow" ? 0.78 : 1),
  } as CSSProperties;

  if (section.style?.height) {
    return {
      ...style,
      minHeight: `${section.style.height}px`,
    };
  }

  return style;
}

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
    <section
      className="home-workbench"
      style={{ "--home-hero-height": `${hero?.style?.height ?? 430}px` } as CSSProperties}
      aria-label="DuoLe 首页工作台"
    >
      {hero ? (
        <EditableFrame sectionId={hero.id} label="Hero">
          <Hero section={hero} navigate={navigate} notify={notify} />
        </EditableFrame>
      ) : null}
      <section className="module-showcase">
        {modules.map((section) => (
          <EditableFrame key={section.id} sectionId={section.id} label={section.title ?? section.id} style={sectionSizingStyle(section)}>
            <ModuleCard section={section} navigate={navigate} notify={notify} style={sectionSizingStyle(section)} />
          </EditableFrame>
        ))}
      </section>
      {status ? (
        <EditableFrame sectionId={status.id} label="状态条">
          <StatusStrip section={status} />
        </EditableFrame>
      ) : null}
    </section>
  );
}

function firstAction(section: PageSection): PageAction | undefined {
  return section.actions?.[0];
}

function textContent(section: PageSection, key: string) {
  return String(section.content?.[key] ?? "");
}

function Hero({
  section,
  navigate,
  notify,
}: {
  section: PageSection;
  navigate: (pageId: PageId) => void;
  notify: (message: string) => void;
}) {
  return (
    <section
      className="hero"
      style={{ "--hero-image": `url("${section.style?.backgroundImage ?? "/hero-commerce-poster-wide.png"}")` } as CSSProperties}
    >
      <div className="hero-copy">
        <div className="eyebrow">
          <Sparkles aria-hidden="true" />
          {textContent(section, "eyebrow")}
        </div>
        <h1>{textContent(section, "headline")}</h1>
        <p>{textContent(section, "body")}</p>
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

function ModuleCard({
  section,
  navigate,
  notify,
  style,
}: {
  section: PageSection;
  navigate: (pageId: PageId) => void;
  notify: (message: string) => void;
  style?: CSSProperties;
}) {
  const accent = section.style?.accent ?? "neutral";
  const action = firstAction(section);
  const Icon = section.id === "viral-analysis" ? LineChart : section.id === "sku-operations" ? Boxes : Clapperboard;
  const cardClass =
    section.id === "content-production" ? "content" : section.id === "viral-analysis" ? "analysis" : "sku";
  const iconClass = accent === "green" ? "green" : accent === "pink" ? "rose" : "violet";
  const badgeClass = accent === "green" ? "module-badge--green" : accent === "neutral" ? "module-badge--neutral" : "";

  return (
    <article className={`module-card module-card--${cardClass}`} style={style}>
      <div className="module-head">
        <span className={`module-icon module-icon--${iconClass}`}>
          <Icon aria-hidden="true" />
        </span>
        <div>
          <h2>{section.title}</h2>
          <p>{section.subtitle}</p>
        </div>
        <span className={`module-badge ${badgeClass}`}>{textContent(section, "badge")}</span>
      </div>

      {section.id === "content-production" ? <ProductionBody section={section} /> : null}
      {section.id === "viral-analysis" ? <AnalysisBody section={section} /> : null}
      {section.id === "sku-operations" ? <SkuBody section={section} /> : null}

      {action ? (
        <button className="module-cta" onClick={() => runPageAction(action, { navigate, notify })}>
          {textContent(section, "buttonLabel") || action.label}
        </button>
      ) : null}
    </article>
  );
}

function ProductionBody({ section }: { section: PageSection }) {
  return (
    <>
      <div className="production-progress">
        <div className="module-metric-row">
          <strong>{textContent(section, "metricLabel")}</strong>
          <span>{textContent(section, "metricValue")}</span>
        </div>
        <div className="progress-track" aria-label={`脚本生成进度 ${textContent(section, "metricValue")}`}>
          <span />
        </div>
      </div>

      <div className="segment-grid" aria-label="脚本分镜片段">
        {scriptSegments.map((segment) => (
          <div className="segment-tile" key={segment.id}>
            <span>{segment.id}</span>
            <strong>{segment.duration}</strong>
          </div>
        ))}
        <button className="segment-add" aria-label="新增分镜片段">
          +
        </button>
      </div>
    </>
  );
}

function AnalysisBody({ section }: { section: PageSection }) {
  return (
    <>
      <div className="signal-tabs" aria-label="高潜商品信号">
        {categorySignals.map((item) => (
          <button key={item}>{item}</button>
        ))}
      </div>

      <div className="trend-panel">
        <div>
          <span>趋势评分</span>
          <strong>{textContent(section, "trend")}</strong>
        </div>
        <div className="trend-score">{textContent(section, "score")}</div>
      </div>

      <div className="mini-bars" aria-label="趋势小图">
        {[34, 48, 39, 57, 50].map((height, index) => (
          <span style={{ "--bar-height": `${height}px` } as CSSProperties} key={index} />
        ))}
      </div>
    </>
  );
}

function SkuBody({ section }: { section: PageSection }) {
  const rows: Array<[string, string | number | boolean | undefined]> = [
    ["热销", section.content?.hot],
    ["潜力", section.content?.potential],
    ["新品", section.content?.new],
  ];

  return (
    <div className="sku-chart-row">
      <div className="donut-chart" aria-label="SKU 生效分布">
        <div>
          <strong>{textContent(section, "total")}</strong>
          <span>SKU 生效</span>
        </div>
      </div>
      <div className="sku-legend">
        {rows.map(([label, value], index) => (
          <div key={label}>
            <span className={`legend-dot legend-dot--${index + 1}`} />
            <strong>{label}</strong>
            <em>{String(value ?? "")}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusStrip({ section }: { section: PageSection }) {
  return (
    <footer className="status-strip">
      <div className="live-indicator">
        <BadgeCheck aria-hidden="true" />
        {textContent(section, "database")}
      </div>
      <span>{textContent(section, "syncQueue")}</span>
      <span>{textContent(section, "feedback")}</span>
      <span>{textContent(section, "tags")}</span>
      <button>
        <FileText aria-hidden="true" />
        打开任务
      </button>
    </footer>
  );
}
