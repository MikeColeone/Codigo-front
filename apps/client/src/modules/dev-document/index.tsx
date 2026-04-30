import { useTitle } from "ahooks";
import Center from "./components/center";
import { TopNavLayout } from "@/app/layouts/top-nav-layout";
import { ParticleBackground } from "@/modules/home/components/background/particle-background";

export default function DevDoc() {
  useTitle("Codigo - 使用手册");

  return (
    <TopNavLayout>
      <div className="relative h-full bg-[var(--ide-bg)] text-[var(--ide-text)]">
        <ParticleBackground />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,108,189,0.06),transparent_45%)]" />
        <div className="relative h-full">
          <Center variant="page" />
        </div>
      </div>
    </TopNavLayout>
  );
}




