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
        className="oxygen-taskbar fixed bottom-2 left-1/2 z-[190] flex h-14 w-[min(96vw,800px)] -translate-x-1/2 items-center gap-2 rounded-[1.35rem] border border-white/85 bg-[linear-gradient(180deg,rgba(240,254,255,0.82),rgba(38,163,211,0.68))] px-2 shadow-[inset_0_1px_rgba(255,255,255,0.96),0_0.7rem_1.6rem_rgba(0,70,110,0.42)] backdrop-blur-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Open OxygenOS Start menu"
          className="relative flex h-10 shrink-0 items-center gap-2 overflow-hidden rounded-xl border border-white/85 bg-[linear-gradient(180deg,#d5ffad_0%,#76da5d_43%,#299246_50%,#49bf50_100%)] px-3 text-xs font-extrabold tracking-[0.04em] text-white shadow-[inset_0_1px_rgba(255,255,255,0.9),inset_0_-1px_rgba(0,77,27,0.35),0_0.18rem_0.45rem_rgba(0,96,52,0.28)] [text-shadow:0_1px_1px_rgba(0,81,43,0.76)] transition hover:brightness-110"
          onClick={handleStartClick}
          type="button"
        >
          <span className="absolute left-[8%] top-[6%] h-[38%] w-[84%] rounded-full bg-white/30" />
          <Grid2X2 className="relative z-10" size={16} strokeWidth={2.8} />
          <span className="relative z-10">Oxygen</span>
        </button>

        <div className="h-8 w-px shrink-0 bg-white/55" />

       <div className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden px-0.5 sm:gap-2">
          {taskbarPinnedAppIds.map((appId) => {
            const app = getDesktopApp(appId);
            const Icon = app.icon;
            const isActive =
              windows[appId]?.isOpen && !windows[appId]?.isMinimized;

            return (
              <button
                aria-label={`Open ${app.title}`}
                className={`relative flex h-10 shrink-0 items-center gap-2 overflow-hidden rounded-xl border px-3 text-[0.68rem] font-semibold transition ${
                  isActive
                    ? "border-white/90 bg-white/50 text-[#075f8d] shadow-[inset_0_1px_rgba(255,255,255,0.95),0_0.16rem_0.4rem_rgba(0,105,163,0.16)]"
                    : ":border-white/75 bg-white/30 text-[#063f60] shadow-[inset_0_1px_rgba(255,255,255,0.76)] hover:bg-white/58"
                }`}
                key={appId}
                onClick={(event) => handlePinnedAppClick(event, appId)}
                type="button"
              >
                <Icon size={17} strokeWidth={1.85} />
                <span className="hidden sm:inline">{app.shortTitle}</span>
              </button>
            );
          })}

          <button
            aria-label="Open OxygenOS Terminal"
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-white/75 bg-white/30 px-3 text-[0.72rem] font-bold text-[#063f60] shadow-[inset_0_1px_rgba(255,255,255,0.76)] transition hover:bg-white/58"
            onClick={handleTerminalClick}
            type="button"
          >
            <TerminalSquare size={17} strokeWidth={1.85} />
            <span className="hidden md:inline">Terminal</span>
          </button>

          <button
            aria-label="Open My Files"
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-white/75 bg-white/30 px-3 text-[0.72rem] font-bold text-[#063f60] shadow-[inset_0_1px_rgba(255,255,255,0.76)] transition hover:bg-white/58"
            onClick={handleFilesClick}
            type="button"
          >
            <FolderOpen size={17} strokeWidth={1.85} />
            <span>Files</span>
          </button>
        </div>

        <SystemClock />
      </footer>
    </>
  );
}

export default Taskbar;