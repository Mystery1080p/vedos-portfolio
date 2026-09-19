import { useState } from "react";
import DesktopIcon from "../components/desktop/DesktopIcon";
import Taskbar from "../components/desktop/Taskbar";
import CrtShell from "../components/effects/CrtShell";
import PersonalizationWindow from "../components/windows/PersonalizationWindow";
import DraggableWindow from "../components/windows/DraggableWindow";
import { desktopApps, getDesktopApp } from "../data/desktopApps";
import { useSystemStore } from "../store/useSystemStore";
import { useWindowStore } from "../store/useWindowStore";
import { Palette } from "lucide-react";

function PlaceholderAppContent({ app }) {
  const Icon = app.icon;

  return (
    <div className="flex h-full min-h-72 flex-col gap-5 text-[#075a84]">
      <div className="flex items-start gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-white/85 bg-[linear-gradient(145deg,rgba(255,255,255,0.75),rgba(78,202,239,0.62))] shadow-[inset_0_1px_rgba(255,255,255,0.95),inset_0_-2px_rgba(0,110,170,0.18),0_0.4rem_0.9rem_rgba(0,88,140,0.22)]">
          <Icon size={32} strokeWidth={1.35} />
        </div>

        <div>
          <p className="oxygen-label mb-1">OxygenOS application</p>
          <h2 className="m-0 font-['Trebuchet_MS'] text-xl font-bold text-[#075a84]">
            {app.title}
          </h2>
          <p className="mt-2 text-xs leading-5 text-[#28779e]">
            {app.description}
          </p>
        </div>
      </div>

      <div className="oxygen-divider" />

      <div className="oxygen-glass-deep flex-1 p-4 text-xs leading-6 text-[#176e96]">
        <p className="m-0">Welcome to the OxygenOS application environment.</p>
        <p className="m-0">
          This module will receive its final portfolio functionality in the
          next implementation stages.
        </p>

        <p className="mt-4 font-semibold text-[#248d41]">
          Status: Ready for personalization
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
        className="oxygen-os relative min-h-screen overflow-hidden pb-20"
        onClick={handleDesktopClick}
      >
       

        <section
          aria-label="OxygenOS desktop applications"
          className="relative z-20 flex w-28 flex-col items-center gap-3 px-4 pt-10 sm:px-6"
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
        

        <aside className="pointer-events-none absolute bottom-24 right-[7%] z-10 hidden items-center gap-5 lg:flex">
          

          <div className="max-w-56 rounded-2xl border border-white/58 bg-white/22 p-4 text-xs leading-5 text-white shadow-[inset_0_1px_rgba(255,255,255,0.72),0_0.7rem_1.2rem_rgba(0,71,112,0.18)] [text-shadow:0_1px_2px_rgba(0,67,103,0.84)] backdrop-blur-md">
            <p className="mb-1 font-bold">Welcome to OxygenOS</p>
            <p className="m-0">
              Hello Visitor! Feel free to explore the functionalities of this platforms.
            </p>
          </div>
        </aside>

        {desktopApps.map((app) => (
          <DraggableWindow app={app} key={app.id}>
            <PlaceholderAppContent app={app} />
          </DraggableWindow>
        ))}

        <DraggableWindow app={myFilesApp}>
          <PlaceholderAppContent app={myFilesApp} />
        </DraggableWindow>

        <DraggableWindow app={getDesktopApp("personalization")}>
  <PersonalizationWindow />
</DraggableWindow>

        <Taskbar />

        {Object.values(windows).some(
          (windowState) => windowState.isOpen
        ) && (
          <div className="pointer-events-none fixed bottom-20 left-1/2 z-30 hidden -translate-x-1/2 rounded-full bg-white/20 px-3 py-1 text-[0.58rem] font-bold tracking-[0.1em] text-white [text-shadow:0_1px_2px_rgba(0,62,97,0.8)] xl:block">
            OXYGENOS WINDOW MANAGER ACTIVE
          </div>
        )}
      </main>
    </CrtShell>
  );
}

export default DesktopScreen;