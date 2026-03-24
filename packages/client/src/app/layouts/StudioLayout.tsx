import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import { observer } from "mobx-react-lite";
import { EditOutlined, ApartmentOutlined } from "@ant-design/icons";
import EditorHeader from "@/modules/editor/components/header";

export const StudioLayout = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      key: "/editor",
      label: "Editor",
      icon: <EditOutlined />,
    },
    {
      key: "/flow",
      label: "Flow",
      icon: <ApartmentOutlined />,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#10b981", // emerald-500
          colorBgContainer: "#ffffff",
          colorBorder: "#e2e8f0", // slate-200
          colorText: "#0f172a", // slate-900
          colorTextSecondary: "#64748b", // slate-500
          borderRadius: 8,
        },
        components: {
          Button: {
            primaryShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)",
          },
          Layout: {
            bodyBg: "#f8fafc", // slate-50
            headerBg: "rgba(255, 255, 255, 0.8)",
            siderBg: "rgba(255, 255, 255, 0.5)",
          },
          Tabs: {
            itemColor: "#64748b",
            itemSelectedColor: "#10b981",
            itemHoverColor: "#10b981",
          },
        },
      }}
    >
      <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
        {/* Background Grid */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>

        {/* 头部组件 */}
        <header className="relative z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 py-3">
          <EditorHeader />
        </header>

        <main className="relative z-10 flex flex-1 overflow-hidden">
          <aside className="h-full w-16 shrink-0 border-r border-slate-200 bg-white/60 px-2 py-4 backdrop-blur-md">
            <div className="sticky top-0 flex flex-col gap-2">
              {navItems.map((item) => {
                const active = location.pathname === item.key;

                return (
                  <button
                    key={item.key}
                    onClick={() => navigate(item.key)}
                    className={`group flex h-14 flex-col items-center justify-center rounded-lg border text-[10px] font-medium transition-all ${
                      active
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 shadow-sm"
                        : "border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:text-emerald-600"
                    }`}
                  >
                    <span className="text-base leading-none">{item.icon}</span>
                    <span className="mt-1 leading-none">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </ConfigProvider>
  );
});
