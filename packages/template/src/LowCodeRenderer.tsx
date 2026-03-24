import type { CSSProperties } from "react";
import { Empty } from "antd";
import { getComponentByType } from "@codigo/materials-react";
import type { SyncSchemaItem, TComponentTypes } from "@codigo/schema";

interface LowCodeRendererProps {
  component: SyncSchemaItem;
}

export function LowCodeRenderer({ component }: LowCodeRendererProps) {
  const Component = getComponentByType(component.type as TComponentTypes);
  const wrapperStyle = (component.styles ?? {}) as CSSProperties;

  if (!Component) {
    return (
      <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={`未注册组件：${component.type}`}
        />
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <Component {...component.props} />
    </div>
  );
}
