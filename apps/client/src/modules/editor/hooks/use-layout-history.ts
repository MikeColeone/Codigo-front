import { createLayoutHistoryStore } from "@/modules/editor/stores/layout-history";

const layoutHistoryStore = createLayoutHistoryStore();

export function useLayoutHistory() {
  return layoutHistoryStore;
}

