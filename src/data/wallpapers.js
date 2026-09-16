export const wallpapers = [
  {
    id: "matrix-grid",
    name: "Matrix Grid",
    value: `
      radial-gradient(circle at 50% 45%, rgba(34, 255, 165, 0.14), transparent 26rem),
      radial-gradient(circle at 12% 15%, rgba(57, 190, 255, 0.11), transparent 20rem),
      linear-gradient(135deg, #020504 0%, #071712 48%, #020604 100%)
    `,
  },
  {
    id: "deep-space",
    name: "Deep Space",
    value: `
      radial-gradient(circle at 72% 18%, rgba(126, 87, 255, 0.18), transparent 18rem),
      radial-gradient(circle at 20% 75%, rgba(0, 240, 255, 0.1), transparent 26rem),
      linear-gradient(145deg, #02030d 0%, #060722 50%, #010205 100%)
    `,
  },
  {
    id: "acid-dream",
    name: "Acid Dream",
    value: `
      radial-gradient(circle at 22% 22%, rgba(255, 110, 219, 0.15), transparent 20rem),
      radial-gradient(circle at 80% 62%, rgba(54, 255, 139, 0.15), transparent 24rem),
      linear-gradient(130deg, #100311 0%, #05140e 52%, #020504 100%)
    `,
  },
  {
    id: "cold-terminal",
    name: "Cold Terminal",
    value: `
      radial-gradient(circle at 45% 10%, rgba(127, 217, 255, 0.13), transparent 24rem),
      radial-gradient(circle at 90% 90%, rgba(114, 255, 229, 0.08), transparent 26rem),
      linear-gradient(135deg, #01070b 0%, #06202a 50%, #020607 100%)
    `,
  },
];

export function getWallpaperById(wallpaperId) {
  return (
    wallpapers.find((wallpaper) => wallpaper.id === wallpaperId) ??
    wallpapers[0]
  );
}