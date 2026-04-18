import type { ReactNode } from "react";
import { IdeThemeLayout } from "./IdeThemeLayout";
import { HomeHeader } from "@/modules/home/components/layout/HomeHeader";

interface TopNavLayoutProps {
  children: ReactNode;
  className?: string;
}

export function TopNavLayout({ children, className }: TopNavLayoutProps) {
  return (
    <IdeThemeLayout className={`h-screen overflow-hidden ${className ?? ""}`}>
      <div className="relative h-full">
        <HomeHeader />
        <div className="h-full overflow-hidden pt-[var(--header-height)]">
          {children}
        </div>
      </div>
    </IdeThemeLayout>
  );
}

