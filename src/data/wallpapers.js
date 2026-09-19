export const wallpapers = [
  {
    id: "beach",
    name: "Beach",
    src: "/wallpapers/wallpaper-1.jpg",
    theme: "beach",
  },
  {
    id: "oxygen-water",
    name: "Oxygen Water",
    src: "/wallpapers/wallpaper-2.jpg",
    theme: "frutiger",
  },
  {
    id: "sleek",
    name: "Sleek",
    src: "/wallpapers/wallpaper-3.jpg",
    theme: "alba-aero",
    isDefault: true,
  },
  {
    id: "mountains",
    name: "Mountains",
    src: "/wallpapers/wallpaper-4.jpg",
    theme: "liminal",
  },
];

export function getWallpaperById(wallpaperId) {
  return (
    wallpapers.find((wallpaper) => wallpaper.id === wallpaperId) ??
    wallpapers.find((wallpaper) => wallpaper.isDefault) ??
    wallpapers[0]
  );
}