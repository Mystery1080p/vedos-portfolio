import {
  FolderOpen,
  MonitorCog,
  Power,
  TerminalSquare,
  UserRound,
} from "lucide-react";
import { getDesktopApp } from "../../data/desktopApps";
import { useSystemStore } from "../../store/useSystemStore";
import { useWindowStore } from "../../store/useWindowStore";

function StartMenu() {
  const isStartMenuOpen = useSystemStore((state) => state.isStartMenuOpen);
  const closeStartMenu = useSystemStore((state) => state.closeStartMenu);
  const openWindow = useWindowStore((state) => state.openWindow);

  if (!isStartMenuOpen) {
    return null;
  }

  const menuItems = [
    {
      id: "about",
      label: "About Vedanth",
      icon: UserRound,
    },
    {
      id: "projects",
      label: "Project Archive",
      icon: FolderOpen,
    },
    {
      id: "terminal",
      label: "Open Terminal",
      icon: TerminalSquare,
    },
    {
      id: "file-manager",
      label: "My Files",
      icon: FolderOpen,
    },
  ];

  const openApp = (appId) => {
    openWindow(appId);
    closeStartMenu();
  };

  return (
    <aside
  aria-label="VedOS Start menu"
  className="vedos-glass fixed bottom-12 left-2 z-[200] w-72 overflow-hidden"
  onClick={(event) => event.stopPropagation()}
>
      <header className="border-b border-cyan-300/50 bg-gradient-to-r from-cyan-300 to-emerald-400 px-3 py-2 text-xs font-bold tracking-[0.14em] text-black">
        VEDOS // START MENU
      </header>

      <div className="p-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const app = getDesktopApp(item.id);

          return (
            <button
              className="flex w-full items-center gap-3 px-3 py-3 text-left text-xs text-cyan-100 transition hover:bg-cyan-200 hover:text-black"
              key={item.id}
              onClick={() => openApp(item.id)}
              type="button"
            >
              <Icon size={18} strokeWidth={1.5} />
              <span className="flex-1">{item.label}</span>
              <span className="text-[0.58rem] opacity-60">
                {app?.shortTitle}
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-cyan-300/35 p-2">
        <button
          className="flex w-full items-center gap-3 px-3 py-3 text-left text-xs text-pink-200 transition hover:bg-pink-400 hover:text-black"
          onClick={closeStartMenu}
          type="button"
        >
          <Power size={18} strokeWidth={1.5} />
          <span>Close Start Menu</span>
          <MonitorCog className="ml-auto opacity-60" size={16} />
        </button>
      </div>
    </aside>
  );
}

export default StartMenu;