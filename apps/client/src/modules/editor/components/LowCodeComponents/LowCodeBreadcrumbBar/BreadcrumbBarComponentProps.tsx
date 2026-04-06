import { useMemo } from "react";
import { Form, Input, Segmented } from "antd";
import type { SegmentedLabeledOption } from "antd/es/segmented";
import {
  type IBreadcrumbBarComponentProps,
  breadcrumbBarComponentDefaultConfig,
  breadcrumbBarItem,
  fillComponentPropsByConfig,
} from "@codigo/materials";
import { useEditorComponents } from "@/modules/editor/hooks";
import { FormContainerWithList } from "..";

export default function BreadcrumbBarComponentProps(
  _props: IBreadcrumbBarComponentProps,
) {
  const props = useMemo(() => {
    return fillComponentPropsByConfig(
      _props,
      breadcrumbBarComponentDefaultConfig,
    );
  }, [_props]);
  const { updateCurrentComponent } = useEditorComponents();

  const separatorOptions: SegmentedLabeledOption[] = [
    { label: "斜杠", value: "/" },
    { label: "箭头", value: ">" },
  ];

  return (
    <div className="space-y-4">
      <FormContainerWithList
        id={props.items.value.map((item) => item.id).join(",")}
        items={props.items.value}
        newItemDefaultValue={breadcrumbBarItem}
      >
        <Form.Item label="名称：" name="label">
          <Input />
        </Form.Item>
      </FormContainerWithList>

      <Form layout="vertical">
        <Form.Item label="分隔符：">
          <Segmented
            block
            options={separatorOptions}
            value={props.separator.value}
            onChange={(value) => updateCurrentComponent({ separator: value })}
          />
        </Form.Item>
      </Form>
    </div>
  );
}
