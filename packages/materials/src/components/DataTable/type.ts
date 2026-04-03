import type {
  TBasicComponentConfig,
  TransformedComponentConfig,
} from "@codigo/schema";

export interface IDataTableComponentProps {
  title: string;
  size: "large" | "middle" | "small";
  bordered: boolean;
  pagination: boolean;
  pageSize: number;
  columnsText: string;
  dataText: string;
  emptyText: string;
}

export type TDataTableComponentConfig = TBasicComponentConfig<
  "dataTable",
  IDataTableComponentProps
>;

export type TDataTableComponentConfigResult =
  TransformedComponentConfig<IDataTableComponentProps>;

const defaultColumns = [
  { title: "应用名称", dataIndex: "name" },
  { title: "负责人", dataIndex: "owner" },
  { title: "状态", dataIndex: "status" },
  { title: "更新时间", dataIndex: "updatedAt" },
];

const defaultData = [
  {
    key: "app_1",
    name: "搜索列表页",
    owner: "张三",
    status: "运行中",
    updatedAt: "2026-04-03 10:20",
  },
  {
    key: "app_2",
    name: "用户管理页",
    owner: "李四",
    status: "已停用",
    updatedAt: "2026-04-02 18:30",
  },
];

export const dataTableComponentDefaultConfig: TDataTableComponentConfigResult =
  {
    title: {
      value: "应用列表",
      defaultValue: "应用列表",
      isHidden: false,
    },
    size: {
      value: "middle",
      defaultValue: "middle",
      isHidden: false,
    },
    bordered: {
      value: true,
      defaultValue: true,
      isHidden: false,
    },
    pagination: {
      value: true,
      defaultValue: true,
      isHidden: false,
    },
    pageSize: {
      value: 10,
      defaultValue: 10,
      isHidden: false,
    },
    columnsText: {
      value: JSON.stringify(defaultColumns, null, 2),
      defaultValue: JSON.stringify(defaultColumns, null, 2),
      isHidden: false,
    },
    dataText: {
      value: JSON.stringify(defaultData, null, 2),
      defaultValue: JSON.stringify(defaultData, null, 2),
      isHidden: false,
    },
    emptyText: {
      value: "暂无数据",
      defaultValue: "暂无数据",
      isHidden: false,
    },
  };
