import { useRef } from "react";
import { useWindowStore } from "../../store/useWindowStore";
import WindowFrame from "./WindowFrame";

function DraggableWindow({ app, children }) {
  const dragStateRef = useRef(null);

  const windowState = useWindowStore((state) => state.windows[app.id]);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const toggleMaximizeWindow = useWindowStore(
    (state) => state.toggleMaximizeWindow
  );
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const setWindowPosition = useWindowStore((state) => state.setWindowPosition);

  if (!windowState?.isOpen || windowState.isMinimized) {
    return null;
  }

  const handleTitleBarPointerDown = (event) => {
    if (windowState.isMaximized || event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);

    dragStateRef.current = {
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startWindowX: windowState.position.x,
      startWindowY: windowState.position.y,
    };

    focusWindow(app.id);
  };

  const handlePointerMove = (event) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const taskbarHeight = 48;
    const viewportPadding = 8;
    const maxX = Math.max(viewportPadding, window.innerWidth - 180);
    const maxY = Math.max(
      viewportPadding,
      window.innerHeight - taskbarHeight - 70
    );

    const nextX = Math.min(
      maxX,
      Math.max(
        viewportPadding,
        dragState.startWindowX + event.clientX - dragState.startPointerX
      )
    );

    const nextY = Math.min(
      maxY,
      Math.max(
        viewportPadding,
        dragState.startWindowY + event.clientY - dragState.startPointerY
      )
    );

    setWindowPosition(app.id, {
      x: Math.round(nextX),
      y: Math.round(nextY),
    });
  };

  const handlePointerUp = (event) => {
    const dragState = dragStateRef.current;

    if (
      dragState &&
      dragState.pointerId === event.pointerId &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current = null;
  };

  const style = windowState.isMaximized
    ? {
        position: "fixed",
        inset: "8px 8px 56px 8px",
        zIndex: windowState.zIndex,
      }
    : {
        position: "fixed",
        left: `${windowState.position.x}px`,
        top: `${windowState.position.y}px`,
        width: `min(${windowState.size.width}px, calc(100vw - 16px))`,
        height: `min(${windowState.size.height}px, calc(100vh - 64px))`,
        zIndex: windowState.zIndex,
      };

  return (
    <div
      className="vedos-window-layer"
      onPointerDown={() => focusWindow(app.id)}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={style}
    >
      <WindowFrame
        className="h-full"
        isMaximized={windowState.isMaximized}
        onClose={() => closeWindow(app.id)}
        onMaximize={() => toggleMaximizeWindow(app.id)}
        onMinimize={() => minimizeWindow(app.id)}
        onTitleBarPointerDown={handleTitleBarPointerDown}
        title={app.title}
      >
        {children}
      </WindowFrame>
    </div>
  );
}

export default DraggableWindow;