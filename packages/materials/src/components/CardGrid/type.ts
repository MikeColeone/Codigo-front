import type {
  TBasicComponentConfig,
  TransformedComponentConfig,
} from "@codigo/schema";

export interface ICardGridItem {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  extra: string;
}

export interface ICardGridComponentProps {
  columns: 2 | 3 | 4;
  items: ICardGridItem[];
}

export type TCardGridComponentConfig = TBasicComponentConfig<
  "cardGrid",
  ICardGridComponentProps
>;

export type TCardGridComponentConfigResult =
  TransformedComponentConfig<ICardGridComponentProps>;

export const cardGridItem: ICardGridItem = {
  id: "",
  title: "Alipay",
  subtitle: "活跃用户",
  value: "15万",
  extra: "新增用户 1,039",
};

export const cardGridComponentDefaultConfig: TCardGridComponentConfigResult = {
  columns: {
    value: 4,
    defaultValue: 4,
    isHidden: false,
  },
  items: {
    value: [
      {
        id: "card-grid-1",
        title: "Alipay",
        subtitle: "活跃用户",
        value: "15万",
        extra: "新增用户 1,039",
      },
      {
        id: "card-grid-2",
        title: "Angular",
        subtitle: "活跃用户",
        value: "16万",
        extra: "新增用户 1,041",
      },
      {
        id: "card-grid-3",
        title: "React",
        subtitle: "活跃用户",
        value: "12万",
        extra: "新增用户 1,463",
      },
      {
        id: "card-grid-4",
        title: "Vue",
        subtitle: "活跃用户",
        value: "14万",
        extra: "新增用户 1,477",
      },
    ],
    defaultValue: [
      {
        id: "card-grid-1",
        title: "Alipay",
        subtitle: "活跃用户",
        value: "15万",
        extra: "新增用户 1,039",
      },
      {
        id: "card-grid-2",
        title: "Angular",
        subtitle: "活跃用户",
        value: "16万",
        extra: "新增用户 1,041",
      },
      {
        id: "card-grid-3",
        title: "React",
        subtitle: "活跃用户",
        value: "12万",
        extra: "新增用户 1,463",
      },
      {
        id: "card-grid-4",
        title: "Vue",
        subtitle: "活跃用户",
        value: "14万",
        extra: "新增用户 1,477",
      },
    ],
    isHidden: false,
  },
};
