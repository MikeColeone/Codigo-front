import { ArrowLeftOutlined } from "@ant-design/icons";

interface ProfilePageHeaderProps {
  onBack: () => void;
  onHome: () => void;
}

/** 渲染个人中心页面的顶部导航。 */
export function ProfilePageHeader({
  onBack,
  onHome,
}: ProfilePageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          className="flex items-center gap-2 text-left text-xl font-bold tracking-tight text-slate-900"
          onClick={onHome}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500 font-mono text-lg font-bold text-white shadow-lg shadow-emerald-500/30">
            C
          </div>
          <span>Codigo</span>
        </button>
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
        >
          <ArrowLeftOutlined />
          返回
        </button>
      </div>
    </header>
  );
}
