import { observer } from "mobx-react-lite";
import { useHomeNavigation } from "../../hooks/useHomeNavigation";
import { HomeUserEntry } from "./HomeUserEntry";

/** 渲染首页顶部导航条。 */
export const HomeHeader = observer(() => {
  const {
    avatarUrl,
    isLoggedIn,
    navigationItems,
    openHome,
    openLogin,
    openRoute,
    userMenuItems,
    username,
  } = useHomeNavigation();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--ide-border)] bg-[var(--ide-header-bg)]">
      <div className="mx-auto flex h-[var(--header-height)] w-full items-center justify-between px-3">
        <div className="flex items-center gap-8">
          <button
            className="group flex items-center gap-2 text-left text-sm font-semibold tracking-tight text-[var(--ide-text)]"
            onClick={openHome}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[var(--ide-accent)] font-mono text-[12px] font-bold text-[var(--ide-statusbar-text)] shadow-[var(--ide-panel-shadow)]">
              C
            </div>
            <span className="font-mono tracking-wider">Codigo</span>
          </button>

          <ul className="hidden items-center gap-6 text-sm font-medium text-[var(--ide-text-muted)] lg:flex">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <button
                  className="group relative transition-colors hover:text-[var(--ide-text)]"
                  onClick={() => openRoute(item.path)}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--ide-accent)] transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <HomeUserEntry
          avatarUrl={avatarUrl}
          isLoggedIn={isLoggedIn}
          openLogin={openLogin}
          userMenuItems={userMenuItems}
          username={username}
        />
      </div>
    </nav>
  );
});
