import {
  ApartmentOutlined,
  BarChartOutlined,
  BarsOutlined,
  BorderOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  EditOutlined,
  ExpandOutlined,
  FilterOutlined,
  FontColorsOutlined,
  FontSizeOutlined,
  FormOutlined,
  FundViewOutlined,
  LayoutOutlined,
  LineChartOutlined,
  MinusOutlined,
  PieChartOutlined,
  SplitCellsOutlined,
  TableOutlined,
  UnorderedListOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { PageCategory, TComponentTypes } from "@codigo/schema";
import type { FC, ReactNode } from "react";
import { AlertComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeAlert";
import { BreadcrumbBarComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeBreadcrumbBar";
import { ButtonComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeButton";
import { CardComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeCard";
import { CardGridComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeCardGrid";
import { ChartComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeChart";
import { CheckboxComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeCheckbox";
import { ContainerComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeContainer";
import { DataTableComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeDataTable";
import { EmptyComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeEmpty";
import { ImageComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeImage";
import { InputComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeInput";
import { ListComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeList";
import { PageHeaderComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodePageHeader";
import { QrcodeComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeQrcode";
import { QueryFilterComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeQueryFilter";
import { RadioComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeRadio";
import { RichTextComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeRichText";
import { SplitComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeSplit";
import { StatCardComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeStatCard";
import { StatisticComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeStatistic";
import { SwiperComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeSwiper";
import { TableComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeTable";
import { TextComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeText";
import { TwoColumnComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeTwoColumn";

export type EditorComponentSectionKey = "basic" | "form" | "report";

export interface EditorComponentMeta {
  type: TComponentTypes;
  name: string;
  icon: ReactNode;
  sectionKey: EditorComponentSectionKey;
  propsEditor: FC<any>;
  quickInsert?: boolean;
  hiddenFromPalette?: boolean;
  codeSync?: boolean;
  categories?: PageCategory[];
}

export interface EditorComponentSection {
  key: EditorComponentSectionKey;
  label: string;
  items: EditorComponentMeta[];
}

export type PageLayoutPresetKey =
  | "sectionStack"
  | "sidebarLayout"
  | "dashboardLayout";

export interface PageLayoutPresetMeta {
  key: PageLayoutPresetKey;
  name: string;
  description: string;
  icon: ReactNode;
  categories?: PageCategory[];
}

const sectionLabelMap: Record<EditorComponentSectionKey, string> = {
  basic: "基础",
  form: "表单",
  report: "报表",
};

export const editorComponentCatalog: EditorComponentMeta[] = [
  {
    type: "breadcrumbBar",
    name: "面包屑",
    icon: <ApartmentOutlined />,
    sectionKey: "basic",
    propsEditor: BreadcrumbBarComponentProps,
  },
  {
    type: "pageHeader",
    name: "页面头",
    icon: <BarsOutlined />,
    sectionKey: "basic",
    propsEditor: PageHeaderComponentProps,
  },
  {
    type: "queryFilter",
    name: "搜索区",
    icon: <FilterOutlined />,
    sectionKey: "basic",
    propsEditor: QueryFilterComponentProps,
  },
  {
    type: "statCard",
    name: "统计卡片",
    icon: <DashboardOutlined />,
    sectionKey: "basic",
    propsEditor: StatCardComponentProps,
  },
  {
    type: "cardGrid",
    name: "卡片网格",
    icon: <CreditCardOutlined />,
    sectionKey: "basic",
    propsEditor: CardGridComponentProps,
  },
  {
    type: "dataTable",
    name: "数据表格",
    icon: <TableOutlined />,
    sectionKey: "basic",
    propsEditor: DataTableComponentProps,
  },
  {
    type: "container",
    name: "容器",
    icon: <LayoutOutlined />,
    sectionKey: "basic",
    propsEditor: ContainerComponentProps,
  },
  {
    type: "twoColumn",
    name: "双栏布局",
    icon: <LayoutOutlined />,
    sectionKey: "basic",
    propsEditor: TwoColumnComponentProps,
  },
  {
    type: "button",
    name: "按钮",
    icon: <BorderOutlined />,
    sectionKey: "basic",
    propsEditor: ButtonComponentProps,
    quickInsert: true,
  },
  {
    type: "swiper",
    name: "轮播",
    icon: <SplitCellsOutlined />,
    sectionKey: "basic",
    propsEditor: SwiperComponentProps,
  },
  {
    type: "card",
    name: "卡片",
    icon: <CreditCardOutlined />,
    sectionKey: "basic",
    propsEditor: CardComponentProps,
  },
  {
    type: "list",
    name: "列表",
    icon: <UnorderedListOutlined />,
    sectionKey: "basic",
    propsEditor: ListComponentProps,
  },
  {
    type: "image",
    name: "图片",
    icon: <FundViewOutlined />,
    sectionKey: "basic",
    propsEditor: ImageComponentProps,
    quickInsert: true,
  },
  {
    type: "titleText",
    name: "文本",
    icon: <FontSizeOutlined />,
    sectionKey: "basic",
    propsEditor: TextComponentProps,
    quickInsert: true,
  },
  {
    type: "split",
    name: "分割",
    icon: <MinusOutlined />,
    sectionKey: "basic",
    propsEditor: SplitComponentProps,
  },
  {
    type: "richText",
    name: "富文本",
    icon: <FontColorsOutlined />,
    sectionKey: "basic",
    propsEditor: RichTextComponentProps,
  },
  {
    type: "empty",
    name: "空状态",
    icon: <ExpandOutlined />,
    sectionKey: "basic",
    propsEditor: EmptyComponentProps,
  },
  {
    type: "alert",
    name: "警告",
    icon: <WarningOutlined />,
    sectionKey: "basic",
    propsEditor: AlertComponentProps,
  },
  {
    type: "input",
    name: "输入框",
    icon: <EditOutlined />,
    sectionKey: "form",
    propsEditor: InputComponentProps,
  },
  {
    type: "textArea",
    name: "文本域",
    icon: <FormOutlined />,
    sectionKey: "form",
    propsEditor: InputComponentProps,
  },
  {
    type: "radio",
    name: "单选框",
    icon: <CheckCircleOutlined />,
    sectionKey: "form",
    propsEditor: RadioComponentProps,
  },
  {
    type: "checkbox",
    name: "多选框",
    icon: <CheckSquareOutlined />,
    sectionKey: "form",
    propsEditor: CheckboxComponentProps,
  },
  {
    type: "statistic",
    name: "统计指标",
    icon: <DashboardOutlined />,
    sectionKey: "report",
    propsEditor: StatisticComponentProps,
  },
  {
    type: "table",
    name: "表格",
    icon: <TableOutlined />,
    sectionKey: "report",
    propsEditor: TableComponentProps,
  },
  {
    type: "barChart",
    name: "柱状图",
    icon: <BarChartOutlined />,
    sectionKey: "report",
    propsEditor: ChartComponentProps,
  },
  {
    type: "lineChart",
    name: "折线图",
    icon: <LineChartOutlined />,
    sectionKey: "report",
    propsEditor: ChartComponentProps,
  },
  {
    type: "pieChart",
    name: "饼图",
    icon: <PieChartOutlined />,
    sectionKey: "report",
    propsEditor: ChartComponentProps,
  },
  {
    type: "radarChart",
    name: "雷达图",
    icon: <PieChartOutlined />,
    sectionKey: "report",
    propsEditor: ChartComponentProps,
    hiddenFromPalette: true,
  },
  {
    type: "funnelChart",
    name: "漏斗图",
    icon: <BarChartOutlined />,
    sectionKey: "report",
    propsEditor: ChartComponentProps,
    hiddenFromPalette: true,
  },
  {
    type: "qrcode",
    name: "二维码",
    icon: <BorderOutlined />,
    sectionKey: "basic",
    propsEditor: QrcodeComponentProps,
    hiddenFromPalette: true,
  },
];

export const pageLayoutPresetCatalog: PageLayoutPresetMeta[] = [
  {
    key: "sectionStack",
    name: "分区布局",
    description: "头部、内容、页脚三段式骨架",
    icon: <LayoutOutlined />,
  },
  {
    key: "sidebarLayout",
    name: "侧栏布局",
    description: "左侧导航 + 右侧主内容区域",
    icon: <ApartmentOutlined />,
  },
  {
    key: "dashboardLayout",
    name: "工作台布局",
    description: "适合后台页的信息总览与操作区",
    icon: <DashboardOutlined />,
    categories: ["admin"],
  },
];

export const editorComponentMap = Object.fromEntries(
  editorComponentCatalog.map((item) => [item.type, item]),
) as Partial<Record<TComponentTypes, EditorComponentMeta>>;

const sectionOrder: EditorComponentSectionKey[] = [
  "basic",
  "form",
  "report",
];

/**
 * 获取编辑器组件分类
 * @param pageCategory 页面分类
 * @returns 组件分类
 */
export function getEditorComponentSections(pageCategory: PageCategory) {
  return sectionOrder.map((key) => ({
    key,
    label: sectionLabelMap[key],
    items: editorComponentCatalog.filter(
      (item) =>
        item.sectionKey === key &&
        !item.hiddenFromPalette &&
        (!item.categories?.length || item.categories.includes(pageCategory)),
    ),
  })) as EditorComponentSection[];
}

export function getPageLayoutPresets(pageCategory: PageCategory) {
  return pageLayoutPresetCatalog.filter((item) => {
    return !item.categories?.length || item.categories.includes(pageCategory);
  });
}

export function findEditorComponent(type?: string | null) {
  if (!type) {
    return null;
  }

  return editorComponentMap[type as TComponentTypes] ?? null;
}

export function getComponentPropsByType(type?: string | null) {
  return findEditorComponent(type)?.propsEditor ?? null;
}

export const quickInsertComponents = editorComponentCatalog
  .filter((item) => item.quickInsert)
  .map((item) => ({
    type: item.type,
    label: item.name,
  }));

export const codeSyncComponentTypes = editorComponentCatalog
  .filter((item) => item.codeSync ?? true)
  .map((item) => item.type);
