import type {
  TBasicComponentConfig,
  TransformedComponentConfig,
} from "@codigo/schema";

export interface IPageHeaderComponentProps {
  title: string;
  subtitle: string;
  tagsText: string;
  extraText: string;
}

export type TPageHeaderComponentConfig = TBasicComponentConfig<
  "pageHeader",
  IPageHeaderComponentProps
>;

export type TPageHeaderComponentConfigResult =
  TransformedComponentConfig<IPageHeaderComponentProps>;

export const pageHeaderComponentDefaultConfig: TPageHeaderComponentConfigResult =
  {
    title: {
      value: "搜索列表（应用）",
      defaultValue: "搜索列表（应用）",
      isHidden: false,
    },
    subtitle: {
      value: "用于展示后台系统的页面标题、说明与补充信息。",
      defaultValue: "用于展示后台系统的页面标题、说明与补充信息。",
      isHidden: false,
    },
    tagsText: {
      value: "后台,列表页,应用",
      defaultValue: "后台,列表页,应用",
      isHidden: false,
    },
    extraText: {
      value: "最近更新：今天 18:00",
      defaultValue: "最近更新：今天 18:00",
      isHidden: false,
    },
  };
