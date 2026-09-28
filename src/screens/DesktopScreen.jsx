import { useState } from "react";
import DesktopIcon from "../components/desktop/DesktopIcon";
import Taskbar from "../components/desktop/Taskbar";
import CrtShell from "../components/effects/CrtShell";
import DraggableWindow from "../components/windows/DraggableWindow";
import FileExplorerWindow from "../components/windows/FileExplorerWindow";
import MusicPlayerWindow from "../components/windows/MusicPlayerWindow";
import PersonalizationWindow from "../components/windows/PersonalizationWindow";
import TerminalWindow from "../components/windows/TerminalWindow";
import { desktopApps, getDesktopApp } from "../data/desktopApps";
import { useFileSystemStore } from "../store/useFileSystemStore";
import { useSystemStore } from "../store/useSystemStore";
import { useWindowStore } from "../store/useWindowStore";
import CreateDesktopItemDialog from "../components/desktop/CreateDesktopItemDialog";
import DesktopContextMenu from "../components/desktop/DesktopContextMenu";

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

          <h2 className="m-0 text-xl font-bold text-[#075a84]">
            {app.title}
          </h2>

          <p className="mt-2 text-xs leading-5 text-[#28779e]">
            {app.description}
          </p>
        </div>
      </div>

      <div className="oxygen-divider" />

      <div className="oxygen-glass-deep flex-1 p-4 text-xs leading-6 text-[#176e96]">
        <p className="m-0">
          Welcome to the OxygenOS application environment.
        </p>

        <p className="m-0">
          This portfolio module will receive its final content in the next
          implementation stages.
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
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
const [createDialogType, setCreateDialogType] = useState(null);

  const closeStartMenu = useSystemStore((state) => state.closeStartMenu);
  const openWindow = useWindowStore((state) => state.openWindow);
  const windows = useWindowStore((state) => state.windows);

  const setCurrentFolderId = useFileSystemStore(
    (state) => state.setCurrentFolderId
  );

  const createFolder = useFileSystemStore((state) => state.createFolder);
const createTextFile = useFileSystemStore((state) => state.createTextFile);
const lastFileSystemError = useFileSystemStore((state) => state.lastError);
const clearLastError = useFileSystemStore(
  (state) => state.clearLastError
);

  const myFilesApp = getDesktopApp("file-manager");
  const personalizationApp = getDesktopApp("personalization");
  const musicPlayerApp = getDesktopApp("music-player");

  const handleDesktopClick = () => {
  setSelectedAppId(null);
  closeStartMenu();
  closeDesktopContextMenu();
};

  const handleOpenApp = (appId) => {
    if (appId === "recycle-bin") {
      setCurrentFolderId("recycle-bin");
      openWindow("file-manager");
      setSelectedAppId("recycle-bin");
      return;
    }

    openWindow(appId);
    setSelectedAppId(appId);
  };

  const renderWindowContent = (app) => {
    if (app.id === "terminal") {
      return <TerminalWindow />;
    }

    if (app.id === "file-manager") {
      return <FileExplorerWindow />;
    }

    if (app.id === "personalization") {
      return <PersonalizationWindow />;
    }

    if (app.id === "music-player") {
      return <MusicPlayerWindow />;
    }

    return <PlaceholderAppContent app={app} />;
  };

  const primaryDesktopApps = desktopApps.filter(
    (app) => app.id !== "recycle-bin"
  );

  const recycleBinApp = desktopApps.find(
    (app) => app.id === "recycle-bin"
  );

  const systemWindowApps = [
    myFilesApp,
    personalizationApp,
    musicPlayerApp,
  ].filter(Boolean);

  const closeDesktopContextMenu = () => {
  setContextMenuPosition(null);
};

const handleDesktopContextMenu = (event) => {
  event.preventDefault();
  event.stopPropagation();

  const menuWidth = 240;
  const menuHeight = 360;
  const viewportPadding = 12;

  const x = Math.min(
    event.clientX,
    window.innerWidth - menuWidth - viewportPadding
  );

  const y = Math.min(
    event.clientY,
    window.innerHeight - menuHeight - viewportPadding
  );

  setSelectedAppId(null);
  closeStartMenu();

  setContextMenuPosition({
    x: Math.max(viewportPadding, x),
    y: Math.max(viewportPadding, y),
  });
};

const openCreateDialog = (type) => {
  closeDesktopContextMenu();
  clearLastError();
  setCreateDialogType(type);
};

const closeCreateDialog = () => {
  clearLastError();
  setCreateDialogType(null);
};

const createDesktopItem = (name) => {
  const wasCreated =
    createDialogType === "folder"
      ? createFolder("my-files", name)
      : createTextFile("my-files", name);

  if (wasCreated) {
    setCurrentFolderId("my-files");
    openWindow("file-manager");
    closeCreateDialog();
  }

  return wasCreated;
};

const openTerminalFromContextMenu = () => {
  closeDesktopContextMenu();
  openWindow("terminal");
};

const openPersonalizationFromContextMenu = () => {
  closeDesktopContextMenu();
  openWindow("personalization");
};

  return (
    <CrtShell>
      <main
  className="oxygen-os relative min-h-screen overflow-visible pb-20"
  onClick={handleDesktopClick}
  onContextMenu={handleDesktopContextMenu}
>

        <section
  aria-label="OxygenOS desktop applications"
  className="relative z-20 grid w-max grid-cols-2 gap-x-3 gap-y-4 px-4 pt-16 sm:grid-cols-3 sm:gap-x-5 sm:px-7"
  onClick={(event) => event.stopPropagation()}
  onContextMenu={(event) => event.stopPropagation()}
>
          {primaryDesktopApps.map((app) => (
            <DesktopIcon
              app={app}
              isSelected={selectedAppId === app.id}
              key={app.id}
              onClick={() => setSelectedAppId(app.id)}
              onDoubleClick={() => handleOpenApp(app.id)}
            />
          ))}

          {recycleBinApp && (
            <DesktopIcon
              app={recycleBinApp}
              isSelected={selectedAppId === recycleBinApp.id}
              key={recycleBinApp.id}
              onClick={() => setSelectedAppId(recycleBinApp.id)}
              onDoubleClick={() => handleOpenApp(recycleBinApp.id)}
            />
          )}
        </section>

        <aside className="pointer-events-none absolute bottom-24 right-[7%] z-10 hidden items-center gap-5 lg:flex">
          <div className="max-w-56 rounded-2xl border border-white/58 bg-white/22 p-4 text-xs leading-5 text-white shadow-[inset_0_1px_rgba(255,255,255,0.72),0_0.7rem_1.2rem_rgba(0,71,112,0.18)] [text-shadow:0_1px_2px_rgba(0,67,103,0.84)] backdrop-blur-md">
            <p className="mb-1 font-bold">Welcome to OxygenOS</p>

            <p className="m-0">
              Explore a Creative And Interactive World of Me !
            </p>
          </div>
        </aside>

        {primaryDesktopApps.map((app) => (
          <DraggableWindow app={app} key={`desktop-window-${app.id}`}>
            {renderWindowContent(app)}
          </DraggableWindow>
        ))}

        {systemWindowApps.map((app) => (
          <DraggableWindow app={app} key={`system-window-${app.id}`}>
            {renderWindowContent(app)}
          </DraggableWindow>
        ))}

        <DesktopContextMenu
  onClose={closeDesktopContextMenu}
  onCreateFolder={() => openCreateDialog("folder")}
  onCreateTextFile={() => openCreateDialog("file")}
  onOpenPersonalization={openPersonalizationFromContextMenu}
  onOpenTerminal={openTerminalFromContextMenu}
  position={contextMenuPosition}
/>

{createDialogType && (
  <CreateDesktopItemDialog
    errorMessage={lastFileSystemError}
    onCancel={closeCreateDialog}
    onCreate={createDesktopItem}
    type={createDialogType}
  />
)}

        <Taskbar />

        {Object.values(windows).some((windowState) => windowState.isOpen) && (
          <div className="pointer-events-none fixed bottom-20 left-1/2 z-30 hidden -translate-x-1/2 rounded-full bg-white/20 px-3 py-1 text-[0.58rem] font-bold tracking-[0.1em] text-white [text-shadow:0_1px_2px_rgba(0,62,97,0.8)] xl:block">
            OXYGENOS WINDOW MANAGER ACTIVE
          </div>
        )}
      </main>
    </CrtShell>
  );
}

export default DesktopScreen;