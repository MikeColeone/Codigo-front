import { useStoreAuth } from "@/shared/hooks/useStoreAuth";
import { useNavigate } from "react-router-dom";
import { useRequest } from "ahooks";
import { getLoginWithPassword } from "@/modules/auth/api/user";

export function useLogin() {
  const { login } = useStoreAuth();
  const nav = useNavigate();

  return useRequest(getLoginWithPassword, {
    manual: true,
    onSuccess: async (res) => {
      // res is { code: 0, data: 'eyJ...', msg: '登录成功' } based on the backend and interceptor
      await login(res.data);
      nav("/editor");
    },
  });
}












