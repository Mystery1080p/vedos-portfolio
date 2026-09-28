export const FILE_SYSTEM_STORAGE_KEY = "oxygenos-virtual-file-system";

export const PROTECTED_ROOT_IDS = [
  "about",
  "projects",
  "terminal",
  "contact",
  "my-files",
  "recycle-bin",
];

export const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export function createInitialFileSystem() {
  const now = new Date().toISOString();

  return {
    root: {
      id: "root",
      name: "OxygenOS",
      type: "folder",
      createdAt: now,
      updatedAt: now,
      isProtected: true,
      children: [
        {
          id: "about",
          name: "About Me",
          type: "folder",
          createdAt: now,
          updatedAt: now,
          isProtected: true,
          children: [],
        },
        {
          id: "projects",
          name: "Projects",
          type: "folder",
          createdAt: now,
          updatedAt: now,
          isProtected: true,
          children: [],
        },
        {
          id: "terminal",
          name: "Terminal",
          type: "folder",
          createdAt: now,
          updatedAt: now,
          isProtected: true,
          children: [],
        },
        {
          id: "contact",
          name: "Contact Me",
          type: "folder",
          createdAt: now,
          updatedAt: now,
          isProtected: true,
          children: [],
        },
        {
          id: "my-files",
          name: "My Files",
          type: "folder",
          createdAt: now,
          updatedAt: now,
          isProtected: true,
          children: [
            {
              id: "welcome-note",
              name: "welcome.txt",
              type: "file",
              createdAt: now,
              updatedAt: now,
              isProtected: false,
              content:
                "Welcome to My Files!\n\nCreate folders and text files here. Your workspace is saved locally in this browser.\n\nTip: Deleted files move to the OxygenOS Recycle Bin.",
            },
          ],
        },
        {
          id: "recycle-bin",
          name: "Recycle Bin",
          type: "folder",
          createdAt: now,
          updatedAt: now,
          isProtected: true,
          isRecycleBin: true,
          children: [],
        },
      ],
    },
  };
}

export function findNodeById(node, nodeId) {
  if (node.id === nodeId) {
    return node;
  }

  if (node.type !== "folder") {
    return null;
  }

  for (const child of node.children ?? []) {
    const foundNode = findNodeById(child, nodeId);

    if (foundNode) {
      return foundNode;
    }
  }

  return null;
}

export function findParentById(node, childId) {
  if (node.type !== "folder") {
    return null;
  }

  for (const child of node.children ?? []) {
    if (child.id === childId) {
      return node;
    }

    const foundParent = findParentById(child, childId);

    if (foundParent) {
      return foundParent;
    }
  }

  return null;
}

export function hasNameConflict(parentNode, name, excludedId = null) {
  const normalizedName = name.trim().toLowerCase();

  return (parentNode.children ?? []).some(
    (child) =>
      child.id !== excludedId &&
      child.name.trim().toLowerCase() === normalizedName
  );
}

export function ensureTextExtension(fileName) {
  const trimmedName = fileName.trim();

  if (!trimmedName) {
    return "";
  }

  return trimmedName.toLowerCase().endsWith(".txt")
    ? trimmedName
    : `${trimmedName}.txt`;
}

export function formatFileDate(dateString) {
  if (!dateString) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

export function getFolderPath(rootNode, folderId) {
  const path = [];

  function search(node, ancestors) {
    if (node.id === folderId) {
      path.push(...ancestors, node);
      return true;
    }

    if (node.type !== "folder") {
      return false;
    }

    return (node.children ?? []).some((child) =>
      search(child, [...ancestors, node])
    );
  }

  search(rootNode, []);

  return path;
}

export function getPathLabel(rootNode, folderId) {
  const path = getFolderPath(rootNode, folderId);

  if (!path.length) {
    return "OxygenOS";
  }

  return path
    .map((node) => {
      if (node.id === "root") {
        return "OxygenOS";
      }

      return node.name;
    })
    .join(" / ");
}

export function findChildByName(folderNode, name) {
  if (!folderNode || folderNode.type !== "folder") {
    return null;
  }

  const normalizedName = name.trim().toLowerCase();

  return (
    folderNode.children?.find(
      (child) => child.name.trim().toLowerCase() === normalizedName
    ) ?? null
  );
}