import homeConfig from "./pages/home.json";
import aiImageConfig from "./pages/ai-image.json";
import viralAnalysisConfig from "./pages/viral-analysis.json";
import aiContentConfig from "./pages/ai-content.json";
import skuConfig from "./pages/sku.json";
import type { PageConfig, PageId } from "./pageTypes";

export const defaultPageConfigs: Record<PageId, PageConfig> = {
  home: homeConfig as unknown as PageConfig,
  "ai-image": aiImageConfig as unknown as PageConfig,
  "viral-analysis": viralAnalysisConfig as unknown as PageConfig,
  "ai-content": aiContentConfig as unknown as PageConfig,
  sku: skuConfig as unknown as PageConfig,
};

export const pageOrder: PageId[] = ["home", "ai-image", "viral-analysis", "ai-content", "sku"];

export function getDefaultPageConfig(pageId: PageId): PageConfig {
  return structuredClone(defaultPageConfigs[pageId]);
}
