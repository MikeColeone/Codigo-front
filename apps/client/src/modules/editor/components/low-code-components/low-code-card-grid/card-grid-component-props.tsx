import { useMemo } from "react";
import { Form, Input, Segmented } from "antd";
import type { SegmentedLabeledOption } from "antd/es/segmented";
import {
  type ICardGridComponentProps,
  cardGridComponentDefaultConfig,
  cardGridItem,
  fillComponentPropsByConfig,
} from "@codigo/materials";
import { FormContainer, FormContainerWithList, FormPropLabel } from "..";

export default function cardGridComponentProps(_props: ICardGridComponentProps) {
  const props = useMemo(() => {
    return fillComponentPropsByConfig(_props, cardGridComponentDefaultConfig);
  }, [_props]);

  const columnOptions: SegmentedLabeledOption[] = [
    { label: "2列", value: 2 },
    { label: "3列", value: 3 },
    { label: "4列", value: 4 },
  ];

  return (
    <div className="space-y-4">
      <FormContainer config={props}>
        <FormPropLabel name="columns" prop={props.columns} label="每行列数：">
          <Segmented block options={columnOptions} />
        </FormPropLabel>
      </FormContainer>

      <FormContainerWithList
        id={props.items.value.map((item) => item.id).join(",")}
        items={props.items.value}
        newItemDefaultValue={cardGridItem}
      >
        <Form.Item label="标题：" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="副标题：" name="subtitle">
          <Input />
        </Form.Item>
        <Form.Item label="主数值：" name="value">
          <Input />
        </Form.Item>
        <Form.Item label="补充文案：" name="extra">
          <Input />
        </Form.Item>
      </FormContainerWithList>
    </div>
  );
}
