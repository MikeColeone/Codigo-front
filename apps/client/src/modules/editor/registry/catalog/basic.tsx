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
  LayoutOutlined,
  MinusOutlined,
  SplitCellsOutlined,
  TableOutlined,
  UnorderedListOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { getComponentByType as getBuiltinComponentByType } from "@codigo/materials";
import { AccordionComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeAccordion";
import { AlertComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeAlert";
import { AvatarComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeAvatar";
import { BreadcrumbBarComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeBreadcrumbBar";
import { ButtonComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeButton";
import { CardComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeCard";
import { CardGridComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeCardGrid";
import { ContainerComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeContainer";
import { DataTableComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeDataTable";
import { EmptyComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeEmpty";
import { ImageComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeImage";
import { ListComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeList";
import { PageHeaderComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodePageHeader";
import { QueryFilterComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeQueryFilter";
import { RichTextComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeRichText";
import { SplitComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeSplit";
import { StatCardComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeStatCard";
import { SwiperComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeSwiper";
import { TextComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeText";
import { TwoColumnComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeTwoColumn";
import type { EditorComponentMeta } from "../types";

export const basicEditorComponents: EditorComponentMeta[] = [
  {
    type: "accordion",
    name: "手风琴",
    icon: <BarsOutlined />,
    sectionKey: "basic",
    propsEditor: AccordionComponentProps,
    renderComponent: getBuiltinComponentByType("accordion"),
  },
  {
    type: "breadcrumbBar",
    name: "面包屑",
    icon: <ApartmentOutlined />,
    sectionKey: "basic",
    propsEditor: BreadcrumbBarComponentProps,
    renderComponent: getBuiltinComponentByType("breadcrumbBar"),
  },
  {
    type: "pageHeader",
    name: "页面头",
    icon: <BarsOutlined />,
    sectionKey: "basic",
    propsEditor: PageHeaderComponentProps,
    renderComponent: getBuiltinComponentByType("pageHeader"),
  },
  {
    type: "queryFilter",
    name: "搜索区",
    icon: <FilterOutlined />,
    sectionKey: "basic",
    propsEditor: QueryFilterComponentProps,
    renderComponent: getBuiltinComponentByType("queryFilter"),
  },
  {
    type: "statCard",
    name: "统计卡片",
    icon: <DashboardOutlined />,
    sectionKey: "basic",
    propsEditor: StatCardComponentProps,
    renderComponent: getBuiltinComponentByType("statCard"),
  },
  {
    type: "cardGrid",
    name: "卡片网格",
    icon: <CreditCardOutlined />,
    sectionKey: "basic",
    propsEditor: CardGridComponentProps,
    renderComponent: getBuiltinComponentByType("cardGrid"),
  },
  {
    type: "dataTable",
    name: "数据表格",
    icon: <TableOutlined />,
    sectionKey: "basic",
    propsEditor: DataTableComponentProps,
    renderComponent: getBuiltinComponentByType("dataTable"),
  },
  {
    type: "container",
    name: "容器",
    icon: <LayoutOutlined />,
    sectionKey: "basic",
    propsEditor: ContainerComponentProps,
    renderComponent: getBuiltinComponentByType("container"),
  },
  {
    type: "twoColumn",
    name: "双栏布局",
    icon: <LayoutOutlined />,
    sectionKey: "basic",
    propsEditor: TwoColumnComponentProps,
    renderComponent: getBuiltinComponentByType("twoColumn"),
  },
  {
    type: "button",
    name: "按钮",
    icon: <BorderOutlined />,
    sectionKey: "basic",
    propsEditor: ButtonComponentProps,
    renderComponent: getBuiltinComponentByType("button"),
    quickInsert: true,
  },
  {
    type: "swiper",
    name: "轮播",
    icon: <SplitCellsOutlined />,
    sectionKey: "basic",
    propsEditor: SwiperComponentProps,
    renderComponent: getBuiltinComponentByType("swiper"),
  },
  {
    type: "card",
    name: "卡片",
    icon: <CreditCardOutlined />,
    sectionKey: "basic",
    propsEditor: CardComponentProps,
    renderComponent: getBuiltinComponentByType("card"),
  },
  {
    type: "list",
    name: "列表",
    icon: <UnorderedListOutlined />,
    sectionKey: "basic",
    propsEditor: ListComponentProps,
    renderComponent: getBuiltinComponentByType("list"),
  },
  {
    type: "image",
    name: "图片",
    icon: <FundViewOutlined />,
    sectionKey: "basic",
    propsEditor: ImageComponentProps,
    renderComponent: getBuiltinComponentByType("image"),
    quickInsert: true,
  },
  {
    type: "avatar",
    name: "头像",
    icon: <UserOutlined />,
    sectionKey: "basic",
    propsEditor: AvatarComponentProps,
    renderComponent: getBuiltinComponentByType("avatar"),
    quickInsert: true,
  },
  {
    type: "titleText",
    name: "文本",
    icon: <FontSizeOutlined />,
    sectionKey: "basic",
    propsEditor: TextComponentProps,
    renderComponent: getBuiltinComponentByType("titleText"),
    quickInsert: true,
  },
  {
    type: "split",
    name: "分割",
    icon: <MinusOutlined />,
    sectionKey: "basic",
    propsEditor: SplitComponentProps,
    renderComponent: getBuiltinComponentByType("split"),
  },
  {
    type: "richText",
    name: "富文本",
    icon: <FontColorsOutlined />,
    sectionKey: "basic",
    propsEditor: RichTextComponentProps,
    renderComponent: getBuiltinComponentByType("richText"),
  },
  {
    type: "empty",
    name: "空状态",
    icon: <ExpandOutlined />,
    sectionKey: "basic",
    propsEditor: EmptyComponentProps,
    renderComponent: getBuiltinComponentByType("empty"),
  },
  {
    type: "alert",
    name: "警告",
    icon: <WarningOutlined />,
    sectionKey: "basic",
    propsEditor: AlertComponentProps,
    renderComponent: getBuiltinComponentByType("alert"),
  },
];
