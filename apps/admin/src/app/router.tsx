import { createHashRouter } from "react-router-dom";
import { AdminIndexRedirect } from "@/modules/admin/components/admin-index-redirect";
import AdminLayout from "@/modules/admin/components/admin-layout";
import { AdminPermissionRoute } from "@/modules/admin/components/admin-permission-route";
import { AdminRouteGuard } from "@/modules/admin/components/admin-route-guard";
import AdminComponents from "@/modules/admin/pages/components";
import AdminPages from "@/modules/admin/pages/pages";
import AdminPermissions from "@/modules/admin/pages/permissions";
import AdminUsers from "@/modules/admin/pages/users";
import LoginPage from "@/modules/auth/pages/login-page";

export const router = createHashRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <AdminRouteGuard>
        <AdminLayout />
      </AdminRouteGuard>
    ),
    children: [
      {
        index: true,
        element: <AdminIndexRedirect />,
      },
      {
        path: "users",
        element: (
          <AdminPermissionRoute permission="USER_MANAGE">
            <AdminUsers />
          </AdminPermissionRoute>
        ),
      },
      {
        path: "permissions",
        element: (
          <AdminPermissionRoute permission="PERMISSION_ASSIGN">
            <AdminPermissions />
          </AdminPermissionRoute>
        ),
      },
      {
        path: "pages",
        element: (
          <AdminPermissionRoute permission="PAGE_MANAGE">
            <AdminPages />
          </AdminPermissionRoute>
        ),
      },
      {
        path: "components",
        element: (
          <AdminPermissionRoute permission="COMPONENT_MANAGE">
            <AdminComponents />
          </AdminPermissionRoute>
        ),
      },
    ],
  },
]);
