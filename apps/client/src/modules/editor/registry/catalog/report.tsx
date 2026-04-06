import {
  BarChartOutlined,
  DashboardOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { getComponentByType as getBuiltinComponentByType } from "@codigo/materials";
import { ChartComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeChart";
import { StatisticComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeStatistic";
import { TableComponentProps } from "@/modules/editor/components/LowCodeComponents/LowCodeTable";
import type { EditorComponentMeta } from "../types";

export const reportEditorComponents: EditorComponentMeta[] = [
  {
    type: "statistic",
    name: "统计指标",
    icon: <DashboardOutlined />,
    sectionKey: "report",
    propsEditor: StatisticComponentProps,
    renderComponent: getBuiltinComponentByType("statistic"),
  },
  {
    type: "table",
    name: "表格",
    icon: <TableOutlined />,
    sectionKey: "report",
    propsEditor: TableComponentProps,
    renderComponent: getBuiltinComponentByType("table"),
  },
  {
    type: "barChart",
    name: "柱状图",
    icon: <BarChartOutlined />,
    sectionKey: "report",
    propsEditor: ChartComponentProps,
    renderComponent: getBuiltinComponentByType("barChart"),
  },
  {
    type: "lineChart",
    name: "折线图",
    icon: <LineChartOutlined />,
    sectionKey: "report",
    propsEditor: ChartComponentProps,
    renderComponent: getBuiltinComponentByType("lineChart"),
  },
  {
    type: "pieChart",
    name: "饼图",
    icon: <PieChartOutlined />,
    sectionKey: "report",
    propsEditor: ChartComponentProps,
    renderComponent: getBuiltinComponentByType("pieChart"),
  },
  {
    type: "radarChart",
    name: "雷达图",
    icon: <PieChartOutlined />,
    sectionKey: "report",
    propsEditor: ChartComponentProps,
    renderComponent: getBuiltinComponentByType("radarChart"),
    hiddenFromPalette: true,
  },
  {
    type: "funnelChart",
    name: "漏斗图",
    icon: <BarChartOutlined />,
    sectionKey: "report",
    propsEditor: ChartComponentProps,
    renderComponent: getBuiltinComponentByType("funnelChart"),
    hiddenFromPalette: true,
  },
];
