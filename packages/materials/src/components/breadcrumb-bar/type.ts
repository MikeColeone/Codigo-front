import type {
  TBasicComponentConfig,
  TransformedComponentConfig,
} from "@codigo/schema";

export interface IBreadcrumbBarItem {
  id: string;
  label: string;
}

export interface IBreadcrumbBarComponentProps {
  items: IBreadcrumbBarItem[];
  separator: "/" | ">";
}

export type TBreadcrumbBarComponentConfig = TBasicComponentConfig<
  "breadcrumbBar",
  IBreadcrumbBarComponentProps
>;

export type TBreadcrumbBarComponentConfigResult =
  TransformedComponentConfig<IBreadcrumbBarComponentProps>;

export const breadcrumbBarItem: IBreadcrumbBarItem = {
  id: "",
  label: "列表页",
};

export const breadcrumbBarComponentDefaultConfig: TBreadcrumbBarComponentConfigResult =
  {
    items: {
      value: [
        { id: "breadcrumb-home", label: "后台" },
        { id: "breadcrumb-list", label: "列表页" },
        { id: "breadcrumb-search", label: "搜索列表" },
      ],
      defaultValue: [
        { id: "breadcrumb-home", label: "后台" },
        { id: "breadcrumb-list", label: "列表页" },
        { id: "breadcrumb-search", label: "搜索列表" },
      ],
      isHidden: false,
    },
    separator: {
      value: "/",
      defaultValue: "/",
      isHidden: false,
    },
  };
