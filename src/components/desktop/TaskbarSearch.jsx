import {
  FileText,
  Folder,
  Music2,
  Palette,
  Recycle,
  Search,
  Settings2,
  TerminalSquare,
  UserRound,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { getDesktopApp } from "../../data/desktopApps";
import { findNodeById } from "../../lib/fileSystem";
import { useFileSystemStore } from "../../store/useFileSystemStore";
import { useSystemStore } from "../../store/useSystemStore";
import { useWindowStore } from "../../store/useWindowStore";

const systemSearchItems = [
  {
    id: "personalization",
    name: "Personalization",
    type: "System Settings",
    keywords: ["theme", "themes", "wallpaper", "background", "appearance"],
    icon: Palette,
    action: "open-window",
  },
  {
    id: "music-player",
    name: "Oxygen Music",
    type: "System Application",
    keywords: ["music", "songs", "audio", "player", "playlist"],
    icon: Music2,
    action: "open-window",
  },
  {
    id: "about",
    name: "About Me",
    type: "Portfolio Folder",
    keywords: ["about", "vedanth", "skills", "profile"],
    icon: UserRound,
    action: "open-window",
  },
  {
    id: "projects",
    name: "Projects",
    type: "Portfolio Folder",
    keywords: ["project", "projects", "portfolio", "work"],
    icon: Folder,
    action: "open-window",
  },
  {
    id: "contact",
    name: "Contact Me",
    type: "Portfolio Folder",
    keywords: ["contact", "email", "gmail", "hire", "hiring"],
    icon: FileText,
    action: "open-window",
  },
  {
    id: "terminal",
    name: "Terminal",
    type: "System Application",
    keywords: ["terminal", "command", "console", "shell"],
    icon: TerminalSquare,
    action: "open-window",
  },
  {
    id: "file-manager",
    name: "My Files",
    type: "System Folder",
    keywords: ["files", "folders", "documents", "workspace", "notepad"],
    icon: Folder,
    action: "open-files",
  },
  {
    id: "recycle-bin",
    name: "Recycle Bin",
    type: "System Folder",
    keywords: ["bin", "trash", "deleted", "delete", "restore"],
    icon: Recycle,
    action: "open-bin",
  },
  {
    id: "oxygen-settings",
    name: "OxygenOS Settings",
    type: "System Settings",
    keywords: ["settings", "font", "time", "date", "sound", "motion"],
    icon: Settings2,
    action: "open-window",
    targetWindowId: "personalization",
  },
];

function normalizeSearchValue(value) {
  return value.trim().toLowerCase();
}

function findParentFolder(node, childId) {
  if (!node || node.type !== "folder") {
    return null;
  }

  for (const child of node.children ?? []) {
    if (child.id === childId) {
      return node;
    }

    const foundParent = findParentFolder(child, childId);

    if (foundParent) {
      return foundParent;
    }
  }

  return null;
}

function flattenFileSystem(node, ancestors = []) {
  if (!node) {
    return [];
  }

  const currentPath = [...ancestors, node.name].join(" / ");

  const currentItem = {
    id: node.id,
    name: node.name,
    type: node.type === "folder" ? "Folder" : "Text File",
    icon: node.type === "folder" ? Folder : FileText,
    action: node.type === "folder" ? "open-folder" : "open-file",
    path: currentPath,
    keywords: [
      node.name,
      node.type,
      ...(node.type === "file" ? ["text", "notepad", "document"] : []),
      ...(node.id === "my-files"
        ? ["files", "folders", "documents", "workspace"]
        : []),
      ...(node.id === "recycle-bin"
        ? ["bin", "trash", "deleted", "restore"]
        : []),
    ],
  };

  if (node.type !== "folder") {
    return [currentItem];
  }

  return [
    currentItem,
    ...(node.children ?? []).flatMap((child) =>
      flattenFileSystem(child, [...ancestors, node.name])
    ),
  ];
}

function TaskbarSearch() {
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [popupPosition, setPopupPosition] = useState({
    left: 0,
    bottom: 0,
    width: 320,
  });

  const openWindow = useWindowStore((state) => state.openWindow);
  const closeStartMenu = useSystemStore((state) => state.closeStartMenu);

  const fileSystem = useFileSystemStore((state) => state.fileSystem);
  const setCurrentFolderId = useFileSystemStore(
    (state) => state.setCurrentFolderId
  );
  const openFile = useFileSystemStore((state) => state.openFile);

  const fileSystemSearchItems = useMemo(() => {
    const allItems = flattenFileSystem(fileSystem.root);

    return allItems
      .filter(
        (item) =>
          item.id !== "root" &&
          !["about", "projects", "terminal", "contact"].includes(item.id)
      )
      .map((item) => ({
        ...item,
        type: `My Files · ${item.type}`,
      }));
  }, [fileSystem]);

  const suggestions = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(query);

    if (!normalizedQuery) {
      return [];
    }

    const allSearchItems = [...systemSearchItems, ...fileSystemSearchItems];
    const seenItems = new Set();

    return allSearchItems
      .filter((item) => {
        const uniqueKey = `${item.action}-${item.id}`;

        if (seenItems.has(uniqueKey)) {
          return false;
        }

        const searchableText = [
          item.name,
          item.type,
          item.path ?? "",
          ...(item.keywords ?? []),
        ]
          .join(" ")
          .toLowerCase();

        const doesMatch = searchableText.includes(normalizedQuery);

        if (doesMatch) {
          seenItems.add(uniqueKey);
        }

        return doesMatch;
      })
      .slice(0, 8);
  }, [query, fileSystemSearchItems]);

  const hasSuggestions = isFocused && query.trim().length > 0;

  useLayoutEffect(() => {
    if (!hasSuggestions || !wrapperRef.current) {
      return undefined;
    }

    const updatePopupPosition = () => {
      const rect = wrapperRef.current.getBoundingClientRect();

      setPopupPosition({
        left: Math.max(8, rect.left),
        bottom: Math.max(76, window.innerHeight - rect.top + 9),
        width: Math.max(288, rect.width),
      });
    };

    updatePopupPosition();

    window.addEventListener("resize", updatePopupPosition);
    window.addEventListener("scroll", updatePopupPosition, true);

    return () => {
      window.removeEventListener("resize", updatePopupPosition);
      window.removeEventListener("scroll", updatePopupPosition, true);
    };
  }, [hasSuggestions]);

  const clearSearch = (event) => {
    event?.stopPropagation();
    setQuery("");
    setActiveSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const closeSearch = () => {
    setQuery("");
    setActiveSuggestionIndex(-1);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const openSearchResult = (item) => {
    if (item.action === "open-window") {
      const windowId = item.targetWindowId ?? item.id;
      const app = getDesktopApp(windowId);

      if (app) {
        openWindow(windowId);
      }
    }

    if (item.action === "open-files") {
      setCurrentFolderId("my-files");
      openWindow("file-manager");
    }

    if (item.action === "open-bin") {
      setCurrentFolderId("recycle-bin");
      openWindow("file-manager");
    }

    if (item.action === "open-folder") {
      const folder = findNodeById(fileSystem.root, item.id);

      if (folder?.type === "folder") {
        setCurrentFolderId(folder.id);
        openWindow("file-manager");
      }
    }

    if (item.action === "open-file") {
      const file = findNodeById(fileSystem.root, item.id);

      if (file?.type === "file") {
        const parentFolder = findParentFolder(fileSystem.root, file.id);

        if (parentFolder) {
          setCurrentFolderId(parentFolder.id);
        }

        openFile(file.id);
        openWindow("file-manager");
      }
    }

    closeStartMenu();
    closeSearch();
  };

  const handleKeyDown = (event) => {
    event.stopPropagation();

    if (!suggestions.length) {
      if (event.key === "Escape") {
        closeSearch();
      }

      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveSuggestionIndex((currentIndex) =>
        currentIndex >= suggestions.length - 1 ? 0 : currentIndex + 1
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveSuggestionIndex((currentIndex) =>
        currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1
      );

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const selectedItem =
        suggestions[activeSuggestionIndex] ?? suggestions[0];

      openSearchResult(selectedItem);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
    }
  };

  const suggestionsPopup =
    hasSuggestions && typeof document !== "undefined"
      ? createPortal(
          <div
            className="oxygen-search-suggestions fixed z-[10000] overflow-hidden rounded-2xl border border-white/85 bg-[linear-gradient(145deg,rgba(244,255,255,0.98),rgba(132,221,248,0.9))] p-2 shadow-[inset_0_1px_rgba(255,255,255,0.95),0_0.85rem_1.8rem_rgba(0,67,108,0.4)] backdrop-blur-xl"
            id="oxygenos-search-suggestions"
            onMouseDown={(event) => event.preventDefault()}
            role="listbox"
            style={{
              left: `${popupPosition.left}px`,
              bottom: `${popupPosition.bottom}px`,
              width: `${popupPosition.width}px`,
              maxWidth: "calc(100vw - 16px)",
            }}
          >
            {suggestions.length > 0 ? (
              <>
                <p className="px-2 pb-2 pt-1 text-[0.62rem] font-extrabold tracking-[0.1em] text-[#28779e]">
                  OXYGENOS SEARCH RESULTS
                </p>

                <div className="max-h-64 overflow-y-auto">
                  {suggestions.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeSuggestionIndex === index;

                    return (
                      <button
                        aria-selected={isActive}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                          isActive
                            ? "bg-white/75"
                            : "hover:bg-white/55"
                        }`}
                        key={`${item.action}-${item.id}`}
                        onClick={() => openSearchResult(item)}
                        role="option"
                        type="button"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/75 bg-sky-100/60 text-[#0b719d] shadow-[inset_0_1px_rgba(255,255,255,0.9)]">
                          <Icon size={16} strokeWidth={1.8} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-bold text-[#075a84]">
                            {item.name}
                          </span>

                          <span className="block truncate text-[0.63rem] text-[#28779e]">
                            {item.path ?? item.type}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="p-4 text-center">
                <p className="m-0 text-xs font-bold text-[#075a84]">
                  No matching files or folders
                </p>

                <p className="mt-1 text-[0.67rem] text-[#28779e]">
                  Try a different name or keyword.
                </p>
              </div>
            )}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div
        className="relative min-w-0 w-full"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        ref={wrapperRef}
      >
        <div className="flex h-10 items-center gap-2 rounded-xl border border-white/75 bg-white/34 px-3 shadow-[inset_0_1px_rgba(255,255,255,0.78),0_0.15rem_0.4rem_rgba(0,88,136,0.12)]">
          <Search
            aria-hidden="true"
            className="shrink-0 text-[#0b638f]"
            size={17}
            strokeWidth={2}
          />

          <input
            aria-autocomplete="list"
            aria-controls="oxygenos-search-suggestions"
            aria-expanded={hasSuggestions}
            aria-haspopup="listbox"
            aria-label="Search OxygenOS files and folders"
            className="min-w-0 flex-1 border-0 bg-transparent text-[0.76rem] font-semibold text-[#063f60] outline-none placeholder:text-[#28779e]/75"
            onBlur={() => {
              window.setTimeout(() => {
                setIsFocused(false);
                setActiveSuggestionIndex(-1);
              }, 200);
            }}
            onChange={(event) => {
              event.stopPropagation();
              setQuery(event.target.value);
              setActiveSuggestionIndex(-1);
            }}
            onClick={(event) => event.stopPropagation()}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            onPointerDown={(event) => event.stopPropagation()}
            placeholder="Search files & folders..."
            ref={inputRef}
            role="combobox"
            type="search"
            value={query}
          />

          {query && (
            <button
              aria-label="Clear search"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[#176d94] transition hover:bg-white/55"
              onClick={clearSearch}
              type="button"
            >
              <X size={15} strokeWidth={2.25} />
            </button>
          )}
        </div>
      </div>

      {suggestionsPopup}
    </>
  );
}

export default TaskbarSearch;