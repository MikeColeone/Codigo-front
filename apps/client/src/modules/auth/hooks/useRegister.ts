import { useSendCode } from "@/shared/hooks";
import type { FormInstance } from "antd";
import { useStoreAuth } from "@/shared/hooks/useStoreAuth";
import { useRequest } from "ahooks";
import { getRegister } from "@/modules/auth/api/user";
import { useNavigate } from "react-router-dom";

export function useRegister(form: FormInstance) {
  const { login } = useStoreAuth();
  const { refreshCaptcha } = useSendCode(form, "register");
  const nav = useNavigate();

  return useRequest(getRegister, {
    manual: true,
    onSuccess: async (res) => {
      await login(res.data);
      nav("/editor");
    },
    onFinally: () => {
      refreshCaptcha();
    },
  });
}












