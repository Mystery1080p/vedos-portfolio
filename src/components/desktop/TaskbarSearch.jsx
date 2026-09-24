import {
  FileText,
  Folder,
  Image,
  Music2,
  Palette,
  Search,
  Settings2,
  TerminalSquare,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { getDesktopApp } from "../../data/desktopApps";
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
    action: "open-window",
  },
  {
    id: "recycle-bin",
    name: "Recycle Bin",
    type: "System Folder",
    keywords: ["bin", "trash", "deleted", "delete", "restore"],
    icon: Image,
    action: "future-bin",
  },
  {
    id: "oxygen-settings",
    name: "OxygenOS Settings",
    type: "System Settings",
    keywords: ["settings", "font", "time", "date", "sound", "motion"],
    icon: Settings2,
    action: "future-settings",
  },
];

function normalizeSearchValue(value) {
  return value.trim().toLowerCase();
}

function TaskbarSearch() {
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const openWindow = useWindowStore((state) => state.openWindow);
  const closeStartMenu = useSystemStore((state) => state.closeStartMenu);

  const suggestions = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(query);

    if (!normalizedQuery) {
      return [];
    }

    return systemSearchItems
      .filter((item) => {
        const haystack = [
          item.name,
          item.type,
          ...item.keywords,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
      .slice(0, 7);
  }, [query]);

  const hasSuggestions = isFocused && query.trim().length > 0;

  const clearSearch = () => {
    setQuery("");
    setActiveSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const openSearchResult = (item) => {
    if (item.action === "open-window") {
      const app = getDesktopApp(item.id);

      if (app) {
        openWindow(item.id);
      }
    }

    if (item.action === "future-bin") {
      window.alert(
        "Recycle Bin search is ready. The Recycle Bin window will be added with the virtual file system."
      );
    }

    if (item.action === "future-settings") {
      openWindow("personalization");
    }

    closeStartMenu();
    setQuery("");
    setActiveSuggestionIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (event) => {
    if (!suggestions.length) {
      if (event.key === "Escape") {
        setQuery("");
        inputRef.current?.blur();
      }

      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveSuggestionIndex((currentIndex) =>
        currentIndex >= suggestions.length - 1 ? 0 : currentIndex + 1
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveSuggestionIndex((currentIndex) =>
        currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const selectedItem =
        suggestions[activeSuggestionIndex] ?? suggestions[0];

      openSearchResult(selectedItem);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setQuery("");
      setActiveSuggestionIndex(-1);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative min-w-0 w-full">
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
          aria-label="Search OxygenOS files and folders"
          className="min-w-0 flex-1 border-0 bg-transparent text-[0.76rem] font-semibold text-[#063f60] outline-none placeholder:text-[#28779e]/75"
          onBlur={() => {
            window.setTimeout(() => {
              setIsFocused(false);
              setActiveSuggestionIndex(-1);
            }, 150);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveSuggestionIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
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

      {hasSuggestions && (
        <div
          className="oxygen-search-suggestions absolute bottom-[calc(100%+0.55rem)] left-0 z-[300] w-full min-w-72 overflow-hidden rounded-2xl border border-white/85 bg-[linear-gradient(145deg,rgba(244,255,255,0.94),rgba(132,221,248,0.76))] p-2 shadow-[inset_0_1px_rgba(255,255,255,0.95),0_0.85rem_1.8rem_rgba(0,67,108,0.28)] backdrop-blur-xl"
          id="oxygenos-search-suggestions"
          role="listbox"
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
                          ? "bg-white/70"
                          : "hover:bg-white/52"
                      }`}
                      key={item.id}
                      onMouseDown={(event) => event.preventDefault()}
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
                          {item.type}
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
        </div>
      )}
    </div>
  );
}

export default TaskbarSearch;