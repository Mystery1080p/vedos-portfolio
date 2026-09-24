import { getDesktopApp } from "../../data/desktopApps";
import { useWindowStore } from "../../store/useWindowStore";

function MinimizedWindows() {
  const windows = useWindowStore((state) => state.windows);
  const restoreWindow = useWindowStore((state) => state.restoreWindow);

  const minimizedWindows = Object.values(windows)
    .filter((windowState) => windowState.isOpen && windowState.isMinimized)
    .sort((firstWindow, secondWindow) => firstWindow.zIndex - secondWindow.zIndex);

  if (minimizedWindows.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Minimized windows"
      className="flex shrink-0 items-center gap-1.5"
    >
      {minimizedWindows.map((windowState) => {
        const app = getDesktopApp(windowState.id);

        if (!app) {
          return null;
        }

        const Icon = app.icon;

        return (
          <button
            aria-label={`Restore ${app.title}`}
            className="group relative flex h-10 max-w-36 shrink-0 items-center gap-2 overflow-hidden rounded-xl border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(125,221,248,0.45))] px-3 text-left shadow-[inset_0_1px_rgba(255,255,255,0.92),0_0.16rem_0.42rem_rgba(0,87,135,0.16)] transition hover:-translate-y-0.5 hover:bg-white/70"
            key={windowState.id}
            onClick={(event) => {
              event.stopPropagation();
              restoreWindow(windowState.id);
            }}
            title={`Restore ${app.title}`}
            type="button"
          >
            <span className="absolute left-[10%] top-[5%] h-[40%] w-[78%] rounded-full bg-white/28" />

            <Icon
              aria-hidden="true"
              className="relative z-10 shrink-0 text-[#0875a9]"
              size={16}
              strokeWidth={1.9}
            />

            <span className="relative z-10 truncate text-[0.68rem] font-bold text-[#063f60]">
              {app.shortTitle ?? app.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default MinimizedWindows;