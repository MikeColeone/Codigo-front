import type {
  TBasicComponentConfig,
  TransformedComponentConfig,
} from "@codigo/schema";
import type { IButtonComponentProps } from "../button/type";

/**
 * 描述手风琴物料的运行时属性。
 * 子项可以是手风琴或者按钮
 */
export interface IAccordionItem {
  id: string;
  text: string;
  isExpanded: boolean;
  active: boolean;
  children: IAccordionItem[] | IButtonComponentProps[];
  title: string;
  content: string;
}

/**
 * 描述手风琴物料的运行时事件配置。
 * id 组件唯一标识
 * accordion 是否为手风琴
 * ghost 是否为 ghost 组件
 * items 手风琴项
 */
export interface IAccordionComponentProps {
  id: string;
  accordion: boolean;
  ghost: boolean;
  items: IAccordionItem[];
}

/**
 * 描述手风琴物料的运行时事件配置。
 */
export type TAccordionComponentConfig = TBasicComponentConfig<
  "accordion",
  IAccordionComponentProps
>;

/**
 * 描述手风琴物料的运行时事件配置结果。
 */
export type TAccordionComponentConfigResult =
  TransformedComponentConfig<IAccordionComponentProps>;

/**
 * 描述手风琴物料的默认值。数据模型接口
 * id 组件唯一标识
 * text 手风琴项文本
 * isExpanded 是否展开
 * active 是否激活
 * children 子项
 * title 手风琴标题
 * content 手风琴内容
 */
export const accordionItemDefaultValue: IAccordionItem = {
  id: "",
  text: "",
  isExpanded: false,
  active: false,
  children: [],
  title: "手风琴标题",
  content: "这里是手风琴内容，支持输入多段说明。",
};

/**
 * 描述手风琴物料的默认值。手风琴组件在编辑器/属性面板中如何被配置。
 * id 组件唯一标识
 * accordion 是否为手风琴
 * ghost 是否为 ghost 组件
 * items 手风琴项
 */
export const accordionComponentDefaultConfig: TAccordionComponentConfigResult = {
  id: {
    value: "",
    defaultValue: "",
    isHidden: true,
  },
  accordion: {
    value: true,
    defaultValue: true,
    isHidden: false,
  },
  ghost: {
    value: false,
    defaultValue: false,
    isHidden: false,
  },
  items: {
    value: [accordionItemDefaultValue],
    defaultValue: [accordionItemDefaultValue],
    isHidden: false,
  },
};
