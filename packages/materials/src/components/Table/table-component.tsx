import React, { useMemo } from "react";
import { Card, Table } from "antd";
import { getDefaultValueByConfig } from "..";
import { type ITableComponentProps, tableComponentDefaultConfig } from ".";

type TableColumn = {
  title: string;
  dataIndex: string;
};

interface TableRuntimeProps extends ITableComponentProps {
  runtimeHeight?: string | number;
}

/**
 * 安全解析表格配置中的 JSON 文本，解析失败时返回兜底数据。
 */
function parseJsonText<T>(text: string, fallback: T): T {
  try {
    const parsed = JSON.parse(text) as T;
    return parsed;
  } catch {
    return fallback;
  }
}

/**
 * 渲染通用表格物料，并将字符串配置转换为表头与数据源结构。
 */
export default function TableComponent(_props: TableRuntimeProps) {
  const props = useMemo(() => {
    return { ...getDefaultValueByConfig(tableComponentDefaultConfig), ..._props };
  }, [_props]);
  const hasRuntimeHeight =
    props.runtimeHeight !== undefined &&
    props.runtimeHeight !== null &&
    props.runtimeHeight !== "auto";

  const columns = useMemo(() => {
    const fallback = parseJsonText<TableColumn[]>(
      tableComponentDefaultConfig.columnsText.defaultValue,
      [],
    );
    return parseJsonText<TableColumn[]>(props.columnsText, fallback);
  }, [props.columnsText]);

  const dataSource = useMemo(() => {
    const fallback = parseJsonText<Record<string, unknown>[]>(
      tableComponentDefaultConfig.dataText.defaultValue,
      [],
    );
    return parseJsonText<Record<string, unknown>[]>(props.dataText, fallback);
  }, [props.dataText]);

  return (
    <div
      style={{
        height: hasRuntimeHeight ? "100%" : undefined,
        minHeight: hasRuntimeHeight ? 0 : undefined,
        overflow: hasRuntimeHeight ? "auto" : undefined,
      }}
    >
      <Card title={props.title} size="small">
        <Table
          size={props.size}
          bordered={props.bordered}
          columns={columns}
          dataSource={dataSource}
          pagination={props.pagination ? { pageSize: props.pageSize } : false}
        />
      </Card>
    </div>
  );
}
