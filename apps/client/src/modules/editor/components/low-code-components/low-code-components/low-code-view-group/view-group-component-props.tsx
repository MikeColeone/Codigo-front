import { Input, InputNumber } from "antd";
import { useMemo } from "react";
import {
  fillComponentPropsByConfig,
  viewGroupComponentDefaultConfig,
  type IViewGroupComponentProps,
} from "@codigo/materials";
import { FormContainer, FormPropLabel } from "..";
import ViewGroupContainerListEditor from "./view-group-container-list-editor";

export default function viewGroupComponentProps(_props: IViewGroupComponentProps) {
  const props = useMemo(() => {
    return fillComponentPropsByConfig(
      _props as any,
      viewGroupComponentDefaultConfig,
    );
  }, [_props]);

  return (
    <div className="space-y-3">
      <ViewGroupContainerListEditor />

      <FormContainer layout="vertical" config={props}>
        <FormPropLabel
          name="backgroundColor"
          prop={props.backgroundColor}
          label="背景色："
        >
          <Input />
        </FormPropLabel>
        <FormPropLabel name="borderColor" prop={props.borderColor} label="边框色：">
          <Input />
        </FormPropLabel>
        <FormPropLabel
          name="borderRadius"
          prop={props.borderRadius}
          label="圆角："
        >
          <InputNumber className="w-full" />
        </FormPropLabel>
        <FormPropLabel name="padding" prop={props.padding} label="内边距：">
          <InputNumber className="w-full" />
        </FormPropLabel>
        <FormPropLabel name="minHeight" prop={props.minHeight} label="最小高度：">
          <InputNumber className="w-full" />
        </FormPropLabel>
      </FormContainer>
    </div>
  );
}
