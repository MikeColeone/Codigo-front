import type {
  TBasicComponentConfig,
  TransformedComponentConfig,
} from "@codigo/schema";

export type QueryFilterFieldType = "input" | "select";

export interface IQueryFilterField {
  id: string;
  label: string;
  field: string;
  type: QueryFilterFieldType;
  placeholder: string;
  optionsText: string;
}

export interface IQueryFilterComponentProps {
  fields: IQueryFilterField[];
  columns: 2 | 3 | 4;
  searchText: string;
  resetText: string;
  showSearchButton: boolean;
  showResetButton: boolean;
}

export type TQueryFilterComponentConfig = TBasicComponentConfig<
  "queryFilter",
  IQueryFilterComponentProps
>;

export type TQueryFilterComponentConfigResult =
  TransformedComponentConfig<IQueryFilterComponentProps>;

export const queryFilterField: IQueryFilterField = {
  id: "",
  label: "关键词",
  field: "keyword",
  type: "input",
  placeholder: "请输入",
  optionsText: "",
};

export const queryFilterComponentDefaultConfig: TQueryFilterComponentConfigResult =
  {
    fields: {
      value: [
        {
          id: "query-keyword",
          label: "关键词",
          field: "keyword",
          type: "input",
          placeholder: "请输入应用名称",
          optionsText: "",
        },
        {
          id: "query-status",
          label: "状态",
          field: "status",
          type: "select",
          placeholder: "请选择状态",
          optionsText: "全部,运行中,已停用",
        },
      ],
      defaultValue: [
        {
          id: "query-keyword",
          label: "关键词",
          field: "keyword",
          type: "input",
          placeholder: "请输入应用名称",
          optionsText: "",
        },
        {
          id: "query-status",
          label: "状态",
          field: "status",
          type: "select",
          placeholder: "请选择状态",
          optionsText: "全部,运行中,已停用",
        },
      ],
      isHidden: false,
    },
    columns: {
      value: 4,
      defaultValue: 4,
      isHidden: false,
    },
    searchText: {
      value: "搜索",
      defaultValue: "搜索",
      isHidden: false,
    },
    resetText: {
      value: "重置",
      defaultValue: "重置",
      isHidden: false,
    },
    showSearchButton: {
      value: true,
      defaultValue: true,
      isHidden: false,
    },
    showResetButton: {
      value: true,
      defaultValue: true,
      isHidden: false,
    },
  };
