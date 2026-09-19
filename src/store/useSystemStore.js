import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_FONT_SCALE,
  DEFAULT_WALLPAPER_ID,
  FONT_SCALE_MAX,
  FONT_SCALE_MIN,
  FONT_SCALE_STEP,
} from "../lib/constants";

const clampFontScale = (value) =>
  Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, value));

export const useSystemStore = create(
  persist(
    (set) => ({
      wallpaperId: DEFAULT_WALLPAPER_ID,
      customWallpaperUrl: null,
      customWallpaperName: null,
      fontScale: DEFAULT_FONT_SCALE,
      soundEnabled: true,
      reducedMotionOverride: false,
      systemTimeOffsetMs: 0,
      isStartMenuOpen: false,

      setWallpaperId: (wallpaperId) => set({ wallpaperId }),

      setCustomWallpaper: ({ url, name }) =>
        set({
          wallpaperId: "custom",
          customWallpaperUrl: url,
          customWallpaperName: name,
        }),

      clearCustomWallpaper: () =>
        set({
          customWallpaperUrl: null,
          customWallpaperName: null,
        }),

      increaseFontScale: () =>
        set((state) => ({
          fontScale: Number(
            clampFontScale(state.fontScale + FONT_SCALE_STEP).toFixed(2)
          ),
        })),

      decreaseFontScale: () =>
        set((state) => ({
          fontScale: Number(
            clampFontScale(state.fontScale - FONT_SCALE_STEP).toFixed(2)
          ),
        })),

      resetFontScale: () => set({ fontScale: DEFAULT_FONT_SCALE }),

      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),

      setReducedMotionOverride: (reducedMotionOverride) =>
        set({ reducedMotionOverride }),

      setSystemTimeOffsetMs: (systemTimeOffsetMs) =>
        set({ systemTimeOffsetMs }),

      toggleStartMenu: () =>
        set((state) => ({
          isStartMenuOpen: !state.isStartMenuOpen,
        })),

      closeStartMenu: () => set({ isStartMenuOpen: false }),

      resetSystemPreferences: () =>
        set({
          wallpaperId: DEFAULT_WALLPAPER_ID,
          customWallpaperUrl: null,
          customWallpaperName: null,
          fontScale: DEFAULT_FONT_SCALE,
          soundEnabled: true,
          reducedMotionOverride: false,
          systemTimeOffsetMs: 0,
          isStartMenuOpen: false,
        }),
    }),
    {
      name: "oxygenos-system-preferences",
      partialize: (state) => ({
        wallpaperId: state.wallpaperId,
        fontScale: state.fontScale,
        soundEnabled: state.soundEnabled,
        reducedMotionOverride: state.reducedMotionOverride,
        systemTimeOffsetMs: state.systemTimeOffsetMs,
      }),
    }
  )
);