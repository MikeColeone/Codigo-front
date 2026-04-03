import { Button, Col, Form, Input, Row, Select, Space } from "antd";
import { useMemo } from "react";
import { getDefaultValueByConfig } from "..";
import {
  type IQueryFilterComponentProps,
  queryFilterComponentDefaultConfig,
} from ".";

function parseOptions(optionsText: string) {
  return optionsText
    .split(/[、,，|]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((value) => ({ label: value, value }));
}

export default function QueryFilterComponent(_props: IQueryFilterComponentProps) {
  const props = useMemo(() => {
    return {
      ...getDefaultValueByConfig(queryFilterComponentDefaultConfig),
      ..._props,
    };
  }, [_props]);

  const span = props.columns === 2 ? 12 : props.columns === 3 ? 8 : 6;

  return (
    <div
      style={{
        borderRadius: 20,
        background: "#ffffff",
        padding: 24,
        border: "1px solid #e5e7eb",
      }}
    >
      <Form layout="vertical">
        <Row gutter={[16, 12]}>
          {props.fields.map((field) => (
            <Col span={span} key={field.id}>
              <Form.Item label={field.label}>
                {field.type === "select" ? (
                  <Select
                    placeholder={field.placeholder}
                    options={parseOptions(field.optionsText)}
                    allowClear
                  />
                ) : (
                  <Input placeholder={field.placeholder} />
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>

        <Space wrap>
          {props.showSearchButton && <Button type="primary">{props.searchText}</Button>}
          {props.showResetButton && <Button>{props.resetText}</Button>}
        </Space>
      </Form>
    </div>
  );
}
