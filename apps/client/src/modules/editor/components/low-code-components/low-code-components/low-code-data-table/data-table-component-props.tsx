import { useMemo } from "react";
import { Input, InputNumber, Segmented, Switch } from "antd";
import type { SegmentedLabeledOption } from "antd/es/segmented";
import {
  type IDataTableComponentProps,
  dataTableComponentDefaultConfig,
  fillComponentPropsByConfig,
} from "@codigo/materials";
import { FormContainer, FormPropLabel } from "..";

export default function dataTableComponentProps(_props: IDataTableComponentProps) {
  const props = useMemo(() => {
    return fillComponentPropsByConfig(_props, dataTableComponentDefaultConfig);
  }, [_props]);

  const sizeOptions: SegmentedLabeledOption[] = [
    { value: "large", label: "大" },
    { value: "middle", label: "中" },
    { value: "small", label: "小" },
  ];

  return (
    <FormContainer config={props}>
      <FormPropLabel name="title" prop={props.title} label="标题：">
        <Input />
      </FormPropLabel>
      <FormPropLabel name="size" prop={props.size} label="尺寸：">
        <Segmented options={sizeOptions} />
      </FormPropLabel>
      <FormPropLabel
        name="bordered"
        prop={props.bordered}
        label="显示边框："
        valuePropName="checked"
      >
        <Switch />
      </FormPropLabel>
      <FormPropLabel
        name="pagination"
        prop={props.pagination}
        label="分页："
        valuePropName="checked"
      >
        <Switch />
      </FormPropLabel>
      <FormPropLabel name="pageSize" prop={props.pageSize} label="每页条数：">
        <InputNumber className="w-full" min={1} max={200} />
      </FormPropLabel>
      <FormPropLabel
        name="columnsText"
        prop={props.columnsText}
        label="列配置 JSON："
      >
        <Input.TextArea autoSize={{ minRows: 6, maxRows: 12 }} className="font-mono text-xs" />
      </FormPropLabel>
      <FormPropLabel name="dataText" prop={props.dataText} label="数据 JSON：">
        <Input.TextArea autoSize={{ minRows: 8, maxRows: 16 }} className="font-mono text-xs" />
      </FormPropLabel>
      <FormPropLabel name="emptyText" prop={props.emptyText} label="空状态文案：">
        <Input />
      </FormPropLabel>
    </FormContainer>
  );
}
