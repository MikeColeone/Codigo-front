import {
  CheckCircleOutlined,
  CheckSquareOutlined,
  EditOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { checkboxComponentProps } from "@/modules/editor/components/low-code-components/low-code-checkbox";
import { inputComponentProps } from "@/modules/editor/components/low-code-components/low-code-input";
import { radioComponentProps } from "@/modules/editor/components/low-code-components/low-code-radio";
import { textAreaComponentProps } from "@/modules/editor/components/low-code-components/low-code-text-area";
import type { EditorComponentMeta } from "../types";

export const formEditorComponents: EditorComponentMeta[] = [
  {
    type: "input",
    name: "输入框",
    icon: <EditOutlined />,
    sectionKey: "form",
    propsEditor: inputComponentProps,
  },
  {
    type: "textArea",
    name: "文本域",
    icon: <FormOutlined />,
    sectionKey: "form",
    propsEditor: textAreaComponentProps,
  },
  {
    type: "radio",
    name: "单选框",
    icon: <CheckCircleOutlined />,
    sectionKey: "form",
    propsEditor: radioComponentProps,
  },
  {
    type: "checkbox",
    name: "多选框",
    icon: <CheckSquareOutlined />,
    sectionKey: "form",
    propsEditor: checkboxComponentProps,
  },
];
