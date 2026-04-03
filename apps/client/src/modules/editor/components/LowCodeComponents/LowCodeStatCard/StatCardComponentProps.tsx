import { useMemo } from "react";
import { Input, Segmented } from "antd";
import type { SegmentedLabeledOption } from "antd/es/segmented";
import {
  type IStatCardComponentProps,
  fillComponentPropsByConfig,
  statCardComponentDefaultConfig,
} from "@codigo/materials";
import { FormContainer, FormPropLabel } from "..";

export default function StatCardComponentProps(_props: IStatCardComponentProps) {
  const props = useMemo(() => {
    return fillComponentPropsByConfig(_props, statCardComponentDefaultConfig);
  }, [_props]);

  const trendOptions: SegmentedLabeledOption[] = [
    { label: "上涨", value: "up" },
    { label: "下降", value: "down" },
    { label: "持平", value: "flat" },
  ];

  return (
    <FormContainer config={props}>
      <FormPropLabel name="title" prop={props.title} label="标题：">
        <Input />
      </FormPropLabel>
      <FormPropLabel name="value" prop={props.value} label="数值：">
        <Input />
      </FormPropLabel>
      <FormPropLabel name="suffix" prop={props.suffix} label="后缀：">
        <Input />
      </FormPropLabel>
      <FormPropLabel name="trendText" prop={props.trendText} label="趋势文案：">
        <Input />
      </FormPropLabel>
      <FormPropLabel
        name="trendDirection"
        prop={props.trendDirection}
        label="趋势方向："
      >
        <Segmented block options={trendOptions} />
      </FormPropLabel>
      <FormPropLabel name="description" prop={props.description} label="说明：">
        <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
      </FormPropLabel>
    </FormContainer>
  );
}
