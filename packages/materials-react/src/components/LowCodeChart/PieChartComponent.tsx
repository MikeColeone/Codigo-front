import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { getDefaultValueByConfig } from "..";
import { chartComponentDefaultConfig, type IChartComponentProps } from "./type";

function parseJsonText<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export default function PieChartComponent(_props: IChartComponentProps) {
  const props = useMemo(() => {
    return { ...getDefaultValueByConfig(chartComponentDefaultConfig), ..._props };
  }, [_props]);

  const ds = useMemo(() => {
    return parseJsonText<Record<string, unknown>[]>(props.dataText, []);
  }, [props.dataText]);

  const option = useMemo(() => {
    return {
      title: {
        text: props.title,
        textStyle: { fontSize: 14, fontWeight: 600 },
        top: 10,
        left: 10,
      },
      tooltip: { trigger: "item" },
      legend: { bottom: 10 },
      color: ["#2563eb", "#16a34a", "#d97706", "#7c3aed", "#0891b2", "#dc2626"],
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          center: ["50%", "50%"],
          data: ds.map((r) => ({
            name: r[props.nameKey],
            value: r[props.valueKey],
          })),
          itemStyle: { borderRadius: 4, borderColor: "#fff", borderWidth: 2 },
          label: { show: false },
        },
      ],
    };
  }, [props, ds]);

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "300px", backgroundColor: "#fff" }}>
      <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
