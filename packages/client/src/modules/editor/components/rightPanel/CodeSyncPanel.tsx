import { useEffect } from "react";
import { useRequest } from "ahooks";
import { observer } from "mobx-react-lite";
import { useSearchParams } from "react-router-dom";
import { Alert, Descriptions, Space, Tag,Button,Typography } from "antd";
import { useStorePage } from "@/shared/hooks";
import {
  getPageWorkspace,
  getPageWorkspaceIDEConfig,
  syncPageWorkspace,
} from "../../api/low-code";

const { Paragraph, Text } = Typography;

export default observer(function CodeSyncPanel() {
  const [searchParams] = useSearchParams();
  const pageId = Number(searchParams.get("id"));
  const {
    store: pageStore,
    resetWorkspaceFiles,
    setEditorMode,
    setWorkspace,
    setWorkspaceIDEConfig,
    setWorkspaceRuntime,
    setWorkspaceSession,
  } = useStorePage();

  const { loading: workspaceLoading, run: fetchWorkspace } = useRequest(
    async () => {
      if (!pageId) return null;
      const response = await getPageWorkspace(pageId);
      return response.data ?? null;
    },
    {
      manual: true,
      onSuccess: (workspace) => {
        setWorkspace(workspace);
      },
    },
  );

  const { loading: syncLoading, run: syncWorkspace } = useRequest(
    async () => {
      if (!pageId) return null;
      const response = await syncPageWorkspace(pageId);
      const workspace = response.data ?? null;
      if (!workspace) {
        return null;
      }

      const ideConfigResponse = await getPageWorkspaceIDEConfig(pageId);
      return {
        workspace,
        workspaceIDEConfig: ideConfigResponse.data ?? null,
      };
    },
    {
      manual: true,
      onSuccess: (payload) => {
        setWorkspace(payload?.workspace ?? null);
        resetWorkspaceFiles();
        setWorkspaceIDEConfig(payload?.workspaceIDEConfig ?? null);
        setWorkspaceRuntime(null);
        setWorkspaceSession(null);
        setEditorMode("webide");
      },
    },
  );

  const { loading: ideConfigLoading, run: enterIDE } = useRequest(
    async () => {
      if (!pageId) return null;
      const response = await getPageWorkspaceIDEConfig(pageId);
      return response.data ?? null;
    },
    {
      manual: true,
      onSuccess: (workspaceIDEConfig) => {
        setWorkspaceIDEConfig(workspaceIDEConfig);
        setEditorMode("webide");
      },
    },
  );

  useEffect(() => {
    if (!pageId) return;
    void fetchWorkspace();
  }, [fetchWorkspace, pageId]);

  const workspace = pageStore.workspace;

  return (
    <div className="space-y-3">
      <Alert
        type="info"
        showIcon
        message="源码同步与 IDE 编辑已合并"
        description="点击源码同步后，会把当前页面源码同步到模板工作区，并直接切换主画布为 IDE 编辑态。当前阶段不要求真实运行时先启动。"
      />

      {workspace ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag color={workspace.exists ? "green" : "default"}>
              {workspace.exists ? "工作区已生成" : "工作区未生成"}
            </Tag>
            <Tag color="blue">{workspace.pageName}</Tag>
          </div>

          <Descriptions
            column={1}
            size="small"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
            items={[
              {
                key: "workspacePath",
                label: "工作区路径",
                children: workspace.workspaceRelativePath,
              },
              {
                key: "templateRoot",
                label: "模板来源",
                children: workspace.templateRoot,
              },
              {
                key: "entryFilePath",
                label: "入口文件",
                children: workspace.entryFilePath,
              },
              {
                key: "schemaFilePath",
                label: "Schema 文件",
                children: workspace.schemaFilePath,
              },
            ]}
          />

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <Text className="text-xs uppercase tracking-[0.18em] text-slate-500">
              同步说明
            </Text>
            <Paragraph className="!mb-0 !mt-2 text-sm text-slate-600">
              当前流程会将页面结构同步到模板包对应的页面工作区，然后直接在主区域以 IDE
              方式读取和编辑这份源码。
            </Paragraph>
          </div>

          <Space.Compact block>
            <Button loading={workspaceLoading} onClick={() => fetchWorkspace()}>
              刷新状态
            </Button>
            <Button
              type="primary"
              loading={syncLoading}
              onClick={() => syncWorkspace()}
            >
              同步源码并进入 IDE
            </Button>
          </Space.Compact>

          {workspace.exists ? (
            <Button block loading={ideConfigLoading} onClick={() => enterIDE()}>
              直接进入 IDE 编辑
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          正在读取页面工作区状态...
        </div>
      )}
    </div>
  );
});
