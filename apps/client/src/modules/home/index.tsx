import { useTitle } from "ahooks";
import { IdeThemeLayout } from "@/app/layouts/IdeThemeLayout";
import { HomePage } from "./components/layout/HomePage";

/** 渲染首页模块入口。 */
export default function Home() {
  useTitle("Codigo - 首页");

  return (
    <IdeThemeLayout className="flex h-screen flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <HomePage />
      </div>
    </IdeThemeLayout>
  );
}
