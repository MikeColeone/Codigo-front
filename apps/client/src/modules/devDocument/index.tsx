import { useTitle } from "ahooks";
import { IdeThemeLayout } from "@/app/layouts/IdeThemeLayout";
import Header from "./components/Header";
import Center from "./components/Center";
import Footer from "./components/Footer";

export default function DevDoc() {
  useTitle("Codigo - 开发文档");

  return (
    <IdeThemeLayout className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Center />
        <Footer />
      </div>
    </IdeThemeLayout>
  );
}










