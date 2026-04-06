import { DesktopOutlined, MobileOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { observer } from "mobx-react-lite";
import { useEditorPage, useEditorPermission } from "@/modules/editor/hooks";

export const DeviceModeSwitch = observer(function DeviceModeSwitch() {
  const { store, setDeviceType } = useEditorPage();
  const { ensurePermission } = useEditorPermission();

  const handleSwitch = (deviceType: "mobile" | "pc") => {
    if (!ensurePermission("edit_content", "当前角色不能修改画布设置")) {
      return;
    }

    setDeviceType(deviceType);
  };

  return (
    <div className="flex items-center gap-1 rounded-lg bg-slate-100/90 p-0.5">
      <Button
        type={store.deviceType === "mobile" ? "primary" : "text"}
        icon={<MobileOutlined />}
        size="small"
        onClick={() => handleSwitch("mobile")}
        className={`!h-7 !rounded-lg !px-2 !text-[11px] ${store.deviceType === "mobile" ? "!bg-emerald-500" : "!text-slate-500"}`}
      >
        移动端
      </Button>
      <Button
        type={store.deviceType === "pc" ? "primary" : "text"}
        icon={<DesktopOutlined />}
        size="small"
        onClick={() => handleSwitch("pc")}
        className={`!h-7 !rounded-lg !px-2 !text-[11px] ${store.deviceType === "pc" ? "!bg-emerald-500" : "!text-slate-500"}`}
      >
        桌面端
      </Button>
    </div>
  );
});
