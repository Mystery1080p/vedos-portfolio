function DesktopIcon({ app, isSelected, onClick, onDoubleClick }) {
  const Icon = app.icon;

  return (
    <button
      aria-label={`Open ${app.title}`}
      className={`oxygen-desktop-icon group flex w-24 flex-col items-center gap-2 rounded-2xl p-2 text-center transition ${
        isSelected
          ? "bg-white/40 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8),0_0.5rem_1.1rem_rgba(0,102,155,0.26)]"
          : "hover:bg-white/20"
      }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      type="button"
    >
      <span className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-2xl border border-white/85 bg-[linear-gradient(145deg,rgba(255,255,255,0.76),rgba(78,202,239,0.64))] shadow-[inset_0_1px_rgba(255,255,255,0.95),inset_0_-2px_rgba(0,110,170,0.18),0_0.4rem_0.9rem_rgba(0,88,140,0.26)] transition duration-200 group-hover:-translate-y-1 group-hover:scale-105">
        <span className="absolute left-[12%] top-[6%] h-[35%] w-[70%] rounded-full bg-white/45 blur-[1px]" />

        <Icon
          aria-hidden="true"
          className="relative z-10 text-[#0675ad] drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]"
          size={29}
          strokeWidth={1.55}
        />
      </span>

      <span className="max-w-full break-words rounded-lg bg-[#063f60]/12 px-2 py-1 text-[0.80rem] leading-4 text-white shadow-[0_1px_2px_rgba(255,255,255,0.28)]">
  {app.title}
</span>
    </button>
  );
}

export default DesktopIcon;