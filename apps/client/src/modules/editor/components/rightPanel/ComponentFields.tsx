import type { FC } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { getComponentContainerMeta } from "@codigo/materials";
import {
  AppstoreOutlined,
  BorderOutlined,
  DragOutlined,
  NodeIndexOutlined,
  ShrinkOutlined,
} from "@ant-design/icons";
import type { ActionConfig, ComponentNode } from "@codigo/schema";
import type { ReactNode } from "react";
import { getComponentPropsByType } from "@/modules/editor/registry/components";
import type { TStoreComponents } from "@/shared/stores";
import { useStoreComponents } from "@/shared/hooks";
import { Button, Collapse, Empty, Form, Input, InputNumber, Select } from "antd";

const { Panel } = Collapse;

const actionTypeOptions = [
  { label: "设置状态", value: "setState" },
  { label: "页面跳转", value: "navigate" },
  { label: "打开链接", value: "openUrl" },
  { label: "滚动定位", value: "scrollTo" },
] as const;

function createDefaultAction(type: ActionConfig["type"]): ActionConfig {
  switch (type) {
    case "navigate":
      return { type, path: "/admin/users" };
    case "openUrl":
      return { type, url: "https://example.com", target: "_blank" };
    case "scrollTo":
      return { type, targetId: "section-overview" };
    default:
      return { type: "setState", key: "activePanel", value: "overview" };
  }
}

const ComponentFields: FC<{ store: TStoreComponents }> = observer(
  ({ store }) => {
    if (!store.currentCompConfig)
      return (
        <div className="py-6">
          <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50/80 p-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-xl text-emerald-600">
              <AppstoreOutlined />
            </div>
            <div className="mb-1.5 text-sm font-semibold text-slate-900">
              暂未选中组件
            </div>
            <div className="mb-4 text-[13px] leading-5 text-slate-500">
              先在画布中点击一个组件，或从左侧资源库拖入新组件，再在这里完成细节配置。
            </div>
            <div className="grid grid-cols-3 gap-2.5 text-left">
              {[
                {
                  key: "content",
                  icon: <AppstoreOutlined />,
                  title: "编辑内容",
                  desc: "修改当前组件的文案、数据和事件。",
                },
                {
                  key: "layout",
                  icon: <DragOutlined />,
                  title: "调整布局",
                  desc: "设置位置、尺寸、边距与画布结构。",
                },
                {
                  key: "style",
                  icon: <ShrinkOutlined />,
                  title: "细化样式",
                  desc: "统一页面节奏，让视觉更稳定。",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="rounded-[18px] border border-white bg-white px-3 py-2.5 shadow-[0_16px_30px_-28px_rgba(15,23,42,0.65)]"
                >
                  <div className="mb-1.5 text-emerald-600">{item.icon}</div>
                  <div className="text-[13px] font-medium text-slate-900">
                    {item.title}
                  </div>
                  <div className="mt-1 text-[11px] leading-5 text-slate-400">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={false}
              className="!mb-0 !mt-5"
            />
          </div>
        </div>
      );

    const {
      getComponentTree,
      getCurrentComponentConfig,
      getAvailableSlots,
      setCurrentComponent,
      updateCurrentComponentEvents,
      updateCurrentComponentStyles,
    } = useStoreComponents();
    const config = getCurrentComponentConfig.get();

    if (!config) return null;

    const ComponentProps = getComponentPropsByType(config.type);
    const styles = config.styles || {};
    const currentConfigId = config.id;
    const containerMeta = getComponentContainerMeta(config.type);
    const currentSlots = getAvailableSlots(config.type);
    const childrenCount = config.childIds?.length ?? 0;
    const eventActions = (toJS(config.events?.onClick) ?? []) as ActionConfig[];

    const componentTree = getComponentTree.get();

    function renderTree(node: ComponentNode, depth = 0): ReactNode {
      const isActive = node.id === currentConfigId;
      return (
        <div key={node.id} style={{ marginLeft: depth * 12 }}>
          <button
            type="button"
            onClick={() => setCurrentComponent(node.id)}
            className={`mb-2 flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition ${
              isActive
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="text-sm font-medium">{node.type}</span>
            <span className="text-[11px] text-slate-400">
              {node.slot ?? "root"}
            </span>
          </button>
          {node.children?.map((child) => renderTree(child, depth + 1))}
        </div>
      );
    }

    const handleStyleChange = (_changedValues: any, allValues: any) => {
      const formattedStyles = { ...allValues };
      Object.keys(formattedStyles).forEach((key) => {
        if (typeof formattedStyles[key] === "number") {
          formattedStyles[key] = `${formattedStyles[key]}px`;
        }
      });
      updateCurrentComponentStyles(formattedStyles);
    };

    const initialValues: Record<string, any> = { ...styles };
    Object.keys(initialValues).forEach((key) => {
      if (
        typeof initialValues[key] === "string" &&
        initialValues[key].endsWith("px")
      ) {
        initialValues[key] = parseFloat(initialValues[key]);
      }
    });

    const styleSections = [
      {
        key: "position",
        title: "位置",
        icon: <DragOutlined />,
        fields: [
          { label: "X 坐标", name: "left", placeholder: "px" },
          { label: "Y 坐标", name: "top", placeholder: "px" },
        ],
      },
      {
        key: "size",
        title: "尺寸",
        icon: <BorderOutlined />,
        fields: [
          { label: "宽度", name: "width", placeholder: "默认 100%" },
          { label: "高度", name: "height", placeholder: "默认 auto" },
        ],
      },
      {
        key: "margin",
        title: "外间距",
        icon: <ShrinkOutlined />,
        fields: [
          { label: "上间距", name: "marginTop", placeholder: "px" },
          { label: "下间距", name: "marginBottom", placeholder: "px" },
          { label: "左间距", name: "marginLeft", placeholder: "px" },
          { label: "右间距", name: "marginRight", placeholder: "px" },
        ],
      },
      {
        key: "padding",
        title: "内间距",
        icon: <AppstoreOutlined />,
        fields: [
          { label: "上间距", name: "paddingTop", placeholder: "px" },
          { label: "下间距", name: "paddingBottom", placeholder: "px" },
          { label: "左间距", name: "paddingLeft", placeholder: "px" },
          { label: "右间距", name: "paddingRight", placeholder: "px" },
        ],
      },
    ];

    const updateEventActions = (actions: ActionConfig[]) => {
      updateCurrentComponentEvents("onClick", actions);
    };

    const addEventAction = (type: ActionConfig["type"]) => {
      updateEventActions([...eventActions, createDefaultAction(type)]);
    };

    const updateEventAction = (
      index: number,
      nextAction: ActionConfig | Partial<ActionConfig>,
      preserveType = true,
    ) => {
      updateEventActions(
        eventActions.map((action, actionIndex) => {
          if (actionIndex !== index) return action;
          if ("type" in nextAction && !preserveType) {
            return createDefaultAction(nextAction.type);
          }
          return { ...action, ...nextAction } as ActionConfig;
        }),
      );
    };

    const removeEventAction = (index: number) => {
      updateEventActions(
        eventActions.filter((_, actionIndex) => actionIndex !== index),
      );
    };

    return (
      <div className="component-fields-container space-y-3 pb-8">
        <div className="rounded-[22px] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(255,255,255,0.98))] p-3.5 shadow-[0_20px_40px_-32px_rgba(16,185,129,0.85)]">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Active
            </span>
            <span className="rounded-full bg-slate-900/5 px-2.5 py-1 text-[11px] text-slate-500">
              ID · {config.id.slice(-6)}
            </span>
          </div>
          <div className="text-sm font-semibold text-slate-900">
            {config.type}
          </div>
        </div>

        <Collapse
          defaultActiveKey={["props", "events", "structure", "styles"]}
          ghost
          expandIconPosition="end"
          className="[&_.ant-collapse-item]:mb-2.5 [&_.ant-collapse-item]:overflow-hidden [&_.ant-collapse-item]:rounded-[22px] [&_.ant-collapse-item]:border [&_.ant-collapse-item]:border-slate-200/80 [&_.ant-collapse-item]:bg-white [&_.ant-collapse-header]:!items-center [&_.ant-collapse-header]:!px-4 [&_.ant-collapse-header]:!py-3 [&_.ant-collapse-content-box]:!px-4 [&_.ant-collapse-content-box]:!pb-4 [&_.ant-collapse-content-box]:!pt-1"
        >
          <Panel
            header={
              <div>
                <div className="font-semibold text-slate-900">组件属性</div>
                <div className="text-xs text-slate-400">
                  配置业务内容、字段和交互逻辑
                </div>
              </div>
            }
            key="props"
          >
            <div className="rounded-[18px] border border-slate-100 bg-slate-50/70 p-3.5">
              {ComponentProps ? (
                <ComponentProps {...toJS(config.props)} id={config.id} />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-[13px] text-slate-400">
                  当前组件暂未配置属性面板
                </div>
              )}
            </div>
          </Panel>

          <Panel
            header={
              <div>
                <div className="font-semibold text-slate-900">交互事件</div>
                <div className="text-xs text-slate-400">
                  当前先开放 onClick，动作按顺序串行执行
                </div>
              </div>
            }
            key="events"
          >
            <div className="space-y-3">
              <div className="rounded-[18px] border border-slate-100 bg-slate-50/70 p-3.5">
                <div className="flex flex-wrap gap-2">
                  {actionTypeOptions.map((item) => (
                    <Button
                      key={item.value}
                      size="small"
                      onClick={() => addEventAction(item.value)}
                      className="!rounded-xl !border-slate-200 !bg-white !text-slate-600 hover:!border-emerald-300 hover:!text-emerald-600"
                    >
                      添加{item.label}
                    </Button>
                  ))}
                </div>
              </div>

              {eventActions.length ? (
                eventActions.map((action, index) => (
                  <div
                    key={`${action.type}-${index}`}
                    className="rounded-[18px] border border-slate-100 bg-slate-50/70 p-3.5"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                          #{index + 1}
                        </span>
                        <Select
                          value={action.type}
                          options={actionTypeOptions as unknown as Array<{
                            label: string;
                            value: ActionConfig["type"];
                          }>}
                          onChange={(value) =>
                            updateEventAction(index, { type: value }, false)
                          }
                          className="min-w-[140px]"
                        />
                      </div>
                      <Button
                        size="small"
                        danger
                        type="text"
                        onClick={() => removeEventAction(index)}
                      >
                        删除
                      </Button>
                    </div>

                    {action.type === "setState" ? (
                      <div className="grid grid-cols-2 gap-2.5">
                        <Input
                          value={action.key}
                          onChange={(event) =>
                            updateEventAction(index, {
                              key: event.target.value,
                            })
                          }
                          placeholder="状态键，如 activePanel"
                        />
                        <Input
                          value={String(action.value ?? "")}
                          onChange={(event) =>
                            updateEventAction(index, {
                              value: event.target.value,
                            })
                          }
                          placeholder="状态值，如 overview"
                        />
                      </div>
                    ) : null}

                    {action.type === "navigate" ? (
                      <Input
                        value={action.path}
                        onChange={(event) =>
                          updateEventAction(index, {
                            path: event.target.value,
                          })
                        }
                        placeholder="站内路径，如 /admin/users"
                      />
                    ) : null}

                    {action.type === "openUrl" ? (
                      <div className="grid grid-cols-[1fr,132px] gap-2.5">
                        <Input
                          value={action.url}
                          onChange={(event) =>
                            updateEventAction(index, {
                              url: event.target.value,
                            })
                          }
                          placeholder="https://example.com"
                        />
                        <Select
                          value={action.target ?? "_blank"}
                          options={[
                            { label: "新窗口", value: "_blank" },
                            { label: "当前窗口", value: "_self" },
                          ]}
                          onChange={(value) =>
                            updateEventAction(index, { target: value })
                          }
                        />
                      </div>
                    ) : null}

                    {action.type === "scrollTo" ? (
                      <Input
                        value={action.targetId}
                        onChange={(event) =>
                          updateEventAction(index, {
                            targetId: event.target.value,
                          })
                        }
                        placeholder="目标锚点 ID，如 section-overview"
                      />
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded-[18px] border border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 text-center text-[13px] text-slate-400">
                  当前组件还没有配置点击事件
                </div>
              )}
            </div>
          </Panel>

          <Panel
            header={
              <div>
                <div className="font-semibold text-slate-900">结构与插槽</div>
                <div className="text-xs text-slate-400">
                  查看父子层级、插槽归属与容器能力
                </div>
              </div>
            }
            key="structure"
          >
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-[18px] border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="mb-2 text-xs text-slate-400">当前插槽</div>
                  <div className="text-[13px] font-semibold text-slate-900">
                    {config.slot ?? "root"}
                  </div>
                </div>
                <div className="rounded-[18px] border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="mb-2 text-xs text-slate-400">子节点数量</div>
                  <div className="text-[13px] font-semibold text-slate-900">
                    {childrenCount}
                  </div>
                </div>
              </div>

              <div className="rounded-[18px] border border-slate-100 bg-slate-50/70 p-3.5">
                <div className="mb-2.5 flex items-center gap-2 text-[13px] font-semibold text-slate-900">
                  <NodeIndexOutlined className="text-emerald-600" />
                  容器信息
                </div>
                <div className="space-y-1.5 text-[13px] text-slate-600">
                  <div>
                    类型：{containerMeta.isContainer ? "容器组件" : "普通组件"}
                  </div>
                  <div>
                    可用插槽：
                    {containerMeta.isContainer
                      ? currentSlots.map((item) => item.name).join(" / ")
                      : "无"}
                  </div>
                </div>
              </div>

              <div className="rounded-[18px] border border-slate-100 bg-slate-50/70 p-3.5">
                <div className="mb-2.5 text-[13px] font-semibold text-slate-900">
                  组件树
                </div>
                <div className="space-y-1">
                  {componentTree.map((node) => renderTree(node))}
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            header={
              <div>
                <div className="font-semibold text-slate-900">布局与间距</div>
                <div className="text-xs text-slate-400">
                  调整位置、尺寸与内外边距节奏
                </div>
              </div>
            }
            key="styles"
          >
            <Form
              layout="vertical"
              initialValues={initialValues}
              onValuesChange={handleStyleChange}
              className="[&_.ant-form-item]:mb-3.5 [&_.ant-form-item-label>label]:text-[13px] [&_.ant-form-item-label>label]:text-slate-500 [&_.ant-input-number]:!h-9 [&_.ant-input-number]:!w-full [&_.ant-input-number]:!rounded-xl [&_.ant-input-number]:!border-slate-200 [&_.ant-input-number]:!bg-slate-50/70"
            >
              <div className="space-y-3">
                {styleSections.map((section) => (
                  <div
                    key={section.key}
                    className="rounded-[18px] border border-slate-100 bg-slate-50/60 p-3.5"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                        {section.icon}
                      </span>
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900">
                          {section.title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {section.fields.length === 2
                            ? "双字段精确控制"
                            : "四向数值统一调整"}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {section.fields.map((field) => (
                        <Form.Item
                          key={String(field.name)}
                          label={field.label}
                          name={field.name}
                        >
                          <InputNumber placeholder={field.placeholder} />
                        </Form.Item>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Form>
          </Panel>
        </Collapse>
      </div>
    );
  },
);

export default ComponentFields;
