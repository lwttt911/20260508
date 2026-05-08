import type { PageAction, PageId } from "./pageTypes";

export type PageActionContext = {
  navigate: (pageId: PageId) => void;
  notify: (message: string) => void;
};

const pageIds = new Set<PageId>(["home", "ai-image", "viral-analysis", "ai-content", "sku"]);

export function runPageAction(action: PageAction, context: PageActionContext) {
  if (action.actionType === "navigate") {
    if (pageIds.has(action.target as PageId)) {
      context.navigate(action.target as PageId);
      return;
    }

    context.notify(`暂不支持跳转：${action.target}`);
    return;
  }

  if (action.actionType === "switchView") {
    context.notify(`已切换视图：${action.target}`);
    return;
  }

  if (action.actionType === "openModal") {
    context.notify(`打开弹窗：${action.target}`);
    return;
  }

  if (action.actionType === "openDrawer") {
    context.notify(`打开抽屉：${action.target}`);
    return;
  }

  context.notify(`执行预设动作：${action.target}`);
}
