import type { TEditorComponentsStore } from "@/modules/editor/stores";
import type { PageGridConfig, PageLayoutMode } from "@codigo/schema";
import { createEditorComponentCreation } from "./use-editor-component-creation";
import { createEditorComponentMove } from "./use-editor-component-move";
import { createEditorComponentTree } from "./use-editor-component-tree";

interface EditorComponentStructureContext {
  storeComponents: TEditorComponentsStore;
  pageStore: {
    layoutMode: PageLayoutMode;
    grid?: PageGridConfig;
    canvasWidth: number;
    canvasHeight: number;
  };
  ensurePermission: (permission: any, deniedMessage?: string) => boolean;
  addOperationLog: (action: any, detail: string) => void;
  broadcastNodeChange: (actionType: string, payload: any) => void;
  broadcastReplaceAll: () => void;
  setCurrentComponent: (id: string) => void;
}

/**
 * 创建 editor 组件树结构相关的读写能力。
 */
export function createEditorComponentStructure(
  context: EditorComponentStructureContext,
) {
  const {
    addOperationLog,
    broadcastNodeChange,
    broadcastReplaceAll,
    ensurePermission,
    pageStore,
    setCurrentComponent,
    storeComponents,
  } = context;

  const {
    getSiblingIds,
    insertChildIdBySlot,
    insertIntoOrderedIds,
    insertNodeTree,
    syncLayoutMode,
    syncSchema,
  } = createEditorComponentTree({
    pageStore,
    storeComponents,
  });

  const { getAvailableSlots, insertNodeIntoContainer, push, pushBlock } =
    createEditorComponentCreation({
      addOperationLog,
      broadcastNodeChange,
      ensurePermission,
      insertNodeTree,
      pageStore,
      setCurrentComponent,
      storeComponents,
    });

  const { moveExistingNode } = createEditorComponentMove({
    addOperationLog,
    broadcastReplaceAll,
    insertChildIdBySlot,
    insertIntoOrderedIds,
    storeComponents,
    syncSchema,
  });

  return {
    getAvailableSlots,
    getSiblingIds,
    insertNodeIntoContainer,
    insertNodeTree,
    moveExistingNode,
    push,
    pushBlock,
    syncLayoutMode,
    syncSchema,
  };
}
