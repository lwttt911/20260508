import type { CSSProperties } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Clapperboard,
  FileText,
  Flame,
  Image as ImageIcon,
  LineChart,
  Rocket,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { runPageAction } from "../config/pageActions";
import type { PageAction, PageConfig, PageId, PageSection } from "../config/pageTypes";
import { EditableFrame } from "../page-editor/EditableFrame";

function bentoSpanStyle(section: PageSection): CSSProperties {
  // Bento grid: wide = 大卡跨 2 列 × 2 行；normal = 窄卡 2 列 × 1 行；narrow = 单列 × 1 行
  const span =
    section.width === "wide"
      ? { gridColumn: "span 2", gridRow: "span 2" }
      : section.width === "narrow"
        ? { gridColumn: "span 1", gridRow: "span 1" }
        : { gridColumn: "span 2", gridRow: "span 1" };

  const style: CSSProperties = {
    ...span,
  };

  if (section.style?.height) {
    style.minHeight = `${section.style.height}px`;
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

  if (import.meta.env.DEV) {
    const known = new Set(["hero", "module-showcase", "status-strip"]);
    for (const section of sections) {
      if (!known.has(section.type)) {
        // eslint-disable-next-line no-console
        console.warn(
          `[HomePageRenderer] section "${section.id}" has type "${section.type}" which is not supported on the home layout and will be ignored.`,
        );
      }
    }
  }

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
      <section className="bento-grid" aria-label="模块快捷区">
        {modules.map((section) => {
          const span = bentoSpanStyle(section);
          return (
            <EditableFrame
              key={section.id}
              sectionId={section.id}
              label={section.title ?? section.id}
              style={span}
            >
              <ModuleCard section={section} navigate={navigate} notify={notify} style={span} />
            </EditableFrame>
          );
        })}
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

function resolveAssetUrl(path: string): string {
  // 绝对 URL 原样返回
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  // 否则按 Vite 的 BASE_URL 前缀拼接，避免 /20260508/ 子路径部署下 404
  const base = import.meta.env.BASE_URL ?? "/";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
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
  const heroBg = resolveAssetUrl(section.style?.backgroundImage ?? "/hero-new.webp");
  return (
    <section
      className="hero"
      style={{ "--hero-image": `url("${heroBg}")` } as CSSProperties}
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
  const isWide = section.width === "wide";

  return (
    <article className={`bento-card bento-card--${cardClass} ${isWide ? "bento-card--wide" : ""}`} style={style}>
      <header className="bento-head">
        <span className={`module-icon module-icon--${iconClass}`}>
          <Icon aria-hidden="true" />
        </span>
        <div className="bento-head-text">
          <h2>{section.title}</h2>
          {section.id === "content-production" ? <small>脚本 · 分镜 · 图生</small> : null}
          {section.id === "viral-analysis" ? <small>趋势 · 因子</small> : null}
          {section.id === "sku-operations" ? <small>库存 · 投放</small> : null}
        </div>
        {action ? (
          <button className="bento-cta" onClick={() => runPageAction(action, { navigate, notify })}>
            {textContent(section, "buttonLabel") || action.label}
            <ArrowRight aria-hidden="true" />
          </button>
        ) : null}
      </header>

      {section.id === "content-production" ? <ProductionBody section={section} /> : null}
      {section.id === "viral-analysis" ? <AnalysisBody section={section} /> : null}
      {section.id === "sku-operations" ? <SkuBody section={section} /> : null}
    </article>
  );
}

function ProductionBody({ section }: { section: PageSection }) {
  const value = textContent(section, "metricValue");
  const percent = Number.parseFloat(value) || 0;
  const queueScript = String(section.content?.queueScript ?? 0);
  const queueImage = String(section.content?.queueImage ?? 0);
  const queueReview = String(section.content?.queueReview ?? 0);

  return (
    <div className="bento-body bento-body--split">
      <div className="bento-tile bento-tile--hero">
        <span className="bento-tile-label">{textContent(section, "metricLabel")}</span>
        <strong className="bento-tile-value">{value}</strong>
        <div className="progress-track" aria-label={`脚本生成进度 ${value}`}>
          <span style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
        </div>
        <em className="bento-tile-note">{textContent(section, "note")}</em>
      </div>

      <div className="bento-subgrid">
        <div className="bento-tile bento-tile--sm">
          <span className="bento-tile-label">
            <FileText aria-hidden="true" />
            脚本
          </span>
          <strong>{queueScript}</strong>
        </div>
        <div className="bento-tile bento-tile--sm">
          <span className="bento-tile-label">
            <ImageIcon aria-hidden="true" />
            图生
          </span>
          <strong>{queueImage}</strong>
        </div>
        <div className="bento-tile bento-tile--sm">
          <span className="bento-tile-label">
            <BadgeCheck aria-hidden="true" />
            待审
          </span>
          <strong>{queueReview}</strong>
        </div>
        <div className="bento-tile bento-tile--next">
          <span className="bento-tile-label">
            <Zap aria-hidden="true" />
            下一个任务
          </span>
          <strong className="bento-tile-next-title">{textContent(section, "nextTask")}</strong>
          <em className="bento-tile-note">{textContent(section, "eta")}</em>
        </div>
      </div>
    </div>
  );
}

function AnalysisBody({ section }: { section: PageSection }) {
  return (
    <div className="bento-body bento-body--row">
      <div className="bento-tile bento-tile--score">
        <span className="bento-tile-label">
          <TrendingUp aria-hidden="true" />
          爆款指数
        </span>
        <strong className="bento-tile-value">{textContent(section, "score")}</strong>
        <em className="bento-tile-trend">{textContent(section, "trend")}</em>
      </div>
      <div className="bento-tile bento-tile--chart">
        <div className="mini-bars" aria-label="趋势小图">
          {[34, 48, 39, 57, 50, 44, 62].map((height, index) => (
            <span style={{ "--bar-height": `${height}px` } as CSSProperties} key={index} />
          ))}
        </div>
        <div className="bento-top-row">
          <Flame aria-hidden="true" />
          <strong>{textContent(section, "top1Title")}</strong>
          <em>{textContent(section, "top1Score")}</em>
        </div>
      </div>
    </div>
  );
}

function SkuBody({ section }: { section: PageSection }) {
  const hot = String(section.content?.hot ?? "");
  const potential = String(section.content?.potential ?? "");
  const fresh = String(section.content?.new ?? "");

  return (
    <div className="bento-body bento-body--row">
      <div className="bento-tile bento-tile--score">
        <span className="bento-tile-label">{textContent(section, "metricLabel")}</span>
        <strong className="bento-tile-value">{textContent(section, "total")}</strong>
        <em className="bento-tile-trend">
          GMV {textContent(section, "gmvToday")} · {textContent(section, "gmvDelta")}
        </em>
      </div>
      <div className="bento-tile bento-tile--legend">
        <div className="sku-legend-row">
          <span className="legend-dot legend-dot--1" aria-hidden="true" />
          <span className="sku-legend-label">热销</span>
          <strong>{hot}</strong>
        </div>
        <div className="sku-legend-row">
          <span className="legend-dot legend-dot--2" aria-hidden="true" />
          <span className="sku-legend-label">潜力</span>
          <strong>{potential}</strong>
        </div>
        <div className="sku-legend-row">
          <span className="legend-dot legend-dot--3" aria-hidden="true" />
          <span className="sku-legend-label">新品</span>
          <strong>{fresh}</strong>
        </div>
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
