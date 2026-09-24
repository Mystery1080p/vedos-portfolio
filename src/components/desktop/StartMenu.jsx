import {
  MonitorCog,
  Music2,
  Palette,
  Power,
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
      id: "personalization",
      label: "Personalization",
      icon: Palette,
    },
    {
      id: "music-player",
      label: "Oxygen Music",
      icon: Music2,
    },
  ];

  const openApp = (appId) => {
    openWindow(appId);
    closeStartMenu();
  };

  return (
    <aside
      aria-label="OxygenOS Start menu"
      className="oxygen-glass fixed bottom-[4.3rem] left-1/2 z-[200] w-[min(92vw,320px)] -translate-x-1/2 overflow-hidden rounded-[1.4rem]"
      onClick={(event) => event.stopPropagation()}
    >
      <header className="border-b border-white/75 bg-[linear-gradient(180deg,rgba(232,255,255,0.91),rgba(86,204,239,0.72))] px-4 py-3 text-xs font-extrabold tracking-[0.07em] text-[#075a85]">
        OXYGENOS START
      </header>

      <div className="p-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const app = getDesktopApp(item.id);

          return (
            <button
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-semibold text-[#0b618d] transition hover:bg-white/55"
              key={item.id}
              onClick={() => openApp(item.id)}
              type="button"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/75 bg-sky-100/55 shadow-[inset_0_1px_rgba(255,255,255,0.9)]">
                <Icon size={17} strokeWidth={1.65} />
              </span>

              <span className="flex-1">{item.label}</span>

              <span className="text-[0.58rem] font-normal text-[#287ca2]/70">
                {app?.shortTitle}
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-white/65 p-2">
        <button
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-semibold text-[#2b7593] transition hover:bg-white/55"
          onClick={closeStartMenu}
          type="button"
        >
          <Power size={18} strokeWidth={1.65} />
          <span>Close Start Menu</span>
          <MonitorCog className="ml-auto opacity-60" size={16} />
        </button>
      </div>
    </aside>
  );
}

export default StartMenu;