import {
  Code2,
  FolderOpen,
  Mail,
  TerminalSquare,
  UserRound,
} from "lucide-react";

export const desktopApps = [
  {
    id: "about",
    title: "About Me",
    shortTitle: "About",
    icon: UserRound,
    description: "Vedanth Mandpe profile and skills",
    defaultPosition: { x: 28, y: 34 },
    defaultSize: { width: 560, height: 460 },
    accent: "cyan",
  },
  {
    id: "projects",
    title: "Projects",
    shortTitle: "Projects",
    icon: Code2,
    description: "Portfolio project archive",
    defaultPosition: { x: 140, y: 170 },
    defaultSize: { width: 700, height: 500 },
    accent: "green",
  },
  {
    id: "terminal",
    title: "Terminal",
    shortTitle: "Terminal",
    icon: TerminalSquare,
    description: "VedOS command interface",
    defaultPosition: { x: 260, y: 82 },
    defaultSize: { width: 720, height: 480 },
    accent: "green",
  },
  {
    id: "contact",
    title: "Contact Me",
    shortTitle: "Contact",
    icon: Mail,
    description: "Send a hiring message",
    defaultPosition: { x: 90, y: 315 },
    defaultSize: { width: 620, height: 480 },
    accent: "pink",
  },
];

export const taskbarPinnedAppIds = ["about", "projects", "contact"];

export const systemApps = [
  {
    id: "file-manager",
    title: "My Files",
    shortTitle: "Files",
    icon: FolderOpen,
    description: "Personal VedOS workspace",
    defaultPosition: { x: 190, y: 105 },
    defaultSize: { width: 720, height: 480 },
    accent: "cyan",
  },
];

export const allDesktopApps = [...desktopApps, ...systemApps];

export function getDesktopApp(appId) {
  return allDesktopApps.find((app) => app.id === appId);
}