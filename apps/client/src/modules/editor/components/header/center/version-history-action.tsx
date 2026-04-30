import { HistoryOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { VersionHistoryDrawer } from "../version-history-drawer";

export function VersionHistoryAction() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="text"
        className="!h-7 !rounded-lg !px-2 !text-[11px] !text-slate-500 hover:!bg-slate-100 hover:!text-slate-900"
        onClick={() => setOpen(true)}
      >
        <HistoryOutlined /> 版本
      </Button>
      <VersionHistoryDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
