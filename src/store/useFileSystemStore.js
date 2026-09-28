import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createId,
  createInitialFileSystem,
  ensureTextExtension,
  FILE_SYSTEM_STORAGE_KEY,
  findNodeById,
  findParentById,
  hasNameConflict,
} from "../lib/fileSystem";

function getRecycleBin(fileSystem) {
  return findNodeById(fileSystem.root, "recycle-bin");
}

export const useFileSystemStore = create(
  persist(
    (set, get) => ({
      fileSystem: createInitialFileSystem(),
      currentFolderId: "my-files",
      terminalFolderId: "my-files",
      openFileId: null,
      lastError: "",

      setCurrentFolderId: (folderId) => {
        const folder = findNodeById(get().fileSystem.root, folderId);

        if (!folder || folder.type !== "folder") {
          return;
        }

        set({
          currentFolderId: folderId,
          openFileId: null,
          lastError: "",
        });
      },

      setTerminalFolderId: (folderId) => {
  const folder = findNodeById(get().fileSystem.root, folderId);

  if (!folder || folder.type !== "folder") {
    return false;
  }

  set({
    terminalFolderId: folderId,
    lastError: "",
  });

  return true;
},

      openFile: (fileId) => {
        const file = findNodeById(get().fileSystem.root, fileId);

        if (!file || file.type !== "file") {
          return;
        }

        set({
          openFileId: fileId,
          lastError: "",
        });
      },

      closeFile: () =>
        set({
          openFileId: null,
          lastError: "",
        }),

      createFolder: (parentId, name) => {
        const trimmedName = name.trim();

        if (!trimmedName) {
          set({ lastError: "Please enter a folder name." });
          return false;
        }

        const fileSystem = structuredClone(get().fileSystem);
        const parent = findNodeById(fileSystem.root, parentId);

        if (!parent || parent.type !== "folder") {
          set({ lastError: "That location is not a folder." });
          return false;
        }

        if (parent.id === "recycle-bin" || parent.isProtected && parent.id !== "my-files") {
  set({
    lastError:
      "You can only create files and folders inside My Files or a user-created folder.",
  });
  return false;
}

        if (hasNameConflict(parent, trimmedName)) {
          set({ lastError: "A file or folder with that name already exists." });
          return false;
        }

        const now = new Date().toISOString();

        parent.children.push({
          id: createId(),
          name: trimmedName,
          type: "folder",
          createdAt: now,
          updatedAt: now,
          isProtected: false,
          children: [],
        });

        parent.updatedAt = now;

        set({
          fileSystem,
          lastError: "",
        });

        return true;
      },

      createTextFile: (parentId, name) => {
        const fileName = ensureTextExtension(name);

        if (!fileName) {
          set({ lastError: "Please enter a file name." });
          return false;
        }

        const fileSystem = structuredClone(get().fileSystem);
        const parent = findNodeById(fileSystem.root, parentId);

        if (!parent || parent.type !== "folder") {
          set({ lastError: "That location is not a folder." });
          return false;
        }

        if (parent.id === "recycle-bin" || parent.isProtected) {
  set({
    lastError:
      "You can only create files and folders inside My Files or a user-created folder.",
  });
  return false;
}

        if (hasNameConflict(parent, fileName)) {
          set({ lastError: "A file or folder with that name already exists." });
          return false;
        }

        const now = new Date().toISOString();

        parent.children.push({
          id: createId(),
          name: fileName,
          type: "file",
          createdAt: now,
          updatedAt: now,
          isProtected: false,
          content: "",
        });

        parent.updatedAt = now;

        set({
          fileSystem,
          lastError: "",
        });

        return true;
      },

      saveFileContent: (fileId, content) => {
        const fileSystem = structuredClone(get().fileSystem);
        const file = findNodeById(fileSystem.root, fileId);

        if (!file || file.type !== "file") {
          set({ lastError: "This file no longer exists." });
          return false;
        }

        file.content = content;
        file.updatedAt = new Date().toISOString();

        set({
          fileSystem,
          lastError: "",
        });

        return true;
      },

      renameNode: (nodeId, nextName) => {
        const trimmedName = nextName.trim();

        if (!trimmedName) {
          set({ lastError: "A name cannot be empty." });
          return false;
        }

        const fileSystem = structuredClone(get().fileSystem);
        const node = findNodeById(fileSystem.root, nodeId);
        const parent = findParentById(fileSystem.root, nodeId);

        if (!node || !parent) {
          set({ lastError: "This item no longer exists." });
          return false;
        }

        if (node.isProtected) {
          set({ lastError: "This OxygenOS item cannot be renamed." });
          return false;
        }

        const finalName =
          node.type === "file" ? ensureTextExtension(trimmedName) : trimmedName;

        if (hasNameConflict(parent, finalName, nodeId)) {
          set({ lastError: "A file or folder with that name already exists." });
          return false;
        }

        node.name = finalName;
        node.updatedAt = new Date().toISOString();
        parent.updatedAt = node.updatedAt;

        set({
          fileSystem,
          lastError: "",
        });

        return true;
      },

      moveToRecycleBin: (nodeId) => {
        const fileSystem = structuredClone(get().fileSystem);
        const node = findNodeById(fileSystem.root, nodeId);
        const parent = findParentById(fileSystem.root, nodeId);
        const recycleBin = getRecycleBin(fileSystem);

        if (!node || !parent || !recycleBin) {
          set({ lastError: "This item could not be deleted." });
          return false;
        }

        if (node.isProtected || node.id === "recycle-bin") {
          set({ lastError: "This protected OxygenOS item cannot be deleted." });
          return false;
        }

        const nodeIndex = parent.children.findIndex((child) => child.id === nodeId);

        if (nodeIndex === -1) {
          set({ lastError: "This item could not be deleted." });
          return false;
        }

        const [removedNode] = parent.children.splice(nodeIndex, 1);
        const now = new Date().toISOString();

        removedNode.deletedAt = now;
        removedNode.originalParentId = parent.id;
        recycleBin.children.push(removedNode);

        parent.updatedAt = now;
        recycleBin.updatedAt = now;

        const currentFolderId =
          get().currentFolderId === nodeId ? "my-files" : get().currentFolderId;

        set({
          fileSystem,
          currentFolderId,
          openFileId: get().openFileId === nodeId ? null : get().openFileId,
          lastError: "",
        });

        return true;
      },

      restoreFromRecycleBin: (nodeId) => {
        const fileSystem = structuredClone(get().fileSystem);
        const recycleBin = getRecycleBin(fileSystem);

        if (!recycleBin) {
          set({ lastError: "Recycle Bin is unavailable." });
          return false;
        }

        const itemIndex = recycleBin.children.findIndex(
          (child) => child.id === nodeId
        );

        if (itemIndex === -1) {
          set({ lastError: "This deleted item no longer exists." });
          return false;
        }

        const item = recycleBin.children[itemIndex];
        const destination =
          findNodeById(fileSystem.root, item.originalParentId) ??
          findNodeById(fileSystem.root, "my-files");

        if (!destination || destination.type !== "folder") {
          set({ lastError: "The original location is unavailable." });
          return false;
        }

        if (hasNameConflict(destination, item.name)) {
          set({
            lastError:
              "Restore failed because an item with the same name already exists.",
          });
          return false;
        }

        recycleBin.children.splice(itemIndex, 1);

        delete item.deletedAt;
        delete item.originalParentId;

        item.updatedAt = new Date().toISOString();
        destination.children.push(item);
        recycleBin.updatedAt = item.updatedAt;
        destination.updatedAt = item.updatedAt;

        set({
          fileSystem,
          lastError: "",
        });

        return true;
      },

      permanentlyDelete: (nodeId) => {
        const fileSystem = structuredClone(get().fileSystem);
        const recycleBin = getRecycleBin(fileSystem);

        if (!recycleBin) {
          set({ lastError: "Recycle Bin is unavailable." });
          return false;
        }

        const itemIndex = recycleBin.children.findIndex(
          (child) => child.id === nodeId
        );

        if (itemIndex === -1) {
          set({
            lastError:
              "Only items inside the Recycle Bin can be permanently deleted.",
          });
          return false;
        }

        recycleBin.children.splice(itemIndex, 1);
        recycleBin.updatedAt = new Date().toISOString();

        set({
          fileSystem,
          lastError: "",
        });

        return true;
      },

      emptyRecycleBin: () => {
        const fileSystem = structuredClone(get().fileSystem);
        const recycleBin = getRecycleBin(fileSystem);

        if (!recycleBin) {
          return;
        }

        recycleBin.children = [];
        recycleBin.updatedAt = new Date().toISOString();

        set({
          fileSystem,
          lastError: "",
        });
      },

      clearLastError: () => set({ lastError: "" }),

      resetWorkspace: () =>
      set({
      fileSystem: createInitialFileSystem(),
      currentFolderId: "my-files",
      terminalFolderId: "my-files",
      openFileId: null,
      lastError: "",
      }),
    }),
    
    {
      name: FILE_SYSTEM_STORAGE_KEY,
      partialize: (state) => ({
  fileSystem: state.fileSystem,
  currentFolderId: state.currentFolderId,
  terminalFolderId: state.terminalFolderId,
}),
    }
  )
);