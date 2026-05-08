import type { PageConfig, PageId } from "../config/pageTypes";
import { BusinessPageRenderer } from "./BusinessPageRenderer";
import { HomePageRenderer } from "./HomePageRenderer";

export function PageRenderer({
  config,
  navigate,
  notify,
}: {
  config: PageConfig;
  navigate: (pageId: PageId) => void;
  notify: (message: string) => void;
}) {
  if (config.layout.type === "home-workbench") {
    return <HomePageRenderer config={config} navigate={navigate} notify={notify} />;
  }

  return <BusinessPageRenderer config={config} navigate={navigate} notify={notify} />;
}
