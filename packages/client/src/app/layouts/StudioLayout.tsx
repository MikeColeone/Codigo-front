import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ConfigProvider, Tooltip } from "antd";
import { observer } from "mobx-react-lite";
import {
  EditOutlined,
  ApartmentOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import EditorHeader from "@/modules/editor/components/header";

export const StudioLayout = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      key: "/editor",
      label: "页面搭建",
      icon: <EditOutlined />,
    },
    {
      key: "/flow",
      label: "流程设计",
      icon: <ApartmentOutlined />,
    },
    {
      key: "/dataCount",
      label: "后台数据",
      icon: <LineChartOutlined />,
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
      <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
        {/* Background Grid - more subtle */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"></div>

        {/* 头部组件 */}
        <header className="relative z-20 h-14 border-b border-slate-200/80 bg-white/95 backdrop-blur-md flex items-center px-4 shadow-sm">
          <div className="w-full">
            <EditorHeader />
          </div>
        </header>

        <main className="relative z-10 flex flex-1 overflow-hidden">
          {/* 左侧全局导航 */}
          <aside className="h-full w-[64px] shrink-0 border-r border-slate-200/80 bg-white/80 px-2 py-4 flex flex-col items-center backdrop-blur-md z-20 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col gap-3 w-full">
              {navItems.map((item) => {
                const active = location.pathname === item.key;

                return (
                  <Tooltip key={item.key} title={item.label} placement="right">
                    <button
                      onClick={() => navigate(item.key)}
                      className={`group relative flex h-12 w-full flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                        active
                          ? "bg-emerald-500/10 text-emerald-600 shadow-sm before:absolute before:left-0 before:top-1/4 before:h-1/2 before:w-1 before:rounded-r-full before:bg-emerald-500"
                          : "bg-transparent text-slate-400 hover:bg-slate-100/80 hover:text-slate-600"
                      }`}
                    >
                      <span className="text-[18px] leading-none">
                        {item.icon}
                      </span>
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </aside>
          <div className="min-w-0 flex-1 relative bg-transparent">
            <Outlet />
          </div>
        </main>
      </div>
    </ConfigProvider>
  );
});
