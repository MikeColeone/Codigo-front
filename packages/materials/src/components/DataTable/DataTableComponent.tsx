import { Table, Typography } from "antd";
import { useMemo } from "react";
import { getDefaultValueByConfig } from "..";
import { type IDataTableComponentProps, dataTableComponentDefaultConfig } from ".";

const { Title } = Typography;

function safeParse(value: string, fallback: unknown[]) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export default function DataTableComponent(_props: IDataTableComponentProps) {
  const props = useMemo(() => {
    return {
      ...getDefaultValueByConfig(dataTableComponentDefaultConfig),
      ..._props,
    };
  }, [_props]);

  const columns = safeParse(
    props.columnsText,
    JSON.parse(dataTableComponentDefaultConfig.columnsText.defaultValue),
  );
  const dataSource = safeParse(
    props.dataText,
    JSON.parse(dataTableComponentDefaultConfig.dataText.defaultValue),
  );

  return (
    <div
      style={{
        borderRadius: 20,
        background: "#ffffff",
        padding: 24,
        border: "1px solid #e5e7eb",
      }}
    >
      <Title level={4} style={{ marginTop: 0 }}>
        {props.title}
      </Title>
      <Table
        columns={columns}
        dataSource={dataSource}
        size={props.size}
        bordered={props.bordered}
        pagination={
          props.pagination
            ? {
                pageSize: props.pageSize,
              }
            : false
        }
        locale={{ emptyText: props.emptyText }}
      />
    </div>
  );
}
