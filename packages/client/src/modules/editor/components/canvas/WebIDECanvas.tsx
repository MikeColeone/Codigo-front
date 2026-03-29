import { useEffect, useMemo, useRef, useState } from "react";
import { useRequest } from "ahooks";
import { Alert, Empty, Spin, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useSearchParams } from "react-router-dom";
import { getPageWorkspaceIDEConfig } from "../../api/low-code";
import { useStorePage } from "@/shared/hooks";
import { BASE_URL } from "@/shared/utils/request";

const { Paragraph, Text } = Typography;

export const WebIDECanvas = observer(() => {
  const [searchParams] = useSearchParams();
  const pageId = Number(searchParams.get("id"));
  const {
    store: pageStore,
    setWorkspaceIDEConfig,
  } = useStorePage();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameReady, setFrameReady] = useState(false);
  const workspace = pageStore.workspace;
  const workspaceIDEConfig = pageStore.workspaceIDEConfig;

  const { loading: ideConfigLoading, run: fetchIDEConfig } = useRequest(
    async () => {
      if (!pageId) {
        return null;
      }

      const response = await getPageWorkspaceIDEConfig(pageId);
      return response.data ?? null;
    },
    {
      manual: true,
      onSuccess: (config) => {
        setWorkspaceIDEConfig(config);
      },
    },
  );

  useEffect(() => {
    if (!pageId || !workspace?.exists || workspaceIDEConfig) {
      return;
    }

    void fetchIDEConfig();
  }, [fetchIDEConfig, pageId, workspace?.exists, workspaceIDEConfig]);

  const targetOrigin = useMemo(() => {
    if (!workspaceIDEConfig?.browserUrl) {
      return "*";
    }

    try {
      return new URL(workspaceIDEConfig.browserUrl).origin;
    } catch {
      return "*";
    }
  }, [workspaceIDEConfig?.browserUrl]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<{ type?: string }>) => {
      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      if (targetOrigin !== "*" && event.origin !== targetOrigin) {
        return;
      }

      if (event.data?.type !== "codigo:opensumi-app-ready") {
        return;
      }

      const token = localStorage.getItem("token") ?? "";
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: "codigo:opensumi-app-context",
          payload: {
            token,
            pageId,
            apiBaseUrl: BASE_URL,
          },
        },
        targetOrigin,
      );
      setFrameReady(true);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [targetOrigin]);

  if (!workspace) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <Empty
          description="请先在右侧源码同步面板加载工作区"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  if (!workspace.exists) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Alert
            type="warning"
            showIcon
            message="工作区尚未生成"
            description="请先点击源码同步，把页面结构同步到模板工作区后再进入 IDE。"
          />
        </div>
      </div>
    );
  }

  if (ideConfigLoading && !workspaceIDEConfig) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Spin size="large" />
          <Text className="text-slate-500">正在准备独立 IDE 子应用...</Text>
        </div>
      </div>
    );
  }

  if (!workspaceIDEConfig?.browserUrl) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Alert
            type="error"
            showIcon
            message="IDE 子应用地址不可用"
            description="请先确认 OpenSumi 独立子应用已启动，并检查后端返回的 browserUrl 配置。"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-w-0 flex-col bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-emerald-700">
            OpenSumi App
          </div>
          <div className="mt-1 text-sm text-slate-600">
            当前画布已切换为独立 IDE 子应用
          </div>
        </div>
        <div className="text-right">
          <Text className="block text-xs text-slate-500">
            {frameReady ? "认证上下文已注入" : "等待子应用就绪"}
          </Text>
          <Paragraph copyable className="!mb-0 !mt-1 max-w-[360px] text-xs">
            {workspaceIDEConfig.browserUrl}
          </Paragraph>
        </div>
      </div>

      <iframe
        ref={iframeRef}
        title="codigo-opensumi-app"
        src={workspaceIDEConfig.browserUrl}
        className="h-full w-full border-0 bg-white"
      />
    </div>
  );
});
