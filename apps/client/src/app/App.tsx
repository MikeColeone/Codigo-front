import { RouterProvider } from "react-router-dom";
import "@/shared/assets/base.css";
import { router } from "./router";
import { useStoreAuth } from "@/shared/hooks";
import { useEffect } from "react";

function App() {
  const { fetchUserInfo, store } = useStoreAuth();

  useEffect(() => {
    // 页面初次加载时，如果有 token 但没有用户信息，则主动获取
    if (store.token && !store.details) {
      fetchUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
