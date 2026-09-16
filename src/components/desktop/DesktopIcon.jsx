function DesktopIcon({ app, isSelected, onClick, onDoubleClick }) {
  const Icon = app.icon;

  return (
    <button
      aria-label={`Open ${app.title}`}
      className={`group flex w-24 flex-col items-center gap-2 rounded-sm p-2 text-center transition-colors ${
        isSelected
          ? "bg-cyan-200/20 outline outline-1 outline-cyan-200/70"
          : "hover:bg-cyan-200/10"
      }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      type="button"
    >
      <span className="grid h-12 w-12 place-items-center border border-cyan-200/60 bg-emerald-950/65 shadow-[0_0_14px_rgba(54,255,139,0.17)] transition-transform group-hover:-translate-y-0.5">
        <Icon
          aria-hidden="true"
          className="text-cyan-100 drop-shadow-[0_0_6px_rgba(114,255,229,0.8)]"
          size={27}
          strokeWidth={1.5}
        />
      </span>

      <span className="max-w-full break-words text-[0.66rem] leading-4 text-cyan-50 [text-shadow:0_0_5px_rgba(114,255,229,0.75)]">
        {app.title}
      </span>
    </button>
  );
}

export default DesktopIcon;