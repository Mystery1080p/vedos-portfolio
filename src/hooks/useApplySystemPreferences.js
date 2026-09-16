import { useEffect } from "react";
import { getWallpaperById } from "../data/wallpapers";
import { useSystemStore } from "../store/useSystemStore";

function useApplySystemPreferences() {
  const wallpaperId = useSystemStore((state) => state.wallpaperId);
  const fontScale = useSystemStore((state) => state.fontScale);
  const reducedMotionOverride = useSystemStore(
    (state) => state.reducedMotionOverride
  );

  useEffect(() => {
    const wallpaper = getWallpaperById(wallpaperId);

    document.documentElement.style.setProperty(
      "--desktop-wallpaper",
      wallpaper.value
    );
  }, [wallpaperId]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-scale",
      String(fontScale)
    );
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.dataset.vedosMotion =
      reducedMotionOverride ? "reduce" : "system";
  }, [reducedMotionOverride]);
}

export default useApplySystemPreferences;