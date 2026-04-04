import { Collapse } from "antd";
import { createElement, useMemo } from "react";
import { getDefaultValueByConfig } from "..";
import {
  accordionComponentDefaultConfig,
  type IAccordionComponentProps,
} from "./type";

/**
 * 渲染手风琴物料，支持单项展开与简洁边框模式。
 */
export default function AccordionComponent(_props: IAccordionComponentProps) {
  const props = useMemo(() => {
    return {
      ...getDefaultValueByConfig(accordionComponentDefaultConfig),
      ..._props,
    };
  }, [_props]);

  const items = useMemo(() => {
    return props.items.map((item) => ({
      key: item.id || item.title,
      label: item.title,
      children: createElement(
        "div",
        { className: "whitespace-pre-wrap break-words" },
        item.content,
      ),
    }));
  }, [props.items]);

  return createElement(Collapse, {
    accordion: props.accordion,
    ghost: props.ghost,
    items,
  });
}
