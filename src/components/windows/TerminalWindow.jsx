import { useEffect, useMemo, useRef, useState } from "react";
import {
  findChildByName,
  findNodeById,
  findParentById,
  getPathLabel,
} from "../../lib/fileSystem";
import { useFileSystemStore } from "../../store/useFileSystemStore";
import { useWindowStore } from "../../store/useWindowStore";

const INITIAL_OUTPUT = [
  {
    type: "system",
    text: "OXYGENOS TERMINAL v1.0",
  },
  {
    type: "system",
    text: 'Type "help" for available commands or "cd ins" for instructions.',
  },
];

function TerminalWindow() {
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  const fileSystem = useFileSystemStore((state) => state.fileSystem);
  const terminalFolderId = useFileSystemStore(
    (state) => state.terminalFolderId
  );

 const setTerminalFolderId = useFileSystemStore(
  (state) => state.setTerminalFolderId
);
const createFolder = useFileSystemStore((state) => state.createFolder);
const createTextFile = useFileSystemStore((state) => state.createTextFile);
const moveToRecycleBin = useFileSystemStore(
  (state) => state.moveToRecycleBin
);
const permanentlyDelete = useFileSystemStore(
  (state) => state.permanentlyDelete
);
const clearLastError = useFileSystemStore((state) => state.clearLastError);

  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);

  const [command, setCommand] = useState("");
  const [output, setOutput] = useState(INITIAL_OUTPUT);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const currentFolder = useMemo(
    () => findNodeById(fileSystem.root, terminalFolderId),
    [fileSystem, terminalFolderId]
  );

  const currentPath = useMemo(
    () => getPathLabel(fileSystem.root, terminalFolderId),
    [fileSystem, terminalFolderId]
  );

  const canCreateItems =
    currentFolder?.type === "folder" &&
    currentFolder.id !== "recycle-bin" &&
    (!currentFolder.isProtected || currentFolder.id === "my-files");

    useEffect(() => {
  setTerminalFolderId("my-files");
}, []);

  useEffect(() => {
    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(focusTimer);
  }, []);

  useEffect(() => {
    outputRef.current?.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [output]);

  const appendOutput = (entries) => {
    const formattedEntries = Array.isArray(entries) ? entries : [entries];

    setOutput((currentOutput) => [...currentOutput, ...formattedEntries]);
  };

  const writeLine = (text, type = "response") => {
    appendOutput({ text, type });
  };

  const printFolderContents = (folder) => {
    const children = [...(folder.children ?? [])].sort(
      (firstItem, secondItem) => {
        if (firstItem.type !== secondItem.type) {
          return firstItem.type === "folder" ? -1 : 1;
        }

        return firstItem.name.localeCompare(secondItem.name);
      }
    );

    if (!children.length) {
      writeLine("This folder is empty.", "muted");
      return;
    }

    appendOutput(
      children.map((child) => ({
        text: `${child.type === "folder" ? "[DIR]" : "[TXT]"} ${child.name}`,
        type: child.type === "folder" ? "folder" : "file",
      }))
    );
  };

  const printHelp = () => {
    appendOutput([
      { text: "AVAILABLE COMMANDS", type: "title" },
      { text: "help                 Show all commands", type: "response" },
      {
        text: "cd ins               Show OxygenOS terminal instructions",
        type: "response",
      },
      { text: "cd my-files          Open My Files workspace", type: "response" },
      { text: "cd bin               Open Recycle Bin", type: "response" },
      { text: "cd <folder>          Enter a folder", type: "response" },
      { text: "cd ..                Go back one folder", type: "response" },
      { text: "ls                   List current folder contents", type: "response" },
      {
        text: "mkdir <name>         Create a folder in My Files",
        type: "response",
      },
      {
  text: "touch <name>         Create a text file in My Files",
  type: "response",
},
{
  text: "remove <name>        Move a visitor file/folder to Recycle Bin",
  type: "response",
},
{
  text: "rm <name>            Alias for remove",
  type: "response",
},
{
  text: "del <name>           Alias for remove",
  type: "response",
},
{
  text: "delete <name>        Alias for remove",
  type: "response",
},
{ text: "clear                Clear terminal output", type: "response" },
      { text: "exit                 Minimize Terminal", type: "response" },
    ]);
  };

  const printInstructions = () => {
    appendOutput([
      { text: "OXYGENOS TERMINAL INSTRUCTIONS", type: "title" },
      {
        text: "This terminal controls your browser-local My Files workspace.",
        type: "response",
      },
      {
        text: "You may create folders and .txt files only inside My Files or a folder you created.",
        type: "response",
      },
      {
        text: "About Me, Projects, Terminal, Contact Me, and Recycle Bin are protected system folders.",
        type: "response",
      },
      {
        text: 'Use "ls" to inspect a folder and "cd <folder>" to enter it.',
        type: "response",
      },
      {
        text: 'Use "mkdir Ideas" to create a folder.',
        type: "response",
      },
      {
        text: 'Use "touch notes" to create notes.txt.',
        type: "response",
      },
      {
  text: 'Use "cd bin" to view deleted visitor files and folders.',
  type: "response",
},
{
  text: 'Use "remove <name>" outside Bin to move your own item to Recycle Bin.',
  type: "response",
},
{
  text: 'Inside Bin, "remove <name>" permanently deletes that item after confirmation.',
  type: "response",
},
{
  text: "Protected OxygenOS folders cannot be removed.",
  type: "response",
},
    ]);
  };

  const executeCommand = (rawCommand) => {
    const trimmedCommand = rawCommand.trim();

    if (!trimmedCommand) {
      return;
    }

    const [commandName, ...argumentParts] = trimmedCommand.split(/\s+/);
    const normalizedCommand = commandName.toLowerCase();
    const argument = argumentParts.join(" ").trim();

    appendOutput({
      text: `${currentPath} > ${trimmedCommand}`,
      type: "command",
    });

    if (normalizedCommand === "clear") {
      setOutput([]);
      return;
    }

    if (normalizedCommand === "help") {
      printHelp();
      return;
    }

    if (normalizedCommand === "ls") {
      if (!currentFolder) {
        writeLine("Current folder is unavailable. Returning to My Files.", "error");
        setTerminalFolderId("my-files");
        return;
      }

      printFolderContents(currentFolder);
      return;
    }

    if (normalizedCommand === "cd") {
      if (!argument) {
        writeLine(
          'Usage: cd <folder>, cd .., cd my-files, cd bin, or cd ins',
          "error"
        );
        return;
      }

      const normalizedArgument = argument.toLowerCase();

      if (normalizedArgument === "ins") {
        printInstructions();
        return;
      }

      if (
        normalizedArgument === "my-files" ||
        normalizedArgument === "myfiles"
      ) {
        setTerminalFolderId("my-files");
        writeLine("Opened My Files.", "success");
        return;
      }

      if (
        normalizedArgument === "bin" ||
        normalizedArgument === "recycle-bin" ||
        normalizedArgument === "recyclebin"
      ) {
        setTerminalFolderId("recycle-bin");
        writeLine("Opened Recycle Bin.", "success");

        const recycleBin = findNodeById(fileSystem.root, "recycle-bin");

        if (recycleBin) {
          printFolderContents(recycleBin);
        }

        return;
      }

      if (normalizedArgument === "..") {
  // Recycle Bin behaves like a special terminal location.
  // Going back from it returns to My Files.
  if (terminalFolderId === "recycle-bin") {
    setTerminalFolderId("my-files");
    writeLine("Returned to My Files.", "success");
    return;
  }

  const parentFolder = findParentById(
    fileSystem.root,
    terminalFolderId
  );

  // My Files is the terminal root.
  if (
    terminalFolderId === "my-files" ||
    !parentFolder ||
    parentFolder.id === "root"
  ) {
    writeLine("You are already at the My Files root.", "muted");
    return;
  }

  setTerminalFolderId(parentFolder.id);
  writeLine(`Opened ${parentFolder.name}.`, "success");
  return;
}

      if (!currentFolder || currentFolder.type !== "folder") {
        writeLine("Current location is invalid. Returning to My Files.", "error");
        setTerminalFolderId("my-files");
        return;
      }

      const child = findChildByName(currentFolder, argument);

      if (!child) {
        writeLine(`Folder not found: ${argument}`, "error");
        return;
      }

      if (child.type !== "folder") {
        writeLine(
          `Invalid operation: "${child.name}" is a text file. Use the file editor to open it.`,
          "error"
        );
        return;
      }

      setTerminalFolderId(child.id);
      writeLine(`Opened ${child.name}.`, "success");
      return;
    }

    if (normalizedCommand === "mkdir") {
      if (!argument) {
        writeLine("Usage: mkdir <folder-name>", "error");
        return;
      }

      if (!canCreateItems) {
        writeLine(
          "Permission denied: create folders only in My Files or visitor-created folders.",
          "error"
        );
        return;
      }

      clearLastError();

      const wasCreated = createFolder(terminalFolderId, argument);

      if (wasCreated) {
        writeLine(`Folder created: ${argument}`, "success");
      } else {
        writeLine(
          "Folder could not be created. Check its name or try another location.",
          "error"
        );
      }

      return;
    }

    if (normalizedCommand === "touch") {
      if (!argument) {
        writeLine("Usage: touch <file-name>", "error");
        return;
      }

      if (!canCreateItems) {
        writeLine(
          "Permission denied: create files only in My Files or visitor-created folders.",
          "error"
        );
        return;
      }

      clearLastError();

      const wasCreated = createTextFile(terminalFolderId, argument);

      if (wasCreated) {
        const finalFileName = argument.toLowerCase().endsWith(".txt")
          ? argument
          : `${argument}.txt`;

        writeLine(`Text file created: ${finalFileName}`, "success");
      } else {
        writeLine(
          "Text file could not be created. Check its name or try another location.",
          "error"
        );
      }

      return;
    }

    if (normalizedCommand === "exit") {
      writeLine("Terminal minimized. Your workspace remains active.", "muted");
      minimizeWindow("terminal");
      return;
    }

    if (
  normalizedCommand === "remove" ||
  normalizedCommand === "rm" ||
  normalizedCommand === "del" ||
  normalizedCommand === "delete"
) {
  if (!argument) {
    writeLine("Usage: remove <file-or-folder-name>", "error");
    return;
  }

  if (!currentFolder || currentFolder.type !== "folder") {
    writeLine(
      "Current location is invalid. Returning to My Files.",
      "error"
    );
    setTerminalFolderId("my-files");
    return;
  }

  const targetNode = findChildByName(currentFolder, argument);

  if (!targetNode) {
    writeLine(`Item not found: ${argument}`, "error");
    return;
  }

  if (targetNode.isProtected || targetNode.id === "recycle-bin") {
    writeLine(
      `Permission denied: "${targetNode.name}" is a protected OxygenOS item.`,
      "error"
    );
    return;
  }

  clearLastError();

  if (currentFolder.id === "recycle-bin") {
    const confirmed = window.confirm(
      `Permanently delete "${targetNode.name}"?\n\nThis cannot be undone.`
    );

    if (!confirmed) {
      writeLine("Permanent deletion cancelled.", "muted");
      return;
    }

    const wasDeleted = permanentlyDelete(targetNode.id);

    if (wasDeleted) {
      writeLine(
        `Permanently deleted from Recycle Bin: ${targetNode.name}`,
        "success"
      );
    } else {
      writeLine(
        `Could not permanently delete "${targetNode.name}".`,
        "error"
      );
    }

    return;
  }

  const wasMovedToBin = moveToRecycleBin(targetNode.id);

  if (wasMovedToBin) {
    writeLine(
      `Moved to Recycle Bin: ${targetNode.name}`,
      "success"
    );
  } else {
    writeLine(
      `Could not move "${targetNode.name}" to Recycle Bin.`,
      "error"
    );
  }

  return;
}

    writeLine(
      `Unknown command: "${commandName}". Type "help" for available commands.`,
      "error"
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const submittedCommand = command.trim();

    if (!submittedCommand) {
      return;
    }

    setHistory((currentHistory) => [
      ...currentHistory,
      submittedCommand,
    ]);
    setHistoryIndex(-1);

    executeCommand(submittedCommand);
    setCommand("");
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!history.length) {
        return;
      }

      const nextIndex =
        historyIndex <= 0 ? history.length - 1 : historyIndex - 1;

      setHistoryIndex(nextIndex);
      setCommand(history[nextIndex]);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!history.length) {
        return;
      }

      if (historyIndex === -1) {
        return;
      }

      const nextIndex =
        historyIndex >= history.length - 1 ? -1 : historyIndex + 1;

      setHistoryIndex(nextIndex);
      setCommand(nextIndex === -1 ? "" : history[nextIndex]);
    }

    if (event.key === "Escape") {
      setCommand("");
      setHistoryIndex(-1);
    }
  };

  return (
    <div
      className="flex h-full min-h-0 flex-col gap-3 text-[#075a84]"
      onClick={() => inputRef.current?.focus()}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="oxygen-label mb-1">OxygenOS command console</p>
          <h2 className="m-0 text-xl font-bold text-[#075a84]">
            Terminal
          </h2>
          <p className="mt-2 text-xs leading-5 text-[#28779e]">
            Browser-local file commands for My Files and Recycle Bin.
          </p>
        </div>

        <div className="rounded-full border border-white/75 bg-white/38 px-3 py-2 text-[0.65rem] font-bold text-[#14739a]">
          PATH: {currentPath}
        </div>
      </header>

      <section className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-[#05506f]/70 bg-[#042f43]/95 shadow-[inset_0_1px_rgba(190,250,255,0.14),inset_0_0_2rem_rgba(0,0,0,0.34)]">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(to_bottom,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_4px)]" />

        <div
          className="relative h-full max-h-[25rem] overflow-y-auto p-4 font-mono text-xs leading-6"
          ref={outputRef}
        >
          {output.map((entry, index) => (
            <p
              className={`m-0 whitespace-pre-wrap ${
                entry.type === "command"
                  ? "text-cyan-100"
                  : entry.type === "error"
                    ? "text-red-300"
                    : entry.type === "success"
                      ? "text-lime-300"
                      : entry.type === "folder"
                        ? "text-sky-300"
                        : entry.type === "file"
                          ? "text-cyan-200"
                          : entry.type === "title"
                            ? "mt-2 font-bold tracking-[0.08em] text-white"
                            : entry.type === "muted"
                              ? "text-cyan-100/55"
                              : "text-cyan-100/80"
              }`}
              key={`${entry.text}-${index}`}
            >
              {entry.text}
            </p>
          ))}

          <form className="mt-2 flex items-center gap-2" onSubmit={handleSubmit}>
            <span className="shrink-0 font-bold text-lime-300">
              {currentPath} &gt;
            </span>

            <input
              aria-label="Terminal command"
              className="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-xs text-white outline-none placeholder:text-cyan-100/35"
              onChange={(event) => setCommand(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder='Type "help"'
              ref={inputRef}
              spellCheck="false"
              type="text"
              value={command}
            />
          </form>
        </div>
      </section>

      <footer className="flex flex-wrap justify-between gap-2 text-[0.65rem] font-semibold text-[#28779e]">
        <span>ENTER: RUN COMMAND</span>
        <span>↑ ↓: HISTORY</span>
        <span>ESC: CLEAR INPUT</span>
      </footer>
    </div>
  );
}

export default TerminalWindow;  