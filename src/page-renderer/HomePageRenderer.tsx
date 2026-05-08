import type { CSSProperties } from "react";
import { ArrowRight, BadgeCheck, Boxes, Clapperboard, FileText, LineChart, Rocket, Sparkles } from "lucide-react";
import { runPageAction } from "../config/pageActions";
import type { PageAction, PageConfig, PageId, PageSection } from "../config/pageTypes";
import { EditableFrame } from "../page-editor/EditableFrame";

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

  return (
    <article className={`module-card module-card--${cardClass}`} style={style}>
      <div className="module-head">
        <span className={`module-icon module-icon--${iconClass}`}>
          <Icon aria-hidden="true" />
        </span>
        <h2>{section.title}</h2>
      </div>

      {section.id === "content-production" ? <ProductionBody section={section} /> : null}
      {section.id === "viral-analysis" ? <AnalysisBody section={section} /> : null}
      {section.id === "sku-operations" ? <SkuBody section={section} /> : null}

      {action ? (
        <button className="module-cta" onClick={() => runPageAction(action, { navigate, notify })}>
          {textContent(section, "buttonLabel") || action.label}
          <ArrowRight aria-hidden="true" />
        </button>
      ) : null}
    </article>
  );
}

function ProductionBody({ section }: { section: PageSection }) {
  const value = textContent(section, "metricValue");
  const percent = Number.parseFloat(value) || 0;
  return (
    <div className="module-body">
      <div className="module-stat">{value}</div>
      <div className="module-note">
        {textContent(section, "metricLabel")}
        <span className="module-note-sep" aria-hidden="true">·</span>
        {textContent(section, "note")}
      </div>
      <div className="progress-track" aria-label={`脚本生成进度 ${value}`}>
        <span style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
      </div>
    </div>
  );
}

function AnalysisBody({ section }: { section: PageSection }) {
  return (
    <div className="module-body">
      <div className="module-stat">{textContent(section, "score")}</div>
      <div className="module-note">
        趋势 {textContent(section, "trend")}
        <span className="module-note-sep" aria-hidden="true">·</span>
        {textContent(section, "note")}
      </div>
      <div className="mini-bars" aria-label="趋势小图">
        {[34, 48, 39, 57, 50].map((height, index) => (
          <span style={{ "--bar-height": `${height}px` } as CSSProperties} key={index} />
        ))}
      </div>
    </div>
  );
}

function SkuBody({ section }: { section: PageSection }) {
  const hot = String(section.content?.hot ?? "");
  const potential = String(section.content?.potential ?? "");
  const fresh = String(section.content?.new ?? "");

  return (
    <div className="module-body">
      <div className="module-stat">{textContent(section, "total")}</div>
      <div className="module-note">{textContent(section, "metricLabel")}</div>
      <dl className="sku-legend-inline" aria-label="SKU 分布">
        <div>
          <span className="legend-dot legend-dot--1" aria-hidden="true" />
          <dt>热销</dt>
          <dd>{hot}</dd>
        </div>
        <div>
          <span className="legend-dot legend-dot--2" aria-hidden="true" />
          <dt>潜力</dt>
          <dd>{potential}</dd>
        </div>
        <div>
          <span className="legend-dot legend-dot--3" aria-hidden="true" />
          <dt>新品</dt>
          <dd>{fresh}</dd>
        </div>
      </dl>
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
