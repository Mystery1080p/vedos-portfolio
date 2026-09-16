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
        <span className="vedos-label">{label}</span>

        {showPercentage && (
          <span className="text-xs text-emerald-200">{safeProgress}%</span>
        )}
      </div>

      <div
        aria-label={`${label}: ${safeProgress}% complete`}
        aria-valuemax="100"
        aria-valuemin="0"
        aria-valuenow={safeProgress}
        className="h-5 border border-cyan-300/80 bg-black/55 p-[3px]"
        role="progressbar"
      >
        <div
          className="h-full bg-[repeating-linear-gradient(90deg,#36ff8b_0,#36ff8b_12px,#72ffe5_12px,#72ffe5_16px)] shadow-[0_0_14px_rgba(114,255,229,0.85)] transition-[width] duration-100 ease-linear"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
}

export default LoadingBar;