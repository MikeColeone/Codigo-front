import { useKeyPress } from "ahooks";
import { message } from "antd";
import { useEditorComponents } from "./useEditorComponents";

/**
 * 注册 editor 域内的组件快捷键。
 */
export function useEditorComponentKeyPress() {
  const {
    undo,
    redo,
    moveUpComponent,
    moveDownComponent,
    pasteCopyedComponent,
    copyCurrentComponent,
    removeCurrentComponent,
    getCurrentComponentConfig,
  } = useEditorComponents();

  /**
   * 判断当前焦点是否允许触发画布快捷键。
   */
  function canTriggerShortcut() {
    return (
      document.activeElement === document.body ||
      document.activeElement?.matches('div[role="button"]')
    );
  }

  /**
   * 校验当前是否存在选中组件。
   */
  function validateComponent() {
    const isCompExist = getCurrentComponentConfig.get() !== null;
    const isActive = canTriggerShortcut();

    if (!isCompExist) {
      message.warning("请先选择组件");
      return false;
    }
    return isActive;
  }

  useKeyPress("uparrow", () => {
    if (!validateComponent()) return;
    moveUpComponent();
  });

  useKeyPress("downarrow", () => {
    if (!validateComponent()) return;
    moveDownComponent();
  });

  useKeyPress(["delete", "backspace"], () => {
    if (!validateComponent()) return;
    removeCurrentComponent();
  });

  useKeyPress(["ctrl.c", "meta.c"], () => {
    if (!validateComponent()) return;
    copyCurrentComponent();
  });

  useKeyPress(["ctrl.v", "meta.v"], () => {
    if (!validateComponent()) return;
    pasteCopyedComponent();
  });

  useKeyPress(["ctrl.shift.z", "meta.shift.z"], () => {
    redo();
  });

  useKeyPress(
    ["ctrl.z", "meta.z"],
    () => {
      if (!validateComponent()) return;
      undo();
    },
    {
      exactMatch: true,
    },
  );
}
