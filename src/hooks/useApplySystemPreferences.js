import { useEffect } from "react";
import { getWallpaperById } from "../data/wallpapers";
import { useSystemStore } from "../store/useSystemStore";

function useApplySystemPreferences() {
  const wallpaperId = useSystemStore((state) => state.wallpaperId);
  const customWallpaperUrl = useSystemStore(
    (state) => state.customWallpaperUrl
  );
  const fontScale = useSystemStore((state) => state.fontScale);
  const reducedMotionOverride = useSystemStore(
    (state) => state.reducedMotionOverride
  );

  useEffect(() => {
    const wallpaper =
      wallpaperId === "custom" && customWallpaperUrl
        ? { src: customWallpaperUrl }
        : getWallpaperById(wallpaperId);

    document.documentElement.style.setProperty(
      "--oxygen-wallpaper-image",
      `url("${wallpaper.src}")`
    );
  }, [wallpaperId, customWallpaperUrl]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-scale",
      String(fontScale)
    );
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.dataset.oxygenMotion =
      reducedMotionOverride ? "reduce" : "system";
  }, [reducedMotionOverride]);
}

export default useApplySystemPreferences;