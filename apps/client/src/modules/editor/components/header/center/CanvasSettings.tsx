import { ApartmentOutlined } from "@ant-design/icons";
import { InputNumber, Space, Switch } from "antd";
import { observer } from "mobx-react-lite";
import { useSearchParams } from "react-router-dom";
import { useEditorPage, useEditorPermission } from "@/modules/editor/hooks";

export const CanvasSettings = observer(function CanvasSettings() {
  const [searchParams] = useSearchParams();
  const pageId = Number(searchParams.get("id"));
  const { store, setCanvasSize, setOutlineTreeVisible } = useEditorPage();
  const { ensurePermission } = useEditorPermission();

  return (
    <div className="hidden items-center gap-2 xl:flex">
      <div className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50/80 px-2 py-1">
        <span className="flex items-center gap-1 text-[11px] text-slate-500">
          <ApartmentOutlined />
        </span>
        <Switch
          size="small"
          checked={store.showOutlineTree}
          onChange={(checked) => setOutlineTreeVisible(checked, pageId)}
          disabled={store.editorMode !== "visual"}
        />
      </div>

      {store.deviceType === "pc" && (
        <Space size="small">
          <InputNumber
            size="small"
            value={store.canvasWidth}
            onChange={(value) => {
              if (!ensurePermission("edit_content", "当前角色不能修改画布设置")) {
                return;
              }

              setCanvasSize(value || 1024, store.canvasHeight);
            }}
            className="w-[76px]"
            controls={false}
            addonAfter="W"
          />
          <InputNumber
            size="small"
            value={store.canvasHeight}
            onChange={(value) => {
              if (!ensurePermission("edit_content", "当前角色不能修改画布设置")) {
                return;
              }

              setCanvasSize(store.canvasWidth, value || 768);
            }}
            className="w-[76px]"
            controls={false}
            addonAfter="H"
          />
        </Space>
      )}
    </div>
  );
});
