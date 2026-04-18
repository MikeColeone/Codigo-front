import { useSearchParams } from "react-router-dom";
import { ParticleBackground } from "../background/ParticleBackground";
import { HomeDevDocSection } from "../sections/HomeDevDocSection";
import { HomeFeatureGrid } from "../sections/HomeFeatureGrid";
import { HomeHeroSection } from "../sections/HomeHeroSection";
import { HomeMaterialsPlaza } from "../sections/HomeMaterialsPlaza";
import { HomeTemplatePlaza } from "../sections/HomeTemplatePlaza";
import { HomeFooter } from "./HomeFooter";
import { HomeHeader } from "./HomeHeader";

/** 组合首页布局与营销区块。 */
export function HomePage() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") ?? "home";

  return (
    <div className="relative min-h-full bg-[var(--ide-bg)] text-[var(--ide-text)]">
      <HomeHeader />
      <ParticleBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,108,189,0.06),transparent_45%)]" />
      <main className="relative z-10 pt-[var(--header-height)]">
        {view === "templates" ? (
          <HomeTemplatePlaza />
        ) : view === "materials" ? (
          <HomeMaterialsPlaza />
        ) : view === "doc" ? (
          <HomeDevDocSection />
        ) : (
          <>
            <HomeHeroSection />
            <HomeFeatureGrid />
          </>
        )}
      </main>
      {view === "home" ? <HomeFooter /> : null}
    </div>
  );
}
