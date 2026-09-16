import { useState } from "react";
import DesktopIcon from "../components/desktop/DesktopIcon";
import Taskbar from "../components/desktop/Taskbar";
import CrtShell from "../components/effects/CrtShell";
import DraggableWindow from "../components/windows/DraggableWindow";
import { desktopApps, getDesktopApp } from "../data/desktopApps";
import { useSystemStore } from "../store/useSystemStore";
import { useWindowStore } from "../store/useWindowStore";

function PlaceholderAppContent({ app }) {
  const Icon = app.icon;

  return (
    <div className="flex h-full min-h-72 flex-col gap-5">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center border border-cyan-200/60 bg-emerald-950/60">
          <Icon
            className="text-cyan-100 drop-shadow-[0_0_8px_rgba(114,255,229,0.7)]"
            size={30}
            strokeWidth={1.35}
          />
        </div>

        <div>
          <p className="vedos-label mb-1">Application module</p>
          <h2 className="vedos-glow-text m-0 text-lg">{app.title}</h2>
          <p className="mt-2 text-xs leading-5 text-cyan-100/75">
            {app.description}
          </p>
        </div>
      </div>

      <div className="vedos-divider" />

      <div className="vedos-glass-deep flex-1 p-4 text-xs leading-6 text-emerald-100/85">
        <p className="m-0">
          [SYSTEM] Module registered successfully.
        </p>
        <p className="m-0">
          [STATUS] Interactive content will be installed in the next VedOS
          build phases.
        </p>
        <p className="vedos-cursor vedos-glow-green mt-4">
          READY_FOR_MODULE_DATA
        </p>
      </div>
    </div>
  );
}

function DesktopScreen() {
  const [selectedAppId, setSelectedAppId] = useState(null);

  const closeStartMenu = useSystemStore((state) => state.closeStartMenu);
  const openWindow = useWindowStore((state) => state.openWindow);
  const windows = useWindowStore((state) => state.windows);

  const handleDesktopClick = () => {
    setSelectedAppId(null);
    closeStartMenu();
  };

  const handleOpenApp = (appId) => {
    openWindow(appId);
    setSelectedAppId(appId);
  };

  const myFilesApp = getDesktopApp("file-manager");

  return (
    <CrtShell>
      <main
        className="vedos-os vedos-grid relative min-h-screen overflow-hidden pb-12"
        onClick={handleDesktopClick}
      >
        <section className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 border-b border-cyan-200/20 bg-black/15 px-4 py-2 text-[0.62rem] tracking-[0.12em] text-cyan-100/60 backdrop-blur-sm">
          <span>VEDOS {`//`} PORTFOLIO ENVIRONMENT</span>

          <span className="hidden text-emerald-200/70 sm:inline">
            DESKTOP_SESSION: ACTIVE
          </span>
        </section>

        <section
          aria-label="VedOS desktop applications"
          className="relative z-20 grid w-max grid-cols-2 gap-x-2 gap-y-4 px-4 pt-14 sm:grid-cols-3 sm:gap-x-5 sm:px-7"
          onClick={(event) => event.stopPropagation()}
        >
          {desktopApps.map((app) => (
            <DesktopIcon
              app={app}
              isSelected={selectedAppId === app.id}
              key={app.id}
              onClick={() => setSelectedAppId(app.id)}
              onDoubleClick={() => handleOpenApp(app.id)}
            />
          ))}
        </section>

        {desktopApps.map((app) => (
          <DraggableWindow app={app} key={app.id}>
            <PlaceholderAppContent app={app} />
          </DraggableWindow>
        ))}

        <DraggableWindow app={myFilesApp}>
          <PlaceholderAppContent app={myFilesApp} />
        </DraggableWindow>

        <div className="pointer-events-none absolute bottom-16 right-4 z-10 hidden max-w-xs text-right text-[0.6rem] leading-4 tracking-[0.1em] text-emerald-100/30 lg:block">
          <p>VEDOS BIOS // CRT DISPLAY ACTIVE</p>
          <p>USER: VISITOR // ACCESS: PORTFOLIO</p>
          <p>UPLINK: LOCALHOST // STATUS: STABLE</p>
        </div>

        <Taskbar />

        {Object.values(windows).some(
          (windowState) => windowState.isOpen
        ) && (
          <div className="pointer-events-none fixed bottom-14 left-3 z-30 hidden text-[0.58rem] tracking-[0.1em] text-emerald-200/50 xl:block">
            WINDOW_MANAGER: ONLINE
          </div>
        )}
      </main>
    </CrtShell>
  );
}

export default DesktopScreen;