import { useSearchParams } from "react-router-dom";
import { ParticleBackground } from "../background/particle-background";
import { HomeDevDocSection } from "../sections/home-dev-doc-section";
import { HomeFeatureGrid } from "../sections/home-feature-grid";
import { HomeHeroSection } from "../sections/home-hero-section";
import { HomeMaterialsPlaza } from "../sections/home-materials-plaza";
import { HomeTemplatePlaza } from "../sections/home-template-plaza";
import { HomeFooter } from "./home-footer";
import { HomeHeader } from "./home-header";

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
