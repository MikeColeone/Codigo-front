import { useMemo } from "react";
import { Input } from "antd";
import {
  type IPageHeaderComponentProps,
  fillComponentPropsByConfig,
  pageHeaderComponentDefaultConfig,
} from "@codigo/materials";
import { FormContainer, FormPropLabel } from "..";

export default function PageHeaderComponentProps(
  _props: IPageHeaderComponentProps,
) {
  const props = useMemo(() => {
    return fillComponentPropsByConfig(_props, pageHeaderComponentDefaultConfig);
  }, [_props]);

  return (
    <FormContainer config={props}>
      <FormPropLabel name="title" prop={props.title} label="页面标题：">
        <Input />
      </FormPropLabel>
      <FormPropLabel name="subtitle" prop={props.subtitle} label="副标题：">
        <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
      </FormPropLabel>
      <FormPropLabel name="tagsText" prop={props.tagsText} label="标签：">
        <Input placeholder="多个标签用逗号分隔" />
      </FormPropLabel>
      <FormPropLabel name="extraText" prop={props.extraText} label="补充信息：">
        <Input />
      </FormPropLabel>
    </FormContainer>
  );
}
