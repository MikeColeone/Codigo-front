import {
  CheckOutlined,
  FundViewOutlined,
  PlusOutlined,
  RedoOutlined,
  UndoOutlined,
  MobileOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import type { IComponent, PostReleaseRequest } from "@codigo/share";
import { useRequest } from "ahooks";
import { Button, Space, message, InputNumber } from "antd";
import { useNavigate } from "react-router-dom";
import { postRelease } from "@/modules/editor/api/low-code";
import { useStoreComponents, useStorePage } from "@/shared/hooks";
import { observer } from "mobx-react-lite";

const Center = observer(() => {
  const nav = useNavigate();
  const { store, setDeviceType, setCanvasSize } = useStorePage();
  const {
    store: storeComponents,
    getComponentById,
    storeInLocalStorage,
  } = useStoreComponents();

  // 发布接口调用
  const { run, loading } = useRequest(
    async (values: PostReleaseRequest) => postRelease(values),
    {
      manual: true,
      onSuccess: ({ msg, data }) => {
        // 跳转发布之后的页面
        nav(`/release?id=${data}`);
        localStorage.setItem("release_time", String(Date.now()));
        message.success(msg);
      },
    }
  );

  // 预览按钮
  function handleGoPreview() {
    // 将配置的组件储存在 localStorage
    storeInLocalStorage();
    // 跳转预览页面
    nav("/preview");
  }

  // 发布按钮
  function handleGoRelease() {
    // 将前端的组件数据类型结构转成符合后端接口入参的类型结构
    const components = storeComponents.sortableCompConfig
      .map((comp) => getComponentById(comp))
      .map((comp) => ({
        type: comp.type,
        options: comp.props,
      })) as IComponent[];

    run({
      components,
      desc: store.description,
      page_name: store.title,
      tdk: store.tdk,
    });
  }

  return (
    <Space className="bg-white/5 p-1 rounded-lg border border-slate-200">
      <Space.Compact className="bg-slate-100 p-1 rounded-md">
        <Button
          type={store.deviceType === "mobile" ? "primary" : "text"}
          icon={<MobileOutlined />}
          size="small"
          onClick={() => setDeviceType("mobile")}
          className={store.deviceType === "mobile" ? "bg-emerald-500" : ""}
        />
        <Button
          type={store.deviceType === "pc" ? "primary" : "text"}
          icon={<DesktopOutlined />}
          size="small"
          onClick={() => setDeviceType("pc")}
          className={store.deviceType === "pc" ? "bg-emerald-500" : ""}
        />
      </Space.Compact>

      {store.deviceType === "pc" && (
        <Space size="small" className="mx-2">
          <InputNumber
            size="small"
            value={store.canvasWidth}
            onChange={(v) => setCanvasSize(v || 1024, store.canvasHeight)}
            className="w-20"
            controls={false}
            addonAfter="W"
          />
          <InputNumber
            size="small"
            value={store.canvasHeight}
            onChange={(v) => setCanvasSize(store.canvasWidth, v || 768)}
            className="w-20"
            controls={false}
            addonAfter="H"
          />
        </Space>
      )}

      <div className="w-px h-4 bg-slate-200 ml-2"></div>

      <Button
        type="text"
        className="flex items-center text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        onClick={handleGoPreview}
      >
        <FundViewOutlined /> 预览
      </Button>
      <div className="w-px h-4 bg-slate-200"></div>
      <Button
        type="text"
        className="flex items-center text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        onClick={storeInLocalStorage}
      >
        <PlusOutlined /> 存至草稿
      </Button>
      <div className="w-px h-4 bg-slate-200"></div>
      <Button
        type="text"
        className="flex items-center text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        onClick={storeComponents.undo}
        disabled={!storeComponents.hasUndo}
      >
        <UndoOutlined /> 撤销
      </Button>
      <div className="w-px h-4 bg-slate-200"></div>
      <Button
        type="text"
        className="flex items-center text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        onClick={storeComponents.redo}
        disabled={!storeComponents.hasRedo}
      >
        <RedoOutlined /> 重做
      </Button>
      <div className="w-px h-4 bg-slate-200"></div>
      <Button
        loading={loading}
        className="flex items-center bg-emerald-500 hover:!bg-emerald-400 border-none text-white font-medium shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
        type="primary"
        onClick={handleGoRelease}
      >
        发布 <CheckOutlined />
      </Button>
    </Space>
  );
});

export default Center;
