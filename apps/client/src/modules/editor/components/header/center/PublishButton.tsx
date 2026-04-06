import { CheckOutlined, CodeOutlined } from "@ant-design/icons";
import type { PostReleaseRequest } from "@codigo/materials";
import { useRequest } from "ahooks";
import { Button, message } from "antd";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { postRelease } from "@/modules/editor/api/low-code";
import {
  useEditorComponents,
  useEditorPage,
  useEditorPermission,
} from "@/modules/editor/hooks";

export const PublishButton = observer(function PublishButton() {
  const navigate = useNavigate();
  const { serializeSchema } = useEditorComponents();
  const { store } = useEditorPage();
  const { addOperationLog, can, ensurePermission } = useEditorPermission();
  const { run, loading } = useRequest(
    async (values: PostReleaseRequest) => postRelease(values),
    {
      manual: true,
      onSuccess: ({ data, msg }) => {
        navigate(`/release?id=${data}`);
        localStorage.setItem("release_time", String(Date.now()));
        message.success(msg);
      },
    },
  );

  const handlePublish = () => {
    if (!ensurePermission("publish", "当前角色没有发布权限")) {
      return;
    }

    run({
      desc: store.description,
      page_name: store.title,
      schema: serializeSchema(),
      schema_version: 2,
      tdk: store.tdk,
      pageCategory: store.pageCategory,
      layoutMode: store.layoutMode,
      deviceType: store.deviceType,
      canvasWidth: store.canvasWidth,
      canvasHeight: store.canvasHeight,
    });
    addOperationLog("publish", store.title);
  };

  return (
    <Button
      loading={loading}
      className="!h-7 !rounded-lg !border-none !bg-emerald-500 !px-2.5 !text-[11px] !font-medium !text-white shadow-[0_14px_26px_-18px_rgba(16,185,129,0.82)] hover:!bg-emerald-400"
      type="primary"
      onClick={handlePublish}
      disabled={!can("publish")}
    >
      <CodeOutlined />
      发布页面
      <CheckOutlined />
    </Button>
  );
});
