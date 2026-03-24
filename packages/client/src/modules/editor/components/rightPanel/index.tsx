import { useState } from "react";
import { Tabs, Tooltip } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  CodeOutlined,
  RobotOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import ComponentFields from "./ComponentFields";
import GlobalFields from "./GlobalFields";
import CodeSyncPanel from "./CodeSyncPanel";
import AIChatPanel from "./AIChatPanel";
import PermissionPanel from "./PermissionPanel";
import { useStoreComponents, useStorePage } from "@/shared/hooks";

export default function EditorRightPanel() {
  const { store: storePage, setEditorMode } = useStorePage();
  const { store: storeComps } = useStoreComponents();
  const [activeKey, setActiveKey] = useState("components-fields");

  const items = [
    {
      key: "components-fields",
      label: (
        <Tooltip title="组件属性" placement="bottom">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg transition-all">
            <AppstoreOutlined className="text-lg" />
          </div>
        </Tooltip>
      ),
      children: <ComponentFields store={storeComps} />,
    },
    {
      key: "page-fields",
      label: (
        <Tooltip title="全局属性" placement="bottom">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg transition-all">
            <SettingOutlined className="text-lg" />
          </div>
        </Tooltip>
      ),
      children: <GlobalFields store={storePage} />,
    },
    {
      key: "code-sync",
      label: (
        <Tooltip title="源码同步" placement="bottom">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg transition-all">
            <CodeOutlined className="text-lg" />
          </div>
        </Tooltip>
      ),
      children: <CodeSyncPanel />,
    },
    {
      key: "ai-chat",
      label: (
        <Tooltip title="AI生成" placement="bottom">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg transition-all">
            <RobotOutlined className="text-lg" />
          </div>
        </Tooltip>
      ),
      children: <AIChatPanel />,
    },
    {
      key: "permission",
      label: (
        <Tooltip title="协作权限" placement="bottom">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg transition-all">
            <TeamOutlined className="text-lg" />
          </div>
        </Tooltip>
      ),
      children: <PermissionPanel />,
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    if (key === "code-sync") {
      setEditorMode("code");
    } else {
      setEditorMode("visual");
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-transparent">
      <Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        items={items}
        centered
        className="h-full editor-right-tabs [&>.ant-tabs-nav]:px-2 [&>.ant-tabs-nav]:pt-3 [&>.ant-tabs-nav]:mb-0 [&>.ant-tabs-nav::before]:border-b-slate-100 [&>.ant-tabs-content-holder]:overflow-y-auto [&>.ant-tabs-content-holder]:px-5 [&>.ant-tabs-content-holder]:py-4 [&_.ant-tabs-tab]:!m-0 [&_.ant-tabs-tab]:!p-1 [&_.ant-tabs-tab-active_div]:text-emerald-500 [&_.ant-tabs-tab-active_div]:bg-emerald-500/10 [&_.ant-tabs-ink-bar]:bg-emerald-500 scrollbar-thin scrollbar-thumb-slate-200/60 hover:scrollbar-thumb-slate-300 scrollbar-track-transparent"
      />
    </div>
  );
}
