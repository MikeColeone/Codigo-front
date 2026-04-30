import { LayoutOutlined } from "@ant-design/icons";
import { containerComponentProps } from "@/modules/editor/components/low-code-components/low-code-container";
import { twoColumnComponentProps } from "@/modules/editor/components/low-code-components/low-code-two-column";
import { viewGroupComponentProps } from "@/modules/editor/components/low-code-components/low-code-view-group";
import type { EditorComponentMeta } from "../types";

export const containerEditorComponents: EditorComponentMeta[] = [
  {
    type: "container",
    name: "容器",
    icon: <LayoutOutlined />,
    sectionKey: "container",
    propsEditor: containerComponentProps,
    hiddenFromPalette: true,
  },
  {
    type: "twoColumn",
    name: "双栏布局",
    icon: <LayoutOutlined />,
    sectionKey: "basic",
    propsEditor: twoColumnComponentProps,
    hiddenFromPalette: true,
  },
  {
    type: "viewGroup",
    name: "视图组",
    icon: <LayoutOutlined />,
    sectionKey: "basic",
    propsEditor: viewGroupComponentProps,
    hiddenFromPalette: true,
  },
];
