import {
  ApartmentOutlined,
  BarsOutlined,
  BorderOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  ExpandOutlined,
  FilterOutlined,
  FontColorsOutlined,
  FontSizeOutlined,
  FundViewOutlined,
  MinusOutlined,
  PlayCircleOutlined,
  QrcodeOutlined,
  SplitCellsOutlined,
  TableOutlined,
  UnorderedListOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { accordionComponentProps } from "@/modules/editor/components/low-code-components/low-code-accordion";
import { alertComponentProps } from "@/modules/editor/components/low-code-components/low-code-alert";
import { avatarComponentProps } from "@/modules/editor/components/low-code-components/low-code-avatar";
import { breadcrumbBarComponentProps } from "@/modules/editor/components/low-code-components/low-code-breadcrumb-bar";
import { buttonComponentProps } from "@/modules/editor/components/low-code-components/low-code-button";
import { cardComponentProps } from "@/modules/editor/components/low-code-components/low-code-card";
import { cardGridComponentProps } from "@/modules/editor/components/low-code-components/low-code-card-grid";
import { dataTableComponentProps } from "@/modules/editor/components/low-code-components/low-code-data-table";
import { emptyComponentProps } from "@/modules/editor/components/low-code-components/low-code-empty";
import { imageComponentProps } from "@/modules/editor/components/low-code-components/low-code-image";
import { listComponentProps } from "@/modules/editor/components/low-code-components/low-code-list";
import { pageHeaderComponentProps } from "@/modules/editor/components/low-code-components/low-code-page-header";
import { queryFilterComponentProps } from "@/modules/editor/components/low-code-components/low-code-query-filter";
import { qrcodeComponentProps } from "@/modules/editor/components/low-code-components/low-code-qrcode";
import { richTextComponentProps } from "@/modules/editor/components/low-code-components/low-code-rich-text";
import { splitComponentProps } from "@/modules/editor/components/low-code-components/low-code-split";
import { StatcardComponentProps } from "@/modules/editor/components/low-code-components/low-code-stat-card";
import { swiperComponentProps } from "@/modules/editor/components/low-code-components/low-code-swiper";
import { textComponentProps } from "@/modules/editor/components/low-code-components/low-code-text";
import { videoComponentProps } from "@/modules/editor/components/low-code-components/low-code-video";
import type { EditorComponentMeta } from "../types";

export const basicEditorComponents: EditorComponentMeta[] = [
  {
    type: "accordion",
    name: "手风琴",
    icon: <BarsOutlined />,
    sectionKey: "basic",
    propsEditor: accordionComponentProps,
  },
  {
    type: "breadcrumbBar",
    name: "面包屑",
    icon: <ApartmentOutlined />,
    sectionKey: "basic",
    propsEditor: breadcrumbBarComponentProps,
  },
  {
    type: "pageHeader",
    name: "页面头",
    icon: <BarsOutlined />,
    sectionKey: "basic",
    propsEditor: pageHeaderComponentProps,
  },
  {
    type: "queryFilter",
    name: "搜索区",
    icon: <FilterOutlined />,
    sectionKey: "basic",
    propsEditor: queryFilterComponentProps,
  },
  {
    type: "statCard",
    name: "统计卡片",
    icon: <DashboardOutlined />,
    sectionKey: "basic",
    propsEditor: StatcardComponentProps,
  },
  {
    type: "cardGrid",
    name: "卡片网格",
    icon: <CreditCardOutlined />,
    sectionKey: "basic",
    propsEditor: cardGridComponentProps,
  },
  {
    type: "dataTable",
    name: "数据表格",
    icon: <TableOutlined />,
    sectionKey: "basic",
    propsEditor: dataTableComponentProps,
  },
  {
    type: "button",
    name: "按钮",
    icon: <BorderOutlined />,
    sectionKey: "basic",
    propsEditor: buttonComponentProps,
    quickInsert: true,
  },
  {
    type: "swiper",
    name: "轮播",
    icon: <SplitCellsOutlined />,
    sectionKey: "basic",
    propsEditor: swiperComponentProps,
  },
  {
    type: "card",
    name: "卡片",
    icon: <CreditCardOutlined />,
    sectionKey: "basic",
    propsEditor: cardComponentProps,
  },
  {
    type: "list",
    name: "列表",
    icon: <UnorderedListOutlined />,
    sectionKey: "basic",
    propsEditor: listComponentProps,
  },
  {
    type: "image",
    name: "图片",
    icon: <FundViewOutlined />,
    sectionKey: "basic",
    propsEditor: imageComponentProps,
    quickInsert: true,
  },
  {
    type: "video",
    name: "视频",
    icon: <PlayCircleOutlined />,
    sectionKey: "basic",
    propsEditor: videoComponentProps,
  },
  {
    type: "avatar",
    name: "头像",
    icon: <UserOutlined />,
    sectionKey: "basic",
    propsEditor: avatarComponentProps,
    quickInsert: true,
  },
  {
    type: "titleText",
    name: "文本",
    icon: <FontSizeOutlined />,
    sectionKey: "basic",
    propsEditor: textComponentProps,
    quickInsert: true,
  },
  {
    type: "split",
    name: "分割",
    icon: <MinusOutlined />,
    sectionKey: "basic",
    propsEditor: splitComponentProps,
  },
  {
    type: "richText",
    name: "富文本",
    icon: <FontColorsOutlined />,
    sectionKey: "basic",
    propsEditor: richTextComponentProps,
  },
  {
    type: "qrcode",
    name: "二维码",
    icon: <QrcodeOutlined />,
    sectionKey: "basic",
    propsEditor: qrcodeComponentProps,
  },
  {
    type: "empty",
    name: "空状态",
    icon: <ExpandOutlined />,
    sectionKey: "basic",
    propsEditor: emptyComponentProps,
  },
  {
    type: "alert",
    name: "警告",
    icon: <WarningOutlined />,
    sectionKey: "basic",
    propsEditor: alertComponentProps,
  },
];
