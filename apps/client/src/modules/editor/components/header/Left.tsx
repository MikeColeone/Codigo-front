import { CheckOutlined, DownOutlined, EditOutlined } from "@ant-design/icons";
import { Dropdown, Input, Space } from "antd";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useEditorPage } from "@/modules/editor/hooks";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import EditorPageManager from "../pageManager";

export default function Left(props: { title: string }) {
  const { setPageTitle } = useEditorPage();
  const [isEditState, setIsEditState] = useState(false);
  const [isPageMenuOpen, setIsPageMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isFlowWorkspace = location.pathname.startsWith("/flow");
  const displayTitle = isFlowWorkspace ? "流程编排" : props.title || "未命名页面";

  function handleEdit(event: ChangeEvent<HTMLInputElement>) {
    setPageTitle(event.target.value);
  }

  const publicProps = {
    className:
      "cursor-pointer text-[var(--ide-text-muted)] transition-colors hover:text-[var(--ide-text)]",
    onClick: () => {
      setIsPageMenuOpen(false);
      setIsEditState(!isEditState);
    },
  };

  if (isEditState) {
    return (
      <Space size={8}>
        <Input
          value={props.title}
          onChange={handleEdit}
          size="small"
          className="w-52 !rounded-sm !border-[var(--ide-control-border)] !bg-[var(--ide-control-bg)] !text-[13px] !text-[var(--ide-text)] focus:!border-[var(--ide-accent)]"
        />
        <div
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm bg-[var(--ide-accent)] text-white transition-opacity hover:opacity-90"
          onClick={() => setIsEditState(false)}
        >
          <CheckOutlined />
        </div>
      </Space>
    );
  } else {
    return (
      <div className="flex items-center gap-2">
        <button
          className="flex h-7 w-7 items-center justify-center rounded-sm bg-[var(--ide-accent)] text-white transition-opacity hover:opacity-90"
          onClick={() => navigate("/")}
        >
          <span className="font-mono text-xs font-bold">
            C
          </span>
        </button>
        <WorkspaceSwitcher />
        <div className="min-w-0 ml-1">
          <div className="flex items-center gap-2">
            {isFlowWorkspace ? (
              <h1 className="truncate text-xs font-medium tracking-tight text-[var(--ide-text)]">
                {displayTitle}
              </h1>
            ) : (
              <Dropdown
                trigger={["click"]}
                placement="bottomLeft"
                open={isPageMenuOpen}
                onOpenChange={setIsPageMenuOpen}
                dropdownRender={() => (
                  <div
                    className="p-2"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <EditorPageManager embedded variant="dropdown" />
                  </div>
                )}
              >
                <button
                  type="button"
                  className="group flex min-w-0 items-center gap-1 rounded-sm px-1 py-0.5 transition-colors hover:bg-[var(--ide-hover)]"
                >
                  <span className="truncate text-xs font-medium tracking-tight text-[var(--ide-text)]">
                    {displayTitle}
                  </span>
                  <DownOutlined className="text-[9px] text-[var(--ide-text-muted)] transition-colors group-hover:text-[var(--ide-text)]" />
                </button>
              </Dropdown>
            )}
            {!isFlowWorkspace && <EditOutlined {...publicProps} />}
          </div>
        </div>
      </div>
    );
  }
}
