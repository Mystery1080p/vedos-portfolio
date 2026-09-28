import {
  FilePenLine,
  FolderPlus,
  MonitorCog,
  RefreshCcw,
  TerminalSquare,
  Wallpaper,
} from "lucide-react";

function DesktopContextMenu({
  position,
  onClose,
  onCreateFolder,
  onCreateTextFile,
  onOpenTerminal,
  onOpenPersonalization,
}) {
  if (!position) {
    return null;
  }

  return (
    <aside
      className="fixed z-[500] w-60 overflow-hidden rounded-2xl border border-white/85 bg-[linear-gradient(145deg,rgba(245,255,255,0.96),rgba(118,216,246,0.84))] p-2 shadow-[inset_0_1px_rgba(255,255,255,0.95),0_0.9rem_1.8rem_rgba(0,68,109,0.32)] backdrop-blur-xl"
      onClick={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.preventDefault()}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <p className="px-3 pb-2 pt-1 text-[0.62rem] font-extrabold tracking-[0.1em] text-[#28779e]">
        OXYGENOS DESKTOP
      </p>

      <button
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#075a84] transition hover:bg-white/62"
        onClick={() => {
          onClose();
          window.location.reload();
        }}
        type="button"
      >
        <RefreshCcw size={16} strokeWidth={1.8} />
        Refresh desktop
      </button>

      <div className="my-2 h-px bg-[#1682ae]/25" />

      <p className="px-3 pb-1 text-[0.6rem] font-extrabold tracking-[0.1em] text-[#28779e]">
        NEW
      </p>

      <button
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#075a84] transition hover:bg-white/62"
        onClick={onCreateFolder}
        type="button"
      >
        <FolderPlus size={17} strokeWidth={1.7} />
        New Folder
      </button>

      <button
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#075a84] transition hover:bg-white/62"
        onClick={onCreateTextFile}
        type="button"
      >
        <FilePenLine size={17} strokeWidth={1.7} />
        New Text Document
      </button>

      <div className="my-2 h-px bg-[#1682ae]/25" />

      <button
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#075a84] transition hover:bg-white/62"
        onClick={onOpenTerminal}
        type="button"
      >
        <TerminalSquare size={17} strokeWidth={1.7} />
        Open Terminal
      </button>

      <button
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#075a84] transition hover:bg-white/62"
        onClick={onOpenPersonalization}
        type="button"
      >
        <Wallpaper size={17} strokeWidth={1.7} />
        Change Wallpaper
      </button>

      <div className="my-2 h-px bg-[#1682ae]/25" />

      <button
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#28779e] transition hover:bg-white/62"
        onClick={onClose}
        type="button"
      >
        <MonitorCog size={17} strokeWidth={1.7} />
        Desktop Properties
      </button>
    </aside>
  );
}

export default DesktopContextMenu;