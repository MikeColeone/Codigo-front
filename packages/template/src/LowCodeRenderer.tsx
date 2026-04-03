import type { CSSProperties } from "react";
import { Empty } from "antd";
import { getComponentByType } from "@codigo/materials";
import {
  groupChildrenBySlot,
  type ActionConfig,
  type RuntimeStateValue,
  type SyncSchemaItem,
  type TComponentTypes,
} from "@codigo/schema";

interface RuntimeAction {
  type: "set-state";
  key: string;
  value: RuntimeStateValue;
}

interface RuntimeState {
  pageState: Record<string, RuntimeStateValue>;
  onAction?: (action: RuntimeAction | ActionConfig) => void;
}

interface LowCodeRendererProps {
  component: SyncSchemaItem;
  runtime?: RuntimeState;
}

function shouldRenderComponent(
  component: SyncSchemaItem,
  runtime?: RuntimeState,
) {
  if (!runtime) return true;

  const props = (component.props ?? {}) as Record<string, unknown>;
  const visibleStateKey = props.visibleStateKey;
  const visibleStateValue = props.visibleStateValue;

  if (
    typeof visibleStateKey !== "string" ||
    !visibleStateKey ||
    visibleStateValue === undefined ||
    visibleStateValue === ""
  ) {
    return true;
  }

  return runtime.pageState[visibleStateKey] === visibleStateValue;
}

function getLegacyClickActions(component: SyncSchemaItem): ActionConfig[] {
  const props = (component.props ?? {}) as Record<string, unknown>;

  if (props.actionType === "set-state") {
    const key = props.stateKey;
    const value = props.stateValue;

    if (typeof key === "string" && key && value !== undefined) {
      return [{ type: "setState", key, value: value as RuntimeStateValue }];
    }
  }

  if (props.actionType === "open-url" && typeof props.link === "string") {
    if (props.link.startsWith("#")) {
      return [{ type: "scrollTo", targetId: props.link.slice(1) }];
    }

    if (props.link) {
      return [{ type: "openUrl", url: props.link, target: "_blank" }];
    }
  }

  if (
    props.actionType === "scroll-to-id" &&
    typeof props.targetId === "string" &&
    props.targetId
  ) {
    return [{ type: "scrollTo", targetId: props.targetId }];
  }

  return [];
}

function getClickActions(component: SyncSchemaItem): ActionConfig[] {
  const configuredActions = Array.isArray(component.events?.onClick)
    ? component.events.onClick
    : [];

  return [...configuredActions, ...getLegacyClickActions(component)];
}

export function LowCodeRenderer({ component, runtime }: LowCodeRendererProps) {
  if (!shouldRenderComponent(component, runtime)) {
    return null;
  }

  const Component = getComponentByType(component.type as TComponentTypes);
  const wrapperStyle = (component.styles ?? {}) as CSSProperties;
  const renderedChildren =
    component.children?.map((child) => (
      <LowCodeRenderer
        key={child.id ?? `${child.type}-${child.slot ?? "default"}`}
        component={child}
        runtime={runtime}
      />
    )) ?? [];
  const groupedSlots = groupChildrenBySlot(component);
  const slots = Object.fromEntries(
    Object.entries(groupedSlots).map(([slotName, nodes]) => [
      slotName,
      nodes.map((child) =>
        renderedChildren.find((item) => String(item.key) === (child.id ?? "")),
      ),
    ]),
  );

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

  const clickActions = getClickActions(component);

  return (
    <div
      style={wrapperStyle}
      className="relative"
      onClick={() => {
        clickActions.forEach((action) => runtime?.onAction?.(action));
      }}
    >
      <Component
        {...component.props}
        onAction={runtime?.onAction}
        slots={slots}
        editorNodeId={component.id}
      />
    </div>
  );
}
