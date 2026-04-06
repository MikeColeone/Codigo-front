import { action } from "mobx";
import { message } from "antd";
import type { TEditorComponentsStore } from "@/modules/editor/stores";
import { gatherSubtreeIds } from "@/modules/editor/utils/pageLayout";

interface EditorComponentMoveContext {
  storeComponents: TEditorComponentsStore;
  addOperationLog: (action: any, detail: string) => void;
  broadcastReplaceAll: () => void;
  insertChildIdBySlot: (
    parentId: string,
    nodeId: string,
    slot: string,
    targetIndex?: number,
  ) => void;
  insertIntoOrderedIds: (
    ids: string[],
    nodeId: string,
    targetIndex?: number,
  ) => string[];
  syncSchema: (keepCurrentId?: string | null) => void;
}

/**
 * 创建 editor 组件移动能力。
 */
export function createEditorComponentMove(
  context: EditorComponentMoveContext,
) {
  const {
    addOperationLog,
    broadcastReplaceAll,
    insertChildIdBySlot,
    insertIntoOrderedIds,
    storeComponents,
    syncSchema,
  } = context;

  /**
   * 移动已有节点到新的位置或容器。
   */
  const moveExistingNode = action(
    (args: {
      nodeId: string;
      targetParentId?: string | null;
      targetSlot?: string | null;
      targetIndex?: number;
    }) => {
      const node = storeComponents.compConfigs[args.nodeId];
      if (!node) {
        return;
      }

      const subtreeIds = gatherSubtreeIds(storeComponents.compConfigs, args.nodeId);
      if (args.targetParentId && subtreeIds.includes(args.targetParentId)) {
        message.warning("不能把组件移动到自己的子节点下");
        return;
      }

      const prevParentId = node.parentId;
      const prevSlot = node.slot ?? "default";
      const nextParentId = args.targetParentId ?? null;
      const nextSlot = args.targetSlot ?? (nextParentId ? "default" : null);

      if (prevParentId) {
        const prevParent = storeComponents.compConfigs[prevParentId];
        if (prevParent) {
          prevParent.childIds = prevParent.childIds.filter((id) => id !== args.nodeId);
        }
      } else {
        storeComponents.sortableCompConfig = storeComponents.sortableCompConfig.filter(
          (id) => id !== args.nodeId,
        );
      }

      if (nextParentId) {
        insertChildIdBySlot(
          nextParentId,
          args.nodeId,
          nextSlot ?? "default",
          args.targetIndex,
        );
      } else {
        storeComponents.sortableCompConfig = insertIntoOrderedIds(
          storeComponents.sortableCompConfig,
          args.nodeId,
          args.targetIndex,
        );
      }

      node.parentId = nextParentId;
      node.slot = nextSlot ?? undefined;
      syncSchema(args.nodeId);

      broadcastReplaceAll();
      addOperationLog(
        "move_component",
        `${args.nodeId}:${prevParentId ?? "root"}/${prevSlot} -> ${nextParentId ?? "root"}/${nextSlot ?? "root"}`,
      );
    },
  );

  return {
    moveExistingNode,
  };
}
