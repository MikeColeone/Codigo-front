import type { TStorePage, CodeFramework, DeviceType, EditorMode } from "@/shared/stores";
import { useStorePage } from "@/shared/hooks/useStorePage";
import type { PageCategory, PageLayoutMode } from "@codigo/schema";
import { useEditorPermission } from "./useEditorPermission";

/**
 * 暴露 editor 域专用的页面状态操作。
 */
export function useEditorPage() {
  const pageStore = useStorePage();
  const { ensurePermission, addOperationLog } = useEditorPermission();

  /**
   * 更新页面标题。
   */
  const setPageTitle = (title: string) => {
    if (!ensurePermission("edit_content", "当前角色不能修改页面标题")) {
      return;
    }
    pageStore.setPageTitle(title);
    addOperationLog("update_page", "页面标题");
  };

  /**
   * 切换终端类型。
   */
  const setDeviceType = (type: DeviceType) => {
    if (!ensurePermission("edit_content", "当前角色不能修改画布设置")) {
      return;
    }
    pageStore.setDeviceType(type);
    addOperationLog("update_page", "终端模式");
  };

  /**
   * 更新画布尺寸。
   */
  const setCanvasSize = (width: number, height: number) => {
    if (!ensurePermission("edit_content", "当前角色不能修改画布尺寸")) {
      return;
    }
    pageStore.setCanvasSize(width, height);
    addOperationLog("update_page", "画布尺寸");
  };

  /**
   * 切换源码框架。
   */
  const setCodeFramework = (framework: CodeFramework) => {
    if (!ensurePermission("edit_content", "当前角色不能修改源码框架")) {
      return;
    }
    pageStore.setCodeFramework(framework);
    addOperationLog("update_page", "源码框架");
  };

  /**
   * 切换页面分类。
   */
  const setPageCategory = (category: PageCategory) => {
    if (!ensurePermission("edit_content", "当前角色不能修改页面类型")) {
      return;
    }
    pageStore.setPageCategory(category);
    addOperationLog("update_page", "页面类型");
  };

  /**
   * 切换布局模式。
   */
  const setLayoutMode = (mode: PageLayoutMode) => {
    if (!ensurePermission("edit_content", "当前角色不能修改布局模式")) {
      return;
    }
    pageStore.setLayoutMode(mode);
    addOperationLog("update_page", "布局模式");
  };

  /**
   * 切换编辑器模式。
   */
  const setEditorMode = (mode: EditorMode) => {
    pageStore.setEditorMode(mode);
  };

  /**
   * 批量更新页面配置。
   */
  const updatePage = (page: Partial<TStorePage>) => {
    if (!ensurePermission("edit_content", "当前角色不能修改页面信息")) {
      return;
    }
    pageStore.updatePage(page);
    addOperationLog("update_page", "页面信息");
  };

  return {
    ...pageStore,
    setPageTitle,
    setDeviceType,
    setCanvasSize,
    setCodeFramework,
    setPageCategory,
    setLayoutMode,
    setEditorMode,
    updatePage,
  };
}
