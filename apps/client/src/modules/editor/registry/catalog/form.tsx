import {
  CheckCircleOutlined,
  CheckSquareOutlined,
  EditOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { getComponentByType as getBuiltinComponentByType } from "@codigo/materials";
import { CheckboxComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeCheckbox";
import { InputComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeInput";
import { RadioComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeRadio";
import type { EditorComponentMeta } from "../types";

export const formEditorComponents: EditorComponentMeta[] = [
  {
    type: "input",
    name: "输入框",
    icon: <EditOutlined />,
    sectionKey: "form",
    propsEditor: InputComponentProps,
    renderComponent: getBuiltinComponentByType("input"),
  },
  {
    type: "textArea",
    name: "文本域",
    icon: <FormOutlined />,
    sectionKey: "form",
    propsEditor: InputComponentProps,
    renderComponent: getBuiltinComponentByType("textArea"),
  },
  {
    type: "radio",
    name: "单选框",
    icon: <CheckCircleOutlined />,
    sectionKey: "form",
    propsEditor: RadioComponentProps,
    renderComponent: getBuiltinComponentByType("radio"),
  },
  {
    type: "checkbox",
    name: "多选框",
    icon: <CheckSquareOutlined />,
    sectionKey: "form",
    propsEditor: CheckboxComponentProps,
    renderComponent: getBuiltinComponentByType("checkbox"),
  },
];
