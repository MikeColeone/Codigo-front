import {
  BarChartOutlined,
  DashboardOutlined,
  GlobalOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { ChartComponentProps } from "@/modules/editor/components/low-code-components/low-code-chart";
import { geoMapComponentProps } from "@/modules/editor/components/low-code-components/low-code-geo-map";
import { statisticComponentProps } from "@/modules/editor/components/low-code-components/low-code-statistic";
import { tableComponentProps } from "@/modules/editor/components/low-code-components/low-code-table";
import type { EditorComponentMeta } from "../types";

export const reportEditorComponents: EditorComponentMeta[] = [
  {
    type: "statistic",
    name: "统计指标",
    icon: <DashboardOutlined />,
    sectionKey: "report",
    propsEditor: statisticComponentProps,
  },
  {
    type: "table",
    name: "表格",
    icon: <TableOutlined />,
    sectionKey: "report",
    propsEditor: tableComponentProps,
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
    type: "geoMap",
    name: "地图",
    icon: <GlobalOutlined />,
    sectionKey: "report",
    propsEditor: geoMapComponentProps,
  },
];
