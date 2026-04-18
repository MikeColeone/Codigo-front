import { useTitle } from "ahooks";
import Center from "./components/Center";
import { TopNavLayout } from "@/app/layouts/TopNavLayout";

export default function DevDoc() {
  useTitle("Codigo - 开发文档");

  return (
    <TopNavLayout>
      <div className="h-full overflow-y-auto">
        <Center />
      </div>
    </TopNavLayout>
  );
}








