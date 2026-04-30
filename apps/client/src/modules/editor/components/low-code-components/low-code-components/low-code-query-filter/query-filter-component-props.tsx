import { useMemo } from "react";
import { Form, Input, Segmented, Select, Switch } from "antd";
import type { SegmentedLabeledOption } from "antd/es/segmented";
import {
  type IQueryFilterComponentProps,
  fillComponentPropsByConfig,
  queryFilterComponentDefaultConfig,
  queryFilterField,
} from "@codigo/materials";
import { FormContainer, FormContainerWithList, FormPropLabel } from "..";

export default function queryFilterComponentProps(
  _props: IQueryFilterComponentProps,
) {
  const props = useMemo(() => {
    return fillComponentPropsByConfig(_props, queryFilterComponentDefaultConfig);
  }, [_props]);

  const columnOptions: SegmentedLabeledOption[] = [
    { label: "2列", value: 2 },
    { label: "3列", value: 3 },
    { label: "4列", value: 4 },
  ];

  const fieldTypeOptions = [
    { label: "输入框", value: "input" },
    { label: "下拉框", value: "select" },
  ];

  return (
    <div className="space-y-4">
      <FormContainer config={props}>
        <FormPropLabel name="columns" prop={props.columns} label="每行列数：">
          <Segmented block options={columnOptions} />
        </FormPropLabel>
        <FormPropLabel name="searchText" prop={props.searchText} label="搜索按钮文案：">
          <Input />
        </FormPropLabel>
        <FormPropLabel name="resetText" prop={props.resetText} label="重置按钮文案：">
          <Input />
        </FormPropLabel>
        <FormPropLabel
          name="showSearchButton"
          prop={props.showSearchButton}
          label="显示搜索按钮："
          valuePropName="checked"
        >
          <Switch />
        </FormPropLabel>
        <FormPropLabel
          name="showResetButton"
          prop={props.showResetButton}
          label="显示重置按钮："
          valuePropName="checked"
        >
          <Switch />
        </FormPropLabel>
      </FormContainer>

      <FormContainerWithList
        id={props.fields.value.map((item) => item.id).join(",")}
        items={props.fields.value}
        newItemDefaultValue={queryFilterField}
      >
        <Form.Item label="字段标题：" name="label">
          <Input />
        </Form.Item>
        <Form.Item label="字段键名：" name="field">
          <Input />
        </Form.Item>
        <Form.Item label="字段类型：" name="type">
          <Select options={fieldTypeOptions} />
        </Form.Item>
        <Form.Item label="占位文案：" name="placeholder">
          <Input />
        </Form.Item>
        <Form.Item label="选项：" name="optionsText">
          <Input placeholder="多个选项用逗号分隔" />
        </Form.Item>
      </FormContainerWithList>
    </div>
  );
}
