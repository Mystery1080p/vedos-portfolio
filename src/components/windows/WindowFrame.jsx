import { Minus, Square, X } from "lucide-react";

function WindowFrame({
  title = "VedOS Window",
  children,
  className = "",
  showControls = true,
  onMinimize,
  onMaximize,
  onClose,
}) {
  return (
    <section className={`vedos-window ${className}`}>
      <header className="vedos-window-titlebar">
        <div className="flex items-center gap-2">
          <span className="vedos-status-dot" />
          <span>{title}</span>
        </div>

        {showControls && (
          <div className="flex items-center gap-1">
            <button
              aria-label={`Minimize ${title}`}
              className="vedos-icon-button"
              onClick={onMinimize}
              type="button"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>

            <button
              aria-label={`Maximize ${title}`}
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