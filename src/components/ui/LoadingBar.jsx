function LoadingBar({
  progress = 0,
  label = "Loading",
  showPercentage = true,
  className = "",
}) {
  const safeProgress = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="oxygen-label">{label}</span>

        {showPercentage && (
          <span className="text-xs font-bold text-[#20769b]">
            {safeProgress}%
          </span>
        )}
      </div>

      <div
        aria-label={`${label}: ${safeProgress}% complete`}
        aria-valuemax="100"
        aria-valuemin="0"
        aria-valuenow={safeProgress}
        className="h-5 overflow-hidden rounded-full border border-white/80 bg-sky-900/15 p-[3px] shadow-[inset_0_1px_3px_rgba(0,89,140,0.2)]"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#54bd46_0%,#d9ff87_32%,#7eebff_58%,#169ed0_100%)] shadow-[inset_0_1px_rgba(255,255,255,0.8),0_0_10px_rgba(69,195,232,0.6)] transition-[width] duration-100 ease-linear"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
}

export default LoadingBar;