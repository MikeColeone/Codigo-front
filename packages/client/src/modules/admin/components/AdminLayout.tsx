import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Space, Spin } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useStoreAuth } from "@/shared/hooks";
import { observer } from "mobx-react-lite";

const { Header, Sider, Content } = Layout;

export default observer(function AdminLayout() {
  const { store: storeAuth, logout } = useStoreAuth();
  const nav = useNavigate();

  useEffect(() => {
    // 检查是否有登录信息和全局角色
    if (!storeAuth.details) return;

    const role = storeAuth.details.global_role;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      nav("/home", { replace: true });
    }
  }, [storeAuth.details, nav]);

  if (!storeAuth.details) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const handleMenuClick = ({ key }: { key: string }) => {
    nav(`/admin/${key}`);
  };

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const userMenu = {
    items: [
      {
        key: "back",
        label: "返回工作台",
        icon: <AppstoreOutlined />,
        onClick: () => nav("/home"),
      },
      {
        key: "logout",
        label: "退出登录",
        icon: <LogoutOutlined />,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout className="h-screen overflow-hidden">
      <Sider width={200} theme="light" className="border-r border-slate-200">
        <div className="h-16 flex items-center justify-center border-b border-slate-200">
          <span className="text-lg font-bold text-slate-800">平台管理后台</span>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["users"]}
          className="h-[calc(100%-64px)] border-r-0 pt-4"
          onClick={handleMenuClick}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: "仪表盘",
              disabled: true,
            },
            {
              key: "users",
              icon: <UserOutlined />,
              label: "用户管理",
            },
            {
              key: "pages",
              icon: <AppstoreOutlined />,
              label: "页面管理",
              disabled: true,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header className="bg-white px-6 border-b border-slate-200 flex items-center justify-end h-16">
          <Dropdown menu={userMenu} placement="bottomRight">
            <Space className="cursor-pointer">
              <Avatar
                src={storeAuth.details.head_img}
                icon={!storeAuth.details.head_img && <UserOutlined />}
              />
              <span className="text-sm">{storeAuth.details.username}</span>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full ml-1">
                {storeAuth.details.global_role === "SUPER_ADMIN"
                  ? "超管"
                  : "管理员"}
              </span>
            </Space>
          </Dropdown>
        </Header>
        <Content className="m-6 bg-white p-6 rounded-lg shadow-sm overflow-auto">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
});
