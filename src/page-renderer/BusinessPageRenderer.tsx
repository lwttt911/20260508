import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  Clock,
  ClipboardList,
  Database,
  FileText,
  Filter,
  Image,
  Layers,
  LineChart,
  Link,
  ListChecks,
  Play,
  Plus,
  Search,
  Sparkles,
  Tags,
  Upload,
  WandSparkles,
} from "lucide-react";
import { runPageAction } from "../config/pageActions";
import type { FieldConfig, PageConfig, PageId, PageSection } from "../config/pageTypes";
import { EditableFrame } from "../page-editor/EditableFrame";

export function BusinessPageRenderer({
  config,
  navigate,
  notify,
}: {
  config: PageConfig;
  navigate: (pageId: PageId) => void;
  notify: (message: string) => void;
}) {
  if (config.pageId === "viral-analysis") {
    return <ViralAnalysisTaskPage config={config} notify={notify} />;
  }

  if (config.pageId === "ai-content") {
    return <AiContentMockupPage config={config} notify={notify} />;
  }

  if (config.pageId === "sku") {
    return <SkuOperationsMockupPage config={config} notify={notify} />;
  }

  return <GenericBusinessPage config={config} navigate={navigate} notify={notify} />;
}

function FeatureHeader({
  eyebrow,
  title,
  subtitle,
  primary,
  secondary,
  icon,
  onPrimary,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primary: string;
  secondary: string;
  icon: React.ReactNode;
  onPrimary: () => void;
}) {
  return (
    <header className="feature-header">
      <div className="feature-title-block">
        <span className="feature-eyebrow">
          {icon}
          {eyebrow}
        </span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="feature-header-actions">
        <button className="feature-secondary-action">
          <Search aria-hidden="true" />
          {secondary}
        </button>
        <button className="feature-primary-action" onClick={onPrimary}>
          <Plus aria-hidden="true" />
          {primary}
        </button>
      </div>
    </header>
  );
}

function MetricRail({ items }: { items: Array<{ label: string; value: string; tone?: "cyan" | "green" | "amber" }> }) {
  return (
    <div className="metric-rail">
      {items.map((item) => (
        <div className={`metric-tile metric-tile--${item.tone ?? "cyan"}`} key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function StepRail({ steps }: { steps: Array<{ label: string; state: "done" | "active" | "next" }> }) {
  return (
    <div className="flow-step-rail">
      {steps.map((step, index) => (
        <div className={`flow-step flow-step--${step.state}`} key={step.label}>
          <span>{index + 1}</span>
          <strong>{step.label}</strong>
        </div>
      ))}
    </div>
  );
}

function StudioHeader({
  eyebrow,
  title,
  subtitle,
  primary,
  secondary,
  icon,
  onPrimary,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primary: string;
  secondary: string;
  icon: React.ReactNode;
  onPrimary: () => void;
}) {
  return (
    <header className="studio-header">
      <div className="studio-title-block">
        <span className="studio-eyebrow">
          {icon}
          {eyebrow}
        </span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="studio-actions">
        <button className="studio-secondary-action">
          <Search aria-hidden="true" />
          {secondary}
        </button>
        <button className="studio-primary-action" onClick={onPrimary}>
          {primary}
          <RocketGlyph />
        </button>
      </div>
    </header>
  );
}

function RocketGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M14.8 4.5c1.9-.7 3.6-.7 4.7-.4.3 1.1.3 2.8-.4 4.7-.7 1.9-2.1 3.9-4.4 5.9l-.5 3.4-2.2 1.3-1.1-3.3-3-3-3.3-1.1 1.3-2.2 3.4-.5c2-2.3 4-3.7 5.9-4.4Z" />
      <path d="M5.4 18.6c.8-2.2 1.9-3.3 4.1-4.1-.8 2.2-1.9 3.3-4.1 4.1Z" />
    </svg>
  );
}

function StudioStats({ items }: { items: Array<{ label: string; value: string; helper: string }> }) {
  return (
    <div className="studio-stats">
      {items.map((item) => (
        <div className="studio-stat" key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
          <em>{item.helper}</em>
        </div>
      ))}
    </div>
  );
}

function StudioStepLine({ items }: { items: Array<{ label: string; state: "done" | "active" | "next" }> }) {
  return (
    <div className="studio-step-line">
      {items.map((item, index) => (
        <div className={`studio-step studio-step--${item.state}`} key={item.label}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{item.label}</strong>
        </div>
      ))}
    </div>
  );
}

function StudioPanelTitle({ icon, title, meta }: { icon: React.ReactNode; title: string; meta: string }) {
  return (
    <div className="studio-panel-title">
      <span>{icon}</span>
      <div>
        <h2>{title}</h2>
        <p>{meta}</p>
      </div>
    </div>
  );
}

const viralSummary = [
  ["已上传", "128"],
  ["自动分段中", "6"],
  ["待确认分段", "3"],
  ["已锁定", "18"],
  ["已完成", "119"],
  ["今日新增", "8"],
];

const viralTasks = [
  ["VID-042", "折叠收纳盒反差开箱", "家居收纳", "今天 14:32", "待确认分段", "48"],
  ["VID-041", "宠物梳毛器清洁对比", "宠物用品", "今天 13:18", "AI 拆解中", "76"],
  ["VID-040", "厨房沥水架空间整理", "厨房用品", "今天 11:54", "FFmpeg 自动分段", "32"],
  ["VID-039", "无线补光灯桌搭演示", "数码配件", "昨天 18:20", "分段锁定", "58"],
  ["VID-038", "透明标签收纳盒", "家居收纳", "昨天 16:45", "已完成", "100"],
];

const viralFlowSteps = ["上传视频", "FFmpeg 自动分段", "待确认分段", "分段锁定", "AI 拆解中", "已完成"];

const segmentRows = [
  ["A001-1", "00:00-00:04", "4.0s", "待确认"],
  ["A001-2", "00:04-00:12", "8.0s", "待确认"],
  ["A001-3", "00:12-00:24", "12.0s", "待确认"],
  ["A001-4", "00:24-00:42", "18.0s", "待确认"],
];

function ViralAnalysisTaskPage({ config, notify }: { config: PageConfig; notify: (message: string) => void }) {
  const [showSegmentConfirmation, setShowSegmentConfirmation] = useState(() => window.location.search.includes("view=segments"));
  const overview = config.layout.sections.find((section) => section.id === "overview");
  const openSegmentConfirmation = () => {
    setShowSegmentConfirmation(true);
    window.history.pushState({}, "", "/viral-analysis?view=segments");
  };
  const closeSegmentConfirmation = () => {
    setShowSegmentConfirmation(false);
    window.history.pushState({}, "", "/viral-analysis");
  };

  if (showSegmentConfirmation) {
    return (
      <SegmentConfirmationView
        onBack={closeSegmentConfirmation}
        onRelice={() => notify("已提交重新切片任务")}
        onLock={() => {
          notify("分段已锁定，已进入 AI 拆解队列");
          closeSegmentConfirmation();
        }}
      />
    );
  }

  return (
    <section className="viral-task-page">
      <EditableFrame sectionId={overview?.id ?? "overview"} label="爆款分析任务页头">
        <header className="viral-task-header">
          <div>
            <span className="viral-page-kicker">
              <Play aria-hidden="true" />
              Video Breakdown Queue
            </span>
            <h1>爆款分析</h1>
            <p>视频上传后自动进入拆解队列，查看进度、数量和完成状态。</p>
          </div>
        </header>
      </EditableFrame>

      <div className="viral-task-topline">
        <article className="viral-upload-station">
          <div className="viral-upload-icon">
            <Upload aria-hidden="true" />
          </div>
          <div>
            <h2>上传视频进入拆解队列</h2>
            <p>支持 MP4 / MOV，上传后先由 FFmpeg 自动分段，再进入人工确认。</p>
          </div>
          <button className="viral-gradient-button" onClick={() => notify("打开视频上传")}>
            上传爆款视频
            <RocketGlyph />
          </button>
        </article>

        <aside className="viral-flow-panel">
          <div className="viral-panel-heading">
            <strong>拆解流程</strong>
            <span>确认分段后才会触发 AI</span>
          </div>
          <div className="viral-flow-steps">
            {viralFlowSteps.map((step, index) => (
              <div className={`viral-flow-step ${step === "待确认分段" ? "is-actionable" : ""}`} key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
                {step === "待确认分段" ? (
                  <button onClick={openSegmentConfirmation}>去确认</button>
                ) : null}
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="viral-summary-strip" aria-label="爆款分析任务数量">
        {viralSummary.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <article className="viral-queue-panel">
        <div className="viral-panel-heading">
          <strong>视频拆解进度</strong>
          <span>只展示进度与人工处理入口，不展示拆解详情。</span>
        </div>
        <div className="viral-task-table">
          <div className="viral-task-row viral-task-row--head">
            <span>视频名称 / ID</span>
            <span>类目</span>
            <span>上传时间</span>
            <span>当前阶段</span>
            <span>进度</span>
            <span>操作</span>
          </div>
          {viralTasks.map(([id, name, category, uploadTime, stage, progress]) => (
            <div className="viral-task-row" key={id}>
              <span>
                <strong>{name}</strong>
                <em>{id}</em>
              </span>
              <span>{category}</span>
              <span>{uploadTime}</span>
              <span>
                <mark className={stage === "待确认分段" ? "is-waiting" : stage === "已完成" ? "is-done" : ""}>{stage}</mark>
              </span>
              <span>
                <i>
                  <b style={{ "--progress": `${progress}%` } as React.CSSProperties} />
                </i>
                <em>{progress}%</em>
              </span>
              <span>
                {stage === "待确认分段" ? (
                  <button className="viral-row-action" onClick={openSegmentConfirmation}>
                    确认分段
                  </button>
                ) : (
                  <button className="viral-row-action viral-row-action--quiet">查看状态</button>
                )}
              </span>
            </div>
          ))}
        </div>
      </article>

      <footer className="viral-sync-strip">
        <span>
          <Database aria-hidden="true" />
          本地数据库为准
        </span>
        <span>Feishu 同步队列：2 项</span>
        <span>分段锁定后自动进入 AI 拆解</span>
      </footer>
    </section>
  );
}

function SegmentConfirmationView({
  onBack,
  onRelice,
  onLock,
}: {
  onBack: () => void;
  onRelice: () => void;
  onLock: () => void;
}) {
  return (
    <section className="segment-confirmation-page">
      <header className="segment-confirmation-header">
        <div>
          <span className="viral-page-kicker">
            <Clock aria-hidden="true" />
            爆款分析 / 待确认分段
          </span>
          <h1>人工确认分段</h1>
          <p>检查 FFmpeg 自动切出的片段，确认无误后锁定分段并进入 AI 拆解。</p>
        </div>
        <div className="segment-stage-line">
          {["上传完成", "自动分段", "待确认分段", "分段锁定", "AI 拆解"].map((step, index) => (
            <span className={index === 2 ? "is-current" : index < 2 ? "is-done" : ""} key={step}>
              {step}
            </span>
          ))}
        </div>
      </header>

      <div className="segment-confirmation-layout">
        <article className="segment-video-panel">
          <div className="segment-video-preview">
            <Play aria-hidden="true" />
            <strong>VID-042</strong>
            <span>折叠收纳盒反差开箱</span>
          </div>
          <div className="segment-scrubber">
            <span />
          </div>
          <div className="segment-block-strip" aria-label="自动切片结果">
            {segmentRows.map(([id, range, duration]) => (
              <button key={id}>
                <strong>{id}</strong>
                <span>{range}</span>
                <em>{duration}</em>
              </button>
            ))}
          </div>
        </article>

        <aside className="segment-list-panel">
          <div className="viral-panel-heading">
            <strong>分段列表</strong>
            <span>人工检查，可预览和调整。</span>
          </div>
          <div className="segment-list">
            {segmentRows.map(([id, range, duration, state]) => (
              <div key={id}>
                <span>
                  <strong>{id}</strong>
                  <em>{range}</em>
                </span>
                <span>{duration}</span>
                <mark>{state}</mark>
                <button>预览</button>
                <button>调整</button>
              </div>
            ))}
          </div>
          <div className="segment-lock-note">
            <BadgeCheck aria-hidden="true" />
            <p>确认后进入分段锁定；如需重切，必须先解锁，已有 AI 输出将标记作废。</p>
          </div>
        </aside>
      </div>

      <footer className="segment-action-bar">
        <button className="segment-secondary-button" onClick={onBack}>
          返回列表
        </button>
        <button className="segment-secondary-button" onClick={onRelice}>
          重新切片
        </button>
        <button className="viral-gradient-button" onClick={onLock}>
          确认并锁定分段
          <RocketGlyph />
        </button>
      </footer>
    </section>
  );
}

function ViralAnalysisMockupPage({ config, notify }: { config: PageConfig; notify: (message: string) => void }) {
  const overview = config.layout.sections.find((section) => section.id === "overview");

  return (
    <section className="studio-page studio-page--analysis">
      <EditableFrame sectionId={overview?.id ?? "overview"} label="爆款分析图稿页头">
        <StudioHeader
          eyebrow="Viral Evidence Lab"
          title="爆款分析工作台"
          subtitle="像剪辑台一样拆爆款：先看画面证据，再做结构判断，最后把能复用的因子沉淀给 SKU 生产。"
          primary="导入爆热视频"
          secondary="搜索记录"
          icon={<Play aria-hidden="true" />}
          onPrimary={() => notify("打开爆热视频导入流程")}
        />
      </EditableFrame>

      <StudioStats
        items={[
          { label: "待拆解视频", value: "6", helper: "2 条已进入证据补齐" },
          { label: "因子候选", value: "14", helper: "9 条可进入复用库" },
          { label: "结构命中", value: "88%", helper: "A1-A5 平均可信度" },
          { label: "可投产 SKU", value: "3", helper: "已匹配 TOP 组合" },
        ]}
      />

      <StudioStepLine
        items={[
          { label: "导入视频", state: "done" },
          { label: "分段证据", state: "active" },
          { label: "结构判断", state: "next" },
          { label: "因子沉淀", state: "next" },
          { label: "进入生产", state: "next" },
        ]}
      />

      <div className="studio-analysis-layout">
        <article className="studio-panel studio-reel-lab">
          <StudioPanelTitle icon={<Upload aria-hidden="true" />} title="视频证据台" meta="VID-042 / 00:42" />
          <div className="reel-workspace">
            <div className="reel-stage">
              <div className="reel-phone">
                <Play aria-hidden="true" />
                <span>00:18 / 00:42</span>
              </div>
              <div className="reel-waveform" aria-hidden="true">
                {[42, 64, 35, 72, 52, 80, 46, 58, 76, 40, 66, 48].map((height, index) => (
                  <span style={{ "--wave-height": `${height}%` } as React.CSSProperties} key={index} />
                ))}
              </div>
            </div>
            <div className="evidence-feed">
              {[
                ["00:03", "开场反差", "杂乱桌面切到整齐收纳，3 秒内完成视觉钩子。"],
                ["00:12", "痛点证据", "抽屉翻找失败，评论区高频词对应“找不到小物”。"],
                ["00:27", "商品可信", "手部演示承重、标签透明度、折叠体积。"],
                ["00:36", "转化口播", "多件装价格锚点，提示评论区关键词。"],
              ].map(([time, title, body], index) => (
                <button className={index === 1 ? "is-selected" : ""} key={time}>
                  <em>{time}</em>
                  <strong>{title}</strong>
                  <span>{body}</span>
                </button>
              ))}
            </div>
          </div>
        </article>

        <aside className="studio-panel studio-decision-panel">
          <StudioPanelTitle icon={<ListChecks aria-hidden="true" />} title="结构判断" meta="观察与判断分开显示" />
          <div className="structure-score">
            <strong>88</strong>
            <span>可复用结构分</span>
          </div>
          <div className="structure-tags">
            {["A1 强钩子", "A2 痛点明确", "A3 展示可信", "A4 价格信号", "A5 复用潜力"].map((item, index) => (
              <span className={index < 3 ? "is-strong" : ""} key={item}>
                {item}
              </span>
            ))}
          </div>
          <div className="factor-inbox">
            {["反差清洁瞬间", "低价多件装", "评论区追问材质"].map((item) => (
              <div key={item}>
                <Tags aria-hidden="true" />
                <strong>{item}</strong>
                <button>入库</button>
              </div>
            ))}
          </div>
        </aside>

        <article className="studio-panel studio-timeline-panel">
          <StudioPanelTitle icon={<Clock aria-hidden="true" />} title="分析队列" meta="本地 DB 为准，Feishu 延后同步" />
          <div className="timeline-lanes">
            {[
              ["VID-039", "结构判断", "12m"],
              ["VID-040", "分段中", "24m"],
              ["VID-041", "人工确认", "35m"],
              ["VID-042", "证据补齐", "现在"],
            ].map(([id, state, time]) => (
              <div key={id}>
                <strong>{id}</strong>
                <span>{state}</span>
                <em>{time}</em>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function AiContentMockupPage({ config, notify }: { config: PageConfig; notify: (message: string) => void }) {
  const overview = config.layout.sections.find((section) => section.id === "overview");

  return (
    <section className="studio-page studio-page--content">
      <EditableFrame sectionId={overview?.id ?? "overview"} label="AI 内容生产图稿页头">
        <StudioHeader
          eyebrow="Script & Prompt Factory"
          title="AI 内容生产画布"
          subtitle="把 SKU、TOP 因子、脚本、分镜 Prompt 和发布包放在一个可编辑画布里，像设计工具一样生产内容。"
          primary="生成新脚本"
          secondary="查找任务"
          icon={<WandSparkles aria-hidden="true" />}
          onPrimary={() => notify("打开脚本生成任务")}
        />
      </EditableFrame>

      <StudioStats
        items={[
          { label: "待生成脚本", value: "7", helper: "4 条来自潜力 SKU" },
          { label: "待确认分镜", value: "3", helper: "需要人工过目" },
          { label: "可发布包", value: "5", helper: "素材已齐" },
          { label: "Prompt 模板", value: "18", helper: "按品类沉淀" },
        ]}
      />

      <div className="studio-content-layout">
        <aside className="studio-panel content-input-panel">
          <StudioPanelTitle icon={<Boxes aria-hidden="true" />} title="生产输入" meta="SKU + TOP 因子" />
          <div className="content-sku-card">
            <span>当前 SKU</span>
            <strong>折叠收纳盒 3 件套</strong>
            <p>家居收纳 / 低价组合 / 库存 184</p>
            <button>切换 SKU</button>
          </div>
          <div className="content-factor-stack">
            {["反差开场", "价格锚点", "材质追问"].map((item, index) => (
              <div key={item}>
                <em>TOP{index + 1}</em>
                <strong>{item}</strong>
                <span>已锁定</span>
              </div>
            ))}
          </div>
        </aside>

        <article className="studio-panel content-canvas-panel">
          <StudioPanelTitle icon={<FileText aria-hidden="true" />} title="脚本画布" meta="4 段结构，可继续拆分镜" />
          <div className="canvas-toolbar">
            {["脚本", "分镜", "Prompt", "发布包"].map((item, index) => (
              <button className={index === 0 ? "is-active" : ""} key={item}>
                {item}
              </button>
            ))}
          </div>
          <div className="script-canvas">
            {[
              ["01", "3 秒钩子", "用一组桌面混乱与收纳后的对比开场。"],
              ["02", "痛点证据", "强调找不到小物、抽屉堆积、搬家整理难。"],
              ["03", "商品展示", "展示折叠、承重、透明标签三点。"],
              ["04", "转化口播", "多件装价格锚点，提示评论区关键词。"],
            ].map(([id, title, body]) => (
              <section key={id}>
                <span>{id}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              </section>
            ))}
          </div>
        </article>

        <aside className="studio-panel content-output-panel">
          <StudioPanelTitle icon={<Sparkles aria-hidden="true" />} title="发布包预览" meta="Prompt 与素材状态" />
          <div className="publish-preview">
            <Image aria-hidden="true" />
            <strong>主图 Prompt</strong>
            <span>收纳前后对比，干净白底，强调透明标签。</span>
          </div>
          <div className="publish-preview">
            <LineChart aria-hidden="true" />
            <strong>分镜 Prompt</strong>
            <span>4 段镜头，俯拍、手部演示、字幕节奏。</span>
          </div>
          <button className="studio-secondary-action">查看全部 Prompt</button>
        </aside>
      </div>
    </section>
  );
}

function SkuOperationsMockupPage({ config, notify }: { config: PageConfig; notify: (message: string) => void }) {
  const overview = config.layout.sections.find((section) => section.id === "overview");

  return (
    <section className="studio-page studio-page--sku">
      <EditableFrame sectionId={overview?.id ?? "overview"} label="SKU 运营图稿页头">
        <StudioHeader
          eyebrow="SKU Operations"
          title="SKU 运营战情板"
          subtitle="把商品档案、库存风险、内容产能和回流结果放在同一张运营地图里，避免 SKU 与内容生产断开。"
          primary="新增 SKU"
          secondary="筛选 SKU"
          icon={<Boxes aria-hidden="true" />}
          onPrimary={() => notify("打开新增 SKU 抽屉")}
        />
      </EditableFrame>

      <StudioStats
        items={[
          { label: "SKU 生效", value: "35", helper: "已进入运营池" },
          { label: "潜力 SKU", value: "15", helper: "因子匹配强" },
          { label: "低库存", value: "4", helper: "先控内容放量" },
          { label: "待生产内容", value: "11", helper: "脚本或素材未齐" },
        ]}
      />

      <div className="studio-sku-layout">
        <article className="studio-panel sku-command-panel">
          <StudioPanelTitle icon={<Filter aria-hidden="true" />} title="商品运营地图" meta="按策略分层执行" />
          <div className="sku-card-row">
            {[
              ["折叠收纳盒 3 件套", "潜力", "脚本生成中"],
              ["宠物梳毛器", "热销", "低库存，待裂变"],
              ["厨房沥水架", "新品", "待匹配因子"],
            ].map(([name, tier, state], index) => (
              <button className={index === 0 ? "is-selected" : ""} key={name}>
                <span>{tier}</span>
                <strong>{name}</strong>
                <em>{state}</em>
              </button>
            ))}
          </div>
          <div className="ops-map">
            {[
              ["补库存提醒", "宠物梳毛器低库存，先暂停裂变放量"],
              ["内容排期", "折叠收纳盒安排 3 条短视频脚本"],
              ["回流复盘", "无线补光灯待录入 2 条发布结果"],
              ["新品验证", "厨房沥水架先跑结构验证，再进入放量"],
            ].map(([label, value]) => (
              <div key={label}>
                <strong>{label}</strong>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </article>

        <aside className="studio-panel sku-focus-panel">
          <StudioPanelTitle icon={<BadgeCheck aria-hidden="true" />} title="当前 SKU" meta="内容链路" />
          <div className="sku-focus-card">
            <strong>折叠收纳盒 3 件套</strong>
            <span>家居收纳 / 低价多件装 / 本地库存 184</span>
            <button onClick={() => notify("进入该 SKU 的内容生产")}>进入生产</button>
          </div>
          <div className="sku-focus-signals">
            {[
              ["匹配因子", "反差开箱、价格锚点"],
              ["TOP 组合", "TOP1 + TOP3"],
              ["内容结果", "2 条发布，1 条待回流"],
              ["Feishu 同步", "队列中 1 项"],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </aside>

        <article className="studio-panel sku-pipeline-panel">
          <StudioPanelTitle icon={<Link aria-hidden="true" />} title="SKU 内容链路" meta="从档案到回流" />
          <div className="pipeline-strip">
            {["SKU 档案", "匹配因子", "脚本生成", "发布记录", "效果回流"].map((item, index) => (
              <div key={item}>
                {index < 3 ? <CheckCircle2 aria-hidden="true" /> : <Clock aria-hidden="true" />}
                <span>{item}</span>
                {index < 4 ? <ArrowRight aria-hidden="true" /> : null}
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function ViralAnalysisPage({ config, notify }: { config: PageConfig; notify: (message: string) => void }) {
  const overview = config.layout.sections.find((section) => section.id === "overview");

  return (
    <section className="feature-page feature-page--analysis">
      <EditableFrame sectionId={overview?.id ?? "overview"} label="爆款分析页头">
        <FeatureHeader
          eyebrow="Viral Evidence Lab"
          title="爆款分析工作台"
          subtitle="先拆证据，再做结构判断，把可复用因子沉淀到后续 SKU 生产链路。"
          primary="导入视频"
          secondary="搜索记录"
          icon={<Play aria-hidden="true" />}
          onPrimary={() => notify("打开导入视频流程")}
        />
      </EditableFrame>

      <MetricRail
        items={[
          { label: "待分析视频", value: "6" },
          { label: "处理中", value: "2", tone: "amber" },
          { label: "新因子候选", value: "14", tone: "green" },
          { label: "可进入生产", value: "3" },
        ]}
      />

      <StepRail
        steps={[
          { label: "导入视频", state: "done" },
          { label: "分段证据", state: "active" },
          { label: "结构判断", state: "next" },
          { label: "因子沉淀", state: "next" },
          { label: "进入生产", state: "next" },
        ]}
      />

      <div className="analysis-grid">
        <article className="feature-panel video-evidence-panel">
          <PanelTitle icon={<Upload aria-hidden="true" />} title="视频证据" meta="当前样本 VID-042" />
          <div className="video-review">
            <div className="phone-frame">
              <div className="phone-video">
                <Play aria-hidden="true" />
                <span>00:18 / 00:42</span>
              </div>
            </div>
            <div className="segment-stack">
              {["开场钩子：反差动作", "痛点证据：收纳前后", "购买信号：评论高频词", "转化口播：价格锚点"].map((item, index) => (
                <button className={index === 1 ? "is-active" : ""} key={item}>
                  <span>0{index + 1}</span>
                  {item}
                </button>
              ))}
            </div>
          </div>
        </article>

        <article className="feature-panel judgement-panel">
          <PanelTitle icon={<ListChecks aria-hidden="true" />} title="结构判断" meta="A1-A5 证据链" />
          <div className="judgement-matrix">
            {[
              ["A1", "强钩子", "92"],
              ["A2", "痛点明确", "86"],
              ["A3", "展示可信", "78"],
              ["A4", "价格信号", "81"],
              ["A5", "复用潜力", "88"],
            ].map(([tag, label, score]) => (
              <div key={tag}>
                <span>{tag}</span>
                <strong>{label}</strong>
                <em>{score}</em>
              </div>
            ))}
          </div>
          <div className="factor-candidate-list">
            {["反差清洁瞬间", "低价多件装", "评论区追问材质"].map((item) => (
              <div key={item}>
                <Tags aria-hidden="true" />
                <span>{item}</span>
                <button>入库</button>
              </div>
            ))}
          </div>
        </article>

        <aside className="feature-panel queue-panel">
          <PanelTitle icon={<Clock aria-hidden="true" />} title="分析队列" meta="本地 DB 为准" />
          <div className="queue-list">
            {[
              ["VID-039", "待结构判断", "12m"],
              ["VID-040", "分段中", "24m"],
              ["VID-041", "待人工确认", "35m"],
              ["VID-042", "证据补齐", "现在"],
            ].map(([id, state, time]) => (
              <div key={id}>
                <strong>{id}</strong>
                <span>{state}</span>
                <em>{time}</em>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <article className="feature-panel factor-table-panel">
        <PanelTitle icon={<Database aria-hidden="true" />} title="新因子候选" meta="审核后进入因子库" />
        <DataRows
          columns={["因子", "证据片段", "适用品类", "建议动作"]}
          rows={[
            ["反差开箱", "S02 00:08", "家居收纳", "进入 TOP 组合"],
            ["价格锚点", "S04 00:31", "小件百货", "待人工验证"],
            ["材质追问", "评论 184 条", "厨房用品", "补充证据"],
          ]}
        />
      </article>
    </section>
  );
}

function AiContentPage({ config, notify }: { config: PageConfig; notify: (message: string) => void }) {
  const overview = config.layout.sections.find((section) => section.id === "overview");

  return (
    <section className="feature-page feature-page--content">
      <EditableFrame sectionId={overview?.id ?? "overview"} label="AI 内容生产页头">
        <FeatureHeader
          eyebrow="Script & Prompt Factory"
          title="AI 内容生产"
          subtitle="从 SKU、TOP 因子组合和素材约束生成脚本、分镜、Prompt 与发布包。"
          primary="生成新脚本"
          secondary="查找任务"
          icon={<WandSparkles aria-hidden="true" />}
          onPrimary={() => notify("打开脚本生成任务")}
        />
      </EditableFrame>

      <MetricRail
        items={[
          { label: "待生成脚本", value: "7" },
          { label: "待确认分镜", value: "3", tone: "amber" },
          { label: "可发布包", value: "5", tone: "green" },
          { label: "Prompt 模板", value: "18" },
        ]}
      />

      <StepRail
        steps={[
          { label: "选 SKU", state: "done" },
          { label: "套 TOP 组合", state: "done" },
          { label: "生成脚本", state: "active" },
          { label: "分镜 Prompt", state: "next" },
          { label: "发布包", state: "next" },
        ]}
      />

      <div className="content-grid">
        <article className="feature-panel package-panel">
          <PanelTitle icon={<Boxes aria-hidden="true" />} title="生产输入包" meta="SKU + TOP 因子" />
          <div className="sku-package">
            <div>
              <span>当前 SKU</span>
              <strong>折叠收纳盒 3 件套</strong>
              <em>家居收纳 / 低价组合 / 有库存</em>
            </div>
            <button>切换 SKU</button>
          </div>
          <div className="top-combo-list">
            {["TOP1 反差开场", "TOP2 价格锚点", "TOP3 材质追问"].map((item, index) => (
              <div key={item}>
                <span>{index + 1}</span>
                <strong>{item}</strong>
                <em>已锁定</em>
              </div>
            ))}
          </div>
        </article>

        <article className="feature-panel script-panel">
          <PanelTitle icon={<FileText aria-hidden="true" />} title="脚本草稿" meta="4 段结构" />
          <div className="script-board">
            {[
              ["01", "3 秒钩子", "用一组混乱桌面与收纳后对比开场。"],
              ["02", "痛点证据", "强调找不到小物、抽屉堆积、搬家整理难。"],
              ["03", "商品展示", "展示折叠、承重、透明标签三点。"],
              ["04", "转化口播", "多件装价格锚点，提示评论区关键词。"],
            ].map(([id, title, body]) => (
              <div key={id}>
                <span>{id}</span>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </article>

        <aside className="feature-panel prompt-panel">
          <PanelTitle icon={<Sparkles aria-hidden="true" />} title="Prompt 队列" meta="图片/视频素材" />
          <div className="prompt-card is-ready">
            <Image aria-hidden="true" />
            <div>
              <strong>主图 Prompt</strong>
              <span>收纳前后对比，干净白底，强调透明标签。</span>
            </div>
          </div>
          <div className="prompt-card">
            <LineChart aria-hidden="true" />
            <div>
              <strong>分镜 Prompt</strong>
              <span>4 段镜头，俯拍、手部演示、字幕节奏。</span>
            </div>
          </div>
          <button className="feature-secondary-action">查看全部 Prompt</button>
        </aside>
      </div>

      <article className="feature-panel production-table-panel">
        <PanelTitle icon={<ClipboardList aria-hidden="true" />} title="生产任务" meta="脚本、分镜、素材状态" />
        <DataRows
          columns={["任务", "SKU", "当前阶段", "负责人"]}
          rows={[
            ["SC-018", "折叠收纳盒", "脚本待确认", "DuoLe Team"],
            ["SC-019", "宠物梳毛器", "Prompt 生成中", "DuoLe Team"],
            ["SC-020", "厨房沥水架", "可发布包", "DuoLe Team"],
          ]}
        />
      </article>
    </section>
  );
}

function SkuOperationsPage({ config, notify }: { config: PageConfig; notify: (message: string) => void }) {
  const overview = config.layout.sections.find((section) => section.id === "overview");

  return (
    <section className="feature-page feature-page--sku">
      <EditableFrame sectionId={overview?.id ?? "overview"} label="SKU 运营页头">
        <FeatureHeader
          eyebrow="SKU Operations"
          title="SKU 运营中心"
          subtitle="把 SKU 档案、库存、策略分层和内容生产入口放在同一个可执行工作台。"
          primary="新增 SKU"
          secondary="筛选 SKU"
          icon={<Boxes aria-hidden="true" />}
          onPrimary={() => notify("打开新增 SKU 抽屉")}
        />
      </EditableFrame>

      <MetricRail
        items={[
          { label: "SKU 生效", value: "35" },
          { label: "潜力 SKU", value: "15", tone: "green" },
          { label: "低库存", value: "4", tone: "amber" },
          { label: "待生产内容", value: "11" },
        ]}
      />

      <div className="sku-grid">
        <article className="feature-panel sku-table-main">
          <PanelTitle icon={<Filter aria-hidden="true" />} title="SKU 列表" meta="按策略分层执行" />
          <div className="filter-chips">
            {["全部", "热销", "潜力", "低库存", "待内容"].map((item, index) => (
              <button className={index === 0 ? "is-active" : ""} key={item}>
                {item}
              </button>
            ))}
          </div>
          <DataRows
            columns={["SKU", "策略分层", "库存", "内容状态"]}
            rows={[
              ["折叠收纳盒 3 件套", "潜力", "充足", "脚本生成中"],
              ["宠物梳毛器", "热销", "低库存", "待裂变"],
              ["厨房沥水架", "新品", "充足", "待匹配因子"],
              ["无线补光灯", "潜力", "观察", "已发布 2 条"],
            ]}
          />
          <div className="sku-ops-board">
            <section>
              <div className="sku-ops-title">
                <Activity aria-hidden="true" />
                <span>今日运营动作</span>
              </div>
              {[
                ["补库存提醒", "宠物梳毛器低库存，先暂停裂变放量"],
                ["内容排期", "折叠收纳盒安排 3 条短视频脚本"],
                ["回流复盘", "无线补光灯待录入 2 条发布结果"],
              ].map(([label, value]) => (
                <div className="sku-ops-row" key={label}>
                  <strong>{label}</strong>
                  <span>{value}</span>
                </div>
              ))}
            </section>
            <section>
              <div className="sku-ops-title">
                <Layers aria-hidden="true" />
                <span>策略分层信号</span>
              </div>
              {[
                ["潜力", "因子匹配强，优先生成内容"],
                ["热销", "库存与素材必须先确认"],
                ["新品", "先跑结构验证，再进入放量"],
              ].map(([label, value]) => (
                <div className="sku-ops-row" key={label}>
                  <strong>{label}</strong>
                  <span>{value}</span>
                </div>
              ))}
            </section>
          </div>
        </article>

        <aside className="feature-panel sku-detail-panel">
          <PanelTitle icon={<BadgeCheck aria-hidden="true" />} title="当前 SKU" meta="内容链路" />
          <div className="sku-detail-hero">
            <div>
              <strong>折叠收纳盒 3 件套</strong>
              <span>家居收纳 / 低价多件装 / 本地库存 184</span>
            </div>
            <button onClick={() => notify("进入该 SKU 的内容生产")}>进入生产</button>
          </div>
          <div className="sku-signal-list">
            {[
              ["匹配因子", "反差开箱、价格锚点"],
              ["TOP 组合", "TOP1 + TOP3"],
              ["内容结果", "2 条发布，1 条待回流"],
              ["Feishu 同步", "队列中 1 项"],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </aside>

        <article className="feature-panel sku-chain-panel">
          <PanelTitle icon={<Link aria-hidden="true" />} title="SKU 内容链路" meta="从档案到回流" />
          <div className="chain-row">
            {["SKU 档案", "匹配因子", "脚本生成", "发布记录", "效果回流"].map((item, index) => (
              <div key={item}>
                {index < 3 ? <CheckCircle2 aria-hidden="true" /> : <Clock aria-hidden="true" />}
                <span>{item}</span>
                {index < 4 ? <ArrowRight aria-hidden="true" /> : null}
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function PanelTitle({ icon, title, meta }: { icon: React.ReactNode; title: string; meta: string }) {
  return (
    <div className="panel-title">
      <span>{icon}</span>
      <div>
        <h2>{title}</h2>
        <p>{meta}</p>
      </div>
    </div>
  );
}

function DataRows({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="mock-data-table">
      <div className="mock-data-table__head">
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {rows.map((row) => (
        <div className="mock-data-row" key={row.join("-")}>
          {row.map((cell, index) => (
            <span key={`${cell}-${index}`}>{cell}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function GenericBusinessPage({
  config,
  navigate,
  notify,
}: {
  config: PageConfig;
  navigate: (pageId: PageId) => void;
  notify: (message: string) => void;
}) {
  const fields = config.fields ?? [];
  const sections = config.layout.sections.filter((section) => section.visible).sort((a, b) => a.order - b.order);

  return (
    <section className="business-page" aria-label={`${config.title}工作台`}>
      {sections.map((section) => {
        if (section.type === "business-overview") {
          return (
            <EditableFrame key={section.id} sectionId={section.id} label={section.title ?? section.id}>
              <BusinessOverview section={section} navigate={navigate} notify={notify} />
            </EditableFrame>
          );
        }

        if (section.type === "table") {
          return (
            <EditableFrame key={section.id} sectionId={section.id} label={section.title ?? section.id}>
              <ConfigTable title={section.title ?? "列表"} fields={fields} />
            </EditableFrame>
          );
        }

        return null;
      })}
    </section>
  );
}

function BusinessOverview({
  section,
  navigate,
  notify,
}: {
  section: PageSection;
  navigate: (pageId: PageId) => void;
  notify: (message: string) => void;
}) {
  return (
    <article className="business-overview">
      <div>
        <h1>{section.title}</h1>
        <p>{section.subtitle}</p>
      </div>
      <div className="business-metrics">
        <div>
          <strong>{String(section.content?.primaryMetric ?? "")}</strong>
          <span>{String(section.content?.primaryLabel ?? "")}</span>
        </div>
        <div>
          <strong>{String(section.content?.secondaryMetric ?? "")}</strong>
          <span>{String(section.content?.secondaryLabel ?? "")}</span>
        </div>
      </div>
      <div className="business-actions">
        {section.actions?.map((action) => (
          <button className="primary-button" key={action.id} onClick={() => runPageAction(action, { navigate, notify })}>
            {action.label}
          </button>
        ))}
      </div>
    </article>
  );
}

function ConfigTable({ title, fields }: { title: string; fields: FieldConfig[] }) {
  const columns = fields.filter((field) => field.visible && field.tableColumn);
  const filters = fields.filter((field) => field.visible && field.filterable);

  return (
    <article className="business-table-panel">
      <div className="business-filter-row" aria-label="筛选项">
        {filters.map((field) => (
          <button key={field.id}>{field.label}</button>
        ))}
      </div>
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            {columns.map((field) => (
              <th key={field.id}>{field.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((row) => (
            <tr key={row}>
              {columns.map((field) => (
                <td key={field.id}>
                  {field.label} {row}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
