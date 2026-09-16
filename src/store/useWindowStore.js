import { create } from "zustand";
import { allDesktopApps } from "../data/desktopApps";

const createInitialWindows = () =>
  allDesktopApps.reduce((windows, app, index) => {
    windows[app.id] = {
      id: app.id,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 20 + index,
      position: app.defaultPosition,
      size: app.defaultSize,
    };

    return windows;
  }, {});

const getHighestZIndex = (windows) =>
  Math.max(...Object.values(windows).map((window) => window.zIndex), 20);

export const useWindowStore = create((set, get) => ({
  windows: createInitialWindows(),

  openWindow: (windowId) => {
    const { windows } = get();
    const targetWindow = windows[windowId];

    if (!targetWindow) {
      return;
    }

    const zIndex = getHighestZIndex(windows) + 1;

    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          isOpen: true,
          isMinimized: false,
          zIndex,
        },
      },
    }));
  },

  closeWindow: (windowId) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
        },
      },
    })),

  minimizeWindow: (windowId) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          isMinimized: true,
        },
      },
    })),

  toggleMaximizeWindow: (windowId) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          isMaximized: !state.windows[windowId].isMaximized,
          isMinimized: false,
          zIndex: getHighestZIndex(state.windows) + 1,
        },
      },
    })),

  focusWindow: (windowId) => {
    const { windows } = get();

    if (!windows[windowId]) {
      return;
    }

    const zIndex = getHighestZIndex(windows) + 1;

    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          zIndex,
        },
      },
    }));
  },

  setWindowPosition: (windowId, position) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          position,
        },
      },
    })),

  restoreWindow: (windowId) => {
    const { windows } = get();

    if (!windows[windowId]) {
      return;
    }

    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          isOpen: true,
          isMinimized: false,
          zIndex: getHighestZIndex(state.windows) + 1,
        },
      },
    }));
  },
}));