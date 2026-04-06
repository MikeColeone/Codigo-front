import type {
  ComponentNode,
  ComponentNodeRecord,
  IEditorPageSchema,
} from "@codigo/schema";
import { makeAutoObservable } from "mobx";

interface IStoreComponents {
  compConfigs: Record<string, ComponentNodeRecord>;
  sortableCompConfig: string[];
  currentCompConfig: string | null;
  copyedCompConig: ComponentNode | null;
  itemsExpandIndex: number;
  pages: IEditorPageSchema[];
  activePageId: string | null;
}

/**
 * 创建编辑器组件状态仓库。
 */
export function createEditorComponentsStore() {
  return makeAutoObservable<IStoreComponents>({
    compConfigs: {},
    sortableCompConfig: [],
    currentCompConfig: null,
    copyedCompConig: null,
    itemsExpandIndex: 0,
    pages: [],
    activePageId: null,
  });
}

export type TEditorComponentsStore = ReturnType<
  typeof createEditorComponentsStore
>;
