import type {
  TBasicComponentConfig,
  TransformedComponentConfig,
} from "@codigo/schema";

export type TrendDirection = "up" | "down" | "flat";

export interface IStatCardComponentProps {
  title: string;
  value: string;
  suffix: string;
  trendText: string;
  trendDirection: TrendDirection;
  description: string;
}

export type TStatCardComponentConfig = TBasicComponentConfig<
  "statCard",
  IStatCardComponentProps
>;

export type TStatCardComponentConfigResult =
  TransformedComponentConfig<IStatCardComponentProps>;

export const statCardComponentDefaultConfig: TStatCardComponentConfigResult = {
  title: {
    value: "总访问量",
    defaultValue: "总访问量",
    isHidden: false,
  },
  value: {
    value: "126,560",
    defaultValue: "126,560",
    isHidden: false,
  },
  suffix: {
    value: "",
    defaultValue: "",
    isHidden: false,
  },
  trendText: {
    value: "较昨日 +12.5%",
    defaultValue: "较昨日 +12.5%",
    isHidden: false,
  },
  trendDirection: {
    value: "up",
    defaultValue: "up",
    isHidden: false,
  },
  description: {
    value: "适合展示核心指标、同比环比和补充说明。",
    defaultValue: "适合展示核心指标、同比环比和补充说明。",
    isHidden: false,
  },
};
