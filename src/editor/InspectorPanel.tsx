import type { FieldConfig, PageConfig, PageSection, PageVersion } from "../config/pageTypes";
import { sectionHeightBounds } from "../page-editor/resizeMath.mjs";

type ContentValue = string | number | boolean;

export function InspectorPanel({
  config,
  section,
  versions,
  onUpdatePage,
  onUpdateSection,
  onRestoreVersion,
}: {
  config: PageConfig;
  section: PageSection | null;
  versions: PageVersion[];
  onUpdatePage: (config: PageConfig) => void;
  onUpdateSection: (sectionId: string, updater: (section: PageSection) => PageSection) => void;
  onRestoreVersion: (versionId: string) => void;
}) {
  return (
    <aside className="inspector-panel">
      <h2>属性</h2>
      {section ? (
        <SectionInspector section={section} onUpdate={(updater) => onUpdateSection(section.id, updater)} />
      ) : (
        <PageInspector config={config} onUpdatePage={onUpdatePage} />
      )}
      {config.fields ? <FieldInspector config={config} onUpdatePage={onUpdatePage} /> : null}
      <VersionInspector versions={versions} onRestoreVersion={onRestoreVersion} />
    </aside>
  );
}

function PageInspector({ config, onUpdatePage }: { config: PageConfig; onUpdatePage: (config: PageConfig) => void }) {
  return (
    <section className="inspector-section">
      <h3>页面</h3>
      <label>
        页面标题
        <input value={config.title} onChange={(event) => onUpdatePage({ ...config, title: event.target.value })} />
      </label>
      <label>
        导航名称
        <input value={config.navLabel} onChange={(event) => onUpdatePage({ ...config, navLabel: event.target.value })} />
      </label>
    </section>
  );
}

function SectionInspector({
  section,
  onUpdate,
}: {
  section: PageSection;
  onUpdate: (updater: (section: PageSection) => PageSection) => void;
}) {
  return (
    <section className="inspector-section">
      <h3>区块</h3>
      <label>
        标题
        <input value={section.title ?? ""} onChange={(event) => onUpdate((current) => ({ ...current, title: event.target.value }))} />
      </label>
      <label>
        副标题
        <textarea
          value={section.subtitle ?? ""}
          onChange={(event) => onUpdate((current) => ({ ...current, subtitle: event.target.value }))}
        />
      </label>
      <label>
        顺序
        <input
          type="number"
          value={section.order}
          onChange={(event) => onUpdate((current) => ({ ...current, order: Number(event.target.value) }))}
        />
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={section.visible}
          onChange={(event) => onUpdate((current) => ({ ...current, visible: event.target.checked }))}
        />
        显示区块
      </label>

      <LayoutInspector section={section} onUpdate={onUpdate} />
      {section.content ? <ContentInspector section={section} onUpdate={onUpdate} /> : null}
      {section.actions?.map((action) => (
        <div className="action-editor" key={action.id}>
          <strong>{action.id}</strong>
          <label>
            按钮文案
            <input
              value={action.label}
              onChange={(event) =>
                onUpdate((current) => ({
                  ...current,
                  actions: current.actions?.map((item) => (item.id === action.id ? { ...item, label: event.target.value } : item)),
                }))
              }
            />
          </label>
          <label>
            动作目标
            <input
              value={action.target}
              onChange={(event) =>
                onUpdate((current) => ({
                  ...current,
                  actions: current.actions?.map((item) => (item.id === action.id ? { ...item, target: event.target.value } : item)),
                }))
              }
            />
          </label>
        </div>
      ))}
    </section>
  );
}

function LayoutInspector({
  section,
  onUpdate,
}: {
  section: PageSection;
  onUpdate: (updater: (section: PageSection) => PageSection) => void;
}) {
  const bounds = sectionHeightBounds(section.type);

  return (
    <>
      <label>
        区块高度
        <input
          type="number"
          min={bounds.min}
          max={bounds.max}
          value={section.style?.height ?? bounds.fallback}
          onChange={(event) =>
            onUpdate((current) => ({
              ...current,
              style: { ...current.style, height: Number(event.target.value) },
            }))
          }
        />
      </label>
      {section.type === "module-showcase" ? (
        <label>
          宽度档位
          <select
            value={section.width ?? "normal"}
            onChange={(event) =>
              onUpdate((current) => ({
                ...current,
                width: event.target.value as PageSection["width"],
              }))
            }
          >
            <option value="narrow">窄</option>
            <option value="normal">正常</option>
            <option value="wide">宽</option>
          </select>
        </label>
      ) : null}
      {section.type === "hero" ? (
        <label>
          背景图片
          <input
            value={section.style?.backgroundImage ?? ""}
            onChange={(event) =>
              onUpdate((current) => ({
                ...current,
                style: { ...current.style, backgroundImage: event.target.value },
              }))
            }
          />
        </label>
      ) : null}
    </>
  );
}

function ContentInspector({
  section,
  onUpdate,
}: {
  section: PageSection;
  onUpdate: (updater: (section: PageSection) => PageSection) => void;
}) {
  return (
    <>
      {Object.entries(section.content ?? {}).map(([key, value]) => (
        <label key={key}>
          {key}
          <input
            value={String(value)}
            onChange={(event) =>
              onUpdate((current) => ({
                ...current,
                content: {
                  ...current.content,
                  [key]: normalizeContentValue(value, event.target.value),
                },
              }))
            }
          />
        </label>
      ))}
    </>
  );
}

function normalizeContentValue(previous: ContentValue, next: string): ContentValue {
  if (typeof previous === "number") {
    const number = Number(next);
    return Number.isFinite(number) ? number : previous;
  }

  if (typeof previous === "boolean") {
    return next === "true";
  }

  return next;
}

function FieldInspector({ config, onUpdatePage }: { config: PageConfig; onUpdatePage: (config: PageConfig) => void }) {
  function updateField(fieldId: string, updater: (field: FieldConfig) => FieldConfig) {
    onUpdatePage({
      ...config,
      fields: config.fields?.map((field) => (field.id === fieldId ? updater(field) : field)),
    });
  }

  return (
    <section className="inspector-section">
      <h3>字段显示</h3>
      {config.fields?.map((field) => (
        <div className="field-editor" key={field.id}>
          <label>
            名称
            <input value={field.label} onChange={(event) => updateField(field.id, (current) => ({ ...current, label: event.target.value }))} />
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={field.visible}
              onChange={(event) => updateField(field.id, (current) => ({ ...current, visible: event.target.checked }))}
            />
            显示
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={field.tableColumn}
              onChange={(event) => updateField(field.id, (current) => ({ ...current, tableColumn: event.target.checked }))}
            />
            表格列
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={field.filterable}
              onChange={(event) => updateField(field.id, (current) => ({ ...current, filterable: event.target.checked }))}
            />
            筛选项
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(event) => updateField(field.id, (current) => ({ ...current, required: event.target.checked }))}
            />
            必填
          </label>
        </div>
      ))}
    </section>
  );
}

function VersionInspector({
  versions,
  onRestoreVersion,
}: {
  versions: PageVersion[];
  onRestoreVersion: (versionId: string) => void;
}) {
  return (
    <section className="inspector-section">
      <h3>版本</h3>
      {versions.length === 0 ? <p>暂无草稿版本</p> : null}
      {versions.map((version) => (
        <button key={version.versionId} onClick={() => onRestoreVersion(version.versionId)}>
          恢复为草稿：{version.label}
        </button>
      ))}
    </section>
  );
}
