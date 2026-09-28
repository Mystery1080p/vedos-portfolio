import {
  ChevronLeft,
  FilePenLine,
  FileText,
  FolderOpen,
  FolderPlus,
  Pencil,
  Recycle,
  RefreshCcw,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  findNodeById,
  findParentById,
  formatFileDate,
} from "../../lib/fileSystem";
import { useFileSystemStore } from "../../store/useFileSystemStore";

function FileExplorerWindow() {
  const fileSystem = useFileSystemStore((state) => state.fileSystem);
  const currentFolderId = useFileSystemStore((state) => state.currentFolderId);
  const openFileId = useFileSystemStore((state) => state.openFileId);
  const lastError = useFileSystemStore((state) => state.lastError);

  const setCurrentFolderId = useFileSystemStore(
    (state) => state.setCurrentFolderId
  );
  const openFile = useFileSystemStore((state) => state.openFile);
  const closeFile = useFileSystemStore((state) => state.closeFile);
  const createFolder = useFileSystemStore((state) => state.createFolder);
  const createTextFile = useFileSystemStore((state) => state.createTextFile);
  const saveFileContent = useFileSystemStore((state) => state.saveFileContent);
  const renameNode = useFileSystemStore((state) => state.renameNode);
  const moveToRecycleBin = useFileSystemStore(
    (state) => state.moveToRecycleBin
  );
  const restoreFromRecycleBin = useFileSystemStore(
    (state) => state.restoreFromRecycleBin
  );
  const permanentlyDelete = useFileSystemStore(
    (state) => state.permanentlyDelete
  );
  const emptyRecycleBin = useFileSystemStore((state) => state.emptyRecycleBin);
  const resetWorkspace = useFileSystemStore((state) => state.resetWorkspace);
  const clearLastError = useFileSystemStore((state) => state.clearLastError);

  const [newFolderName, setNewFolderName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [renamingNodeId, setRenamingNodeId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const currentFolder = findNodeById(fileSystem.root, currentFolderId);
  const openFileNode = openFileId
    ? findNodeById(fileSystem.root, openFileId)
    : null;

  const isRecycleBin = currentFolder?.id === "recycle-bin";
  const isProtectedFolder = Boolean(currentFolder?.isProtected);
  
const canCreateItems =
  currentFolder?.type === "folder" &&
  !isRecycleBin &&
  (!isProtectedFolder || currentFolder?.id === "my-files");

  const parentFolder = currentFolder
    ? findParentById(fileSystem.root, currentFolder.id)
    : null;

  const sortedChildren = useMemo(() => {
    if (!currentFolder?.children) {
      return [];
    }

    return [...currentFolder.children].sort((firstItem, secondItem) => {
      if (firstItem.type !== secondItem.type) {
        return firstItem.type === "folder" ? -1 : 1;
      }

      return firstItem.name.localeCompare(secondItem.name);
    });
  }, [currentFolder]);

  const handleCreateFolder = () => {
    if (createFolder(currentFolderId, newFolderName)) {
      setNewFolderName("");
    }
  };

  const handleCreateFile = () => {
    if (createTextFile(currentFolderId, newFileName)) {
      setNewFileName("");
    }
  };

  const handleOpenFile = (file) => {
    openFile(file.id);
    setDraftContent(file.content ?? "");
  };

  const handleSaveFile = () => {
    if (!openFileNode) {
      return;
    }

    saveFileContent(openFileNode.id, draftContent);
  };

  const handleStartRename = (node) => {
    setRenamingNodeId(node.id);
    setRenameValue(node.name);
    clearLastError();
  };

  const handleRename = (nodeId) => {
    if (renameNode(nodeId, renameValue)) {
      setRenamingNodeId(null);
      setRenameValue("");
    }
  };

  const handleDelete = (node) => {
    if (node.isProtected) {
      return;
    }

    const allowed = window.confirm(
      `Move "${node.name}" to the OxygenOS Recycle Bin?`
    );

    if (!allowed) {
      return;
    }

    moveToRecycleBin(node.id);
  };

  const handleRestore = (node) => {
    restoreFromRecycleBin(node.id);
  };

  const handlePermanentDelete = (node) => {
    const allowed = window.confirm(
      `Permanently delete "${node.name}"? This cannot be undone.`
    );

    if (!allowed) {
      return;
    }

    permanentlyDelete(node.id);
  };

  const handleEmptyRecycleBin = () => {
    if (!currentFolder?.children?.length) {
      return;
    }

    const allowed = window.confirm(
      "Permanently delete everything in the Recycle Bin? This cannot be undone."
    );

    if (!allowed) {
      return;
    }

    emptyRecycleBin();
  };

  const handleResetWorkspace = () => {
    const allowed = window.confirm(
      "Reset My Files? This permanently removes all visitor-created files and folders, including items in the Recycle Bin."
    );

    if (!allowed) {
      return;
    }

    resetWorkspace();
  };

  if (!currentFolder) {
    return (
      <div className="oxygen-glass-deep p-4 text-sm text-[#a23545]">
        File system unavailable. Refresh OxygenOS to recover your workspace.
      </div>
    );
  }

  if (openFileNode) {
    return (
      <div className="flex min-h-full flex-col gap-4 text-[#075a84]">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="oxygen-label mb-1">OxygenOS Notepad</p>
            <h2 className="m-0 flex items-center gap-2 text-xl font-bold">
              <FileText size={22} />
              {openFileNode.name}
            </h2>
            <p className="mt-2 text-xs text-[#28779e]">
              Last modified: {formatFileDate(openFileNode.updatedAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="oxygen-button flex items-center gap-2"
              onClick={handleSaveFile}
              type="button"
            >
              <Save size={15} />
              Save
            </button>

            <button
              className="oxygen-button flex items-center gap-2"
              onClick={closeFile}
              type="button"
            >
              <X size={15} />
              Close editor
            </button>
          </div>
        </header>

        {lastError && (
          <p className="rounded-xl border border-[#d95765]/40 bg-[#fff0f1]/80 px-3 py-2 text-xs font-bold text-[#ae3444]">
            {lastError}
          </p>
        )}

        <textarea
          aria-label={`Editing ${openFileNode.name}`}
          className="oxygen-input min-h-72 flex-1 resize-none font-mono text-sm leading-6"
          onChange={(event) => setDraftContent(event.target.value)}
          spellCheck="false"
          value={draftContent}
        />

        <footer className="flex flex-wrap justify-between gap-2 text-[0.68rem] font-semibold text-[#28779e]">
          <span>TEXT FILE — BROWSER LOCAL STORAGE</span>
          <span>{draftContent.length} characters</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col gap-4 text-[#075a84]">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="oxygen-label mb-1">OxygenOS File Explorer</p>
          <h2 className="m-0 flex items-center gap-2 text-xl font-bold">
            {isRecycleBin ? <Recycle size={23} /> : <FolderOpen size={23} />}
            {currentFolder.name}
          </h2>
          <p className="mt-2 text-xs text-[#28779e]">
            {isRecycleBin
              ? "Deleted visitor files and folders are kept here until removed permanently."
              : "Your personal browser-local workspace. Files are saved on this device only."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {parentFolder && currentFolder.id !== "root" && (
            <button
              className="oxygen-button flex items-center gap-2"
              onClick={() => setCurrentFolderId(parentFolder.id)}
              type="button"
            >
              <ChevronLeft size={15} />
              Back
            </button>
          )}

          {isRecycleBin ? (
            <button
              className="oxygen-button oxygen-button-danger flex items-center gap-2"
              onClick={handleEmptyRecycleBin}
              type="button"
            >
              <Trash2 size={15} />
              Empty Bin
            </button>
          ) : (
            <button
              className="oxygen-button flex items-center gap-2"
              onClick={handleResetWorkspace}
              type="button"
            >
              <RefreshCcw size={15} />
              Reset My Files
            </button>
          )}
        </div>
      </header>

      {lastError && (
        <p className="rounded-xl border border-[#d95765]/40 bg-[#fff0f1]/80 px-3 py-2 text-xs font-bold text-[#ae3444]">
          {lastError}
        </p>
      )}

      {canCreateItems && (
        <section className="grid gap-3 sm:grid-cols-2">
          <div className="oxygen-glass-deep p-3">
            <p className="oxygen-label mb-2">New folder</p>

            <div className="flex gap-2">
              <input
                className="oxygen-input min-w-0 flex-1 text-sm"
                onChange={(event) => setNewFolderName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleCreateFolder();
                  }
                }}
                placeholder="Folder name"
                value={newFolderName}
              />

              <button
                aria-label="Create folder"
                className="oxygen-button grid w-10 place-items-center p-0"
                onClick={handleCreateFolder}
                type="button"
              >
                <FolderPlus size={17} />
              </button>
            </div>
          </div>

          <div className="oxygen-glass-deep p-3">
            <p className="oxygen-label mb-2">New text file</p>

            <div className="flex gap-2">
              <input
                className="oxygen-input min-w-0 flex-1 text-sm"
                onChange={(event) => setNewFileName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleCreateFile();
                  }
                }}
                placeholder="notes.txt"
                value={newFileName}
              />

              <button
                aria-label="Create text file"
                className="oxygen-button grid w-10 place-items-center p-0"
                onClick={handleCreateFile}
                type="button"
              >
                <FilePenLine size={17} />
              </button>
            </div>
          </div>
        </section>
      )}

      {!canCreateItems && !isRecycleBin && (
  <section className="rounded-xl border border-white/70 bg-white/30 p-3 text-xs font-semibold text-[#28779e]">
    This is a protected OxygenOS portfolio folder. You can browse its contents,
    but creating, renaming, and deleting items is disabled.
  </section>
)}

      <section className="oxygen-glass-deep min-h-64 flex-1 p-3">
        {sortedChildren.length === 0 ? (
          <div className="grid min-h-52 place-items-center text-center">
            <div>
              <Recycle
                className="mx-auto mb-3 text-[#63bbd9]/70"
                size={42}
                strokeWidth={1.25}
              />
              <p className="m-0 text-sm font-bold text-[#28779e]">
                {isRecycleBin ? "Recycle Bin is empty." : "This folder is empty."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {sortedChildren.map((node) => {
              const isFolder = node.type === "folder";

              return (
                <article
                  className="flex items-center gap-3 rounded-xl border border-white/65 bg-white/26 p-3 shadow-[inset_0_1px_rgba(255,255,255,0.7)] transition hover:bg-white/44"
                  key={node.id}
                >
                  <button
                    aria-label={`Open ${node.name}`}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/75 bg-[linear-gradient(145deg,rgba(255,255,255,0.68),rgba(109,215,245,0.52))] text-[#0a78aa]"
                    onClick={() => {
                      if (isRecycleBin) {
                        return;
                      }

                      if (isFolder) {
                        setCurrentFolderId(node.id);
                      } else {
                        handleOpenFile(node);
                      }
                    }}
                    type="button"
                  >
                    {isFolder ? (
                      <FolderOpen size={23} />
                    ) : (
                      <FileText size={22} />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    {renamingNodeId === node.id ? (
                      <input
                        autoFocus
                        className="oxygen-input py-1 text-sm"
                        onChange={(event) => setRenameValue(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleRename(node.id);
                          }

                          if (event.key === "Escape") {
                            setRenamingNodeId(null);
                            setRenameValue("");
                          }
                        }}
                        value={renameValue}
                      />
                    ) : (
                      <button
                        className="block max-w-full truncate text-left text-sm font-bold text-[#075a84]"
                        onClick={() => {
                          if (isRecycleBin) {
                            return;
                          }

                          if (isFolder) {
                            setCurrentFolderId(node.id);
                          } else {
                            handleOpenFile(node);
                          }
                        }}
                        type="button"
                      >
                        {node.name}
                      </button>
                    )}

                    <p className="mt-1 text-[0.65rem] text-[#28779e]">
                      {isFolder ? "Folder" : "Text file"} ·{" "}
                      {isRecycleBin
                        ? `Deleted ${formatFileDate(node.deletedAt)}`
                        : `Updated ${formatFileDate(node.updatedAt)}`}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    {isRecycleBin ? (
                      <>
                        <button
                          aria-label={`Restore ${node.name}`}
                          className="oxygen-icon-button"
                          onClick={() => handleRestore(node)}
                          title="Restore"
                          type="button"
                        >
                          <RotateCcw size={13} />
                        </button>

                        <button
                          aria-label={`Permanently delete ${node.name}`}
                          className="oxygen-icon-button"
                          onClick={() => handlePermanentDelete(node)}
                          title="Delete permanently"
                          type="button"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    ) : (
                      <>
                        {!node.isProtected && (
                          <button
                            aria-label={`Rename ${node.name}`}
                            className="oxygen-icon-button"
                            onClick={() => handleStartRename(node)}
                            title="Rename"
                            type="button"
                          >
                            <Pencil size={13} />
                          </button>
                        )}

                        {!node.isProtected && (
                          <button
                            aria-label={`Delete ${node.name}`}
                            className="oxygen-icon-button"
                            onClick={() => handleDelete(node)}
                            title="Move to Recycle Bin"
                            type="button"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <footer className="flex flex-wrap justify-between gap-2 text-[0.66rem] font-semibold text-[#28779e]">
        <span>{sortedChildren.length} item(s)</span>
        <span>
          {isRecycleBin
            ? "RECYCLE BIN — LOCAL ONLY"
            : "MY FILES — LOCAL BROWSER STORAGE"}
        </span>
      </footer>
    </div>
  );
}

export default FileExplorerWindow;