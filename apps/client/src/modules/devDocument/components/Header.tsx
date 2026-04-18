import { useNavigate } from "react-router-dom";
import { Button } from "antd";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--ide-border)] bg-[var(--ide-header-bg)]">
      <div className="mx-auto flex h-[var(--header-height)] max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[var(--ide-accent)] text-[var(--ide-statusbar-text)] font-mono text-[12px] font-bold shadow-[var(--ide-panel-shadow)]">
            C
          </div>
          <span className="text-sm font-semibold text-[var(--ide-text)] tracking-tight">
            Codigo DevDocs
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="primary"
            className="!rounded-sm"
            onClick={() => navigate("/editor")}
          >
            开始体验
          </Button>
        </div>
      </div>
    </header>
  );
}
