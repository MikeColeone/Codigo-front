import { Navigate } from "react-router-dom";
import { useAuth } from "@/shared/auth/auth-provider";
import { resolveAdminDefaultRoute } from "@/modules/admin/config/navigation";
import { useAdminAccess } from "@/modules/admin/hooks/use-admin-access";
import { AdminLoadingState } from "@/modules/admin/components/admin-loading-state";

export function AdminIndexRedirect() {
  const { hasAdminPermission } = useAdminAccess();
  const { user } = useAuth();

  if (!user) {
    return <AdminLoadingState />;
  }

  return <Navigate to={resolveAdminDefaultRoute(hasAdminPermission)} replace />;
}
