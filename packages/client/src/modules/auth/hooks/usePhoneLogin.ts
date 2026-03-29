import { useStoreAuth } from "@/shared/hooks/useStoreAuth";
import { useNavigate } from "react-router-dom";
import { useRequest } from "ahooks";
import { getLoginWithPhone } from "@/modules/auth/api/user";

export function usePhoneLogin() {
  const { login } = useStoreAuth();
  const nav = useNavigate();

  return useRequest(getLoginWithPhone, {
    manual: true,
    onSuccess: async (res) => {
      await login(res.data);
      nav("/editor");
    },
  });
}












