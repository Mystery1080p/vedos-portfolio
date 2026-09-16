import { FolderOpen, Grid2X2, TerminalSquare } from "lucide-react";
import {
  getDesktopApp,
  taskbarPinnedAppIds,
} from "../../data/desktopApps";
import { useSystemStore } from "../../store/useSystemStore";
import { useWindowStore } from "../../store/useWindowStore";
import SystemClock from "../ui/SystemClock";
import StartMenu from "./StartMenu";

function Taskbar() {
  const toggleStartMenu = useSystemStore((state) => state.toggleStartMenu);
  const closeStartMenu = useSystemStore((state) => state.closeStartMenu);

  const openWindow = useWindowStore((state) => state.openWindow);
  const restoreWindow = useWindowStore((state) => state.restoreWindow);
  const windows = useWindowStore((state) => state.windows);

  const handleStartClick = (event) => {
    event.stopPropagation();
    toggleStartMenu();
  };

  const handlePinnedAppClick = (event, appId) => {
    event.stopPropagation();

    const currentWindow = windows[appId];

    if (currentWindow?.isOpen && !currentWindow.isMinimized) {
      openWindow(appId);
    } else {
      restoreWindow(appId);
    }

    closeStartMenu();
  };

  const handleTerminalClick = (event) => {
    event.stopPropagation();
    openWindow("terminal");
    closeStartMenu();
  };

  const handleFilesClick = (event) => {
    event.stopPropagation();
    openWindow("file-manager");
    closeStartMenu();
  };

  return (
    <>
      <StartMenu />

      <footer
        className="vedos-taskbar fixed bottom-0 left-0 z-[190] flex h-12 w-full items-center gap-2 border-t border-cyan-200/70 bg-[#03130e]/90 px-2 shadow-[0_-4px_18px_rgba(0,0,0,0.35)] backdrop-blur-md"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Open VedOS Start menu"
          className="flex h-8 shrink-0 items-center gap-2 border border-cyan-100/70 bg-gradient-to-r from-cyan-200 to-emerald-400 px-3 text-xs font-bold tracking-[0.1em] text-black shadow-[0_0_12px_rgba(114,255,229,0.35)] transition hover:brightness-110"
          onClick={handleStartClick}
          type="button"
        >
          <Grid2X2 size={15} strokeWidth={2.5} />
          <span>VEDOS</span>
        </button>

        <div className="h-7 w-px shrink-0 bg-cyan-100/30" />

        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {taskbarPinnedAppIds.map((appId) => {
            const app = getDesktopApp(appId);
            const Icon = app.icon;
            const isActive =
              windows[appId]?.isOpen && !windows[appId]?.isMinimized;

            return (
              <button
                aria-label={`Open ${app.title}`}
                className={`flex h-8 shrink-0 items-center gap-2 border px-3 text-[0.65rem] tracking-[0.06em] transition ${
                  isActive
                    ? "border-cyan-200 bg-cyan-200/25 text-cyan-50 shadow-[inset_0_0_10px_rgba(114,255,229,0.12)]"
                    : "border-cyan-200/30 bg-black/25 text-cyan-100/80 hover:border-cyan-200/80 hover:bg-cyan-100/10"
                }`}
                key={appId}
                onClick={(event) => handlePinnedAppClick(event, appId)}
                type="button"
              >
                <Icon size={15} strokeWidth={1.7} />
                <span className="hidden sm:inline">{app.shortTitle}</span>
              </button>
            );
          })}

          <button
            aria-label="Open VedOS Terminal"
            className="flex h-8 shrink-0 items-center gap-2 border border-emerald-200/30 bg-black/25 px-3 text-[0.65rem] tracking-[0.06em] text-emerald-100/80 transition hover:border-emerald-200/80 hover:bg-emerald-100/10"
            onClick={handleTerminalClick}
            type="button"
          >
            <TerminalSquare size={15} strokeWidth={1.7} />
            <span className="hidden md:inline">Terminal</span>
          </button>

          <button
            aria-label="Open My Files"
            className="hidden h-8 shrink-0 items-center gap-2 border border-cyan-200/30 bg-black/25 px-3 text-[0.65rem] tracking-[0.06em] text-cyan-100/80 transition hover:border-cyan-200/80 hover:bg-cyan-100/10 md:flex"
            onClick={handleFilesClick}
            type="button"
          >
            <FolderOpen size={15} strokeWidth={1.7} />
            <span>Files</span>
          </button>
        </div>

        <SystemClock />
      </footer>
    </>
  );
}

export default Taskbar;