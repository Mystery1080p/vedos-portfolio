import { Minus, Square, X } from "lucide-react";

function WindowFrame({
  title = "VedOS Window",
  children,
  className = "",
  showControls = true,
  onMinimize,
  onMaximize,
  onClose,
  onTitleBarPointerDown,
  isMaximized = false,
}) {
  return (
    <section className={`vedos-window ${className}`}>
      <header
        className="vedos-window-titlebar touch-none select-none"
        onPointerDown={onTitleBarPointerDown}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="vedos-status-dot shrink-0" />
          <span className="truncate">{title}</span>
        </div>

        {showControls && (
          <div
            className="flex shrink-0 items-center gap-1"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <button
              aria-label={`Minimize ${title}`}
              className="vedos-icon-button"
              onClick={onMinimize}
              type="button"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>

            <button
              aria-label={`${isMaximized ? "Restore" : "Maximize"} ${title}`}
              className="vedos-icon-button"
              onClick={onMaximize}
              type="button"
            >
              <Square size={10} strokeWidth={2.5} />
            </button>

            <button
              aria-label={`Close ${title}`}
              className="vedos-icon-button"
              onClick={onClose}
              type="button"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </header>

      <div className="vedos-window-body">{children}</div>
    </section>
  );
}

export default WindowFrame;