import { ImagePlus, RotateCcw, Upload, Wallpaper } from "lucide-react";
import { useRef } from "react";
import { wallpapers } from "../../data/wallpapers";
import { DEFAULT_WALLPAPER_ID } from "../../lib/constants";
import { useSystemStore } from "../../store/useSystemStore";

function PersonalizationWindow() {
  const inputRef = useRef(null);

  const wallpaperId = useSystemStore((state) => state.wallpaperId);
  const customWallpaperUrl = useSystemStore(
    (state) => state.customWallpaperUrl
  );
  const customWallpaperName = useSystemStore(
    (state) => state.customWallpaperName
  );

  const setWallpaperId = useSystemStore((state) => state.setWallpaperId);
  const setCustomWallpaper = useSystemStore(
    (state) => state.setCustomWallpaper
  );
  const clearCustomWallpaper = useSystemStore(
    (state) => state.clearCustomWallpaper
  );

  const handleDefaultWallpaper = (wallpaperIdToApply) => {
    setWallpaperId(wallpaperIdToApply);
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      window.alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      window.alert("Please choose an image smaller than 8 MB.");
      event.target.value = "";
      return;
    }

    if (customWallpaperUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(customWallpaperUrl);
    }

    const objectUrl = URL.createObjectURL(file);

    setCustomWallpaper({
      url: objectUrl,
      name: file.name,
    });

    event.target.value = "";
  };

  const handleReset = () => {
    if (customWallpaperUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(customWallpaperUrl);
    }

    clearCustomWallpaper();
    setWallpaperId(DEFAULT_WALLPAPER_ID);
  };

  return (
    <div className="flex min-h-full flex-col gap-5 text-[#075a84]">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="oxygen-label mb-1">OxygenOS appearance</p>
          <h2 className="m-0 text-xl font-bold text-[#075a84]">
            Personalize your desktop
          </h2>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-[#28779e]">
            Choose one of the built-in nature wallpapers, or temporarily use
            an image from your device.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/75 bg-white/38 px-3 py-2 text-[0.68rem] font-bold text-[#14739a]">
          <Wallpaper size={15} strokeWidth={1.8} />
          WALLPAPER SETTINGS
        </div>
      </header>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="oxygen-label mb-1">Built-in collection</p>
            <p className="m-0 text-xs text-[#28779e]">
              Select a wallpaper to apply it instantly.
            </p>
          </div>

          <button
            className="oxygen-button flex items-center gap-2"
            onClick={handleReset}
            type="button"
          >
            <RotateCcw size={15} strokeWidth={2} />
            Reset default
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {wallpapers.map((wallpaper) => {
            const isActive = wallpaperId === wallpaper.id;

            return (
              <button
                aria-pressed={isActive}
                className={`group relative overflow-hidden rounded-2xl border text-left transition ${
                  isActive
                    ? "border-[#f5a33d] ring-4 ring-[#f5a33d]/30"
                    : "border-white/75 hover:border-[#62c6e9]"
                }`}
                key={wallpaper.id}
                onClick={() => handleDefaultWallpaper(wallpaper.id)}
                type="button"
              >
                <img
                  alt={`${wallpaper.name} wallpaper preview`}
                  className="h-28 w-full object-cover transition duration-300 group-hover:scale-105"
                  src={wallpaper.src}
                />

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-[linear-gradient(90deg,rgba(3,68,104,0.85),rgba(8,129,180,0.62))] px-3 py-2 text-white">
                  <span className="text-xs font-bold">{wallpaper.name}</span>

                  {isActive && (
                    <span className="rounded-full bg-[#d9ff87] px-2 py-0.5 text-[0.58rem] font-extrabold tracking-[0.08em] text-[#075a48]">
                      ACTIVE
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="oxygen-divider" />

      <section className="oxygen-glass-deep p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="oxygen-label mb-1">Personal image</p>
            <h3 className="m-0 text-base font-bold text-[#075a84]">
              Use your own wallpaper
            </h3>
            <p className="mt-2 max-w-lg text-xs leading-5 text-[#28779e]">
              Choose a JPG, PNG, WebP, GIF, or other image from your device.
              It stays in this browser session only and is never uploaded.
            </p>
          </div>

          <button
            className="oxygen-button flex items-center gap-2"
            onClick={handleUploadClick}
            type="button"
          >
            <Upload size={15} strokeWidth={2} />
            Choose image
          </button>

          <input
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            ref={inputRef}
            type="file"
          />
        </div>

        {customWallpaperUrl && (
          <div className="mt-4 overflow-hidden rounded-xl border border-white/75 bg-white/35">
            <div className="grid gap-3 p-3 sm:grid-cols-[150px_1fr] sm:items-center">
              <img
                alt="Your uploaded wallpaper preview"
                className="h-24 w-full rounded-lg object-cover"
                src={customWallpaperUrl}
              />

              <div>
                <p className="oxygen-label mb-1">Current personal image</p>
                <p className="m-0 break-all text-xs font-bold text-[#146b92]">
                  {customWallpaperName}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    className="oxygen-button flex items-center gap-2"
                    onClick={() =>
                      setCustomWallpaper({
                        url: customWallpaperUrl,
                        name: customWallpaperName,
                      })
                    }
                    type="button"
                  >
                    <ImagePlus size={15} strokeWidth={2} />
                    Apply image
                  </button>

                  <button
                    className="oxygen-button oxygen-button-danger"
                    onClick={handleReset}
                    type="button"
                  >
                    Remove image
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default PersonalizationWindow;