import { FileText, FolderPlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function CreateDesktopItemDialog({
  type,
  onCancel,
  onCreate,
  errorMessage = "",
}) {
  const inputRef = useRef(null);
  const [name, setName] = useState("");

  const isFolder = type === "folder";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const wasCreated = onCreate(name);

    if (wasCreated) {
      setName("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[600] grid place-items-center bg-[#02344d]/35 p-4 backdrop-blur-sm"
      onMouseDown={onCancel}
      role="presentation"
    >
      <section
        aria-labelledby="create-item-title"
        className="oxygen-glass w-full max-w-md p-5"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.76),rgba(78,202,239,0.6))] text-[#0878ad] shadow-[inset_0_1px_rgba(255,255,255,0.95)]">
              {isFolder ? (
                <FolderPlus size={23} strokeWidth={1.55} />
              ) : (
                <FileText size={23} strokeWidth={1.55} />
              )}
            </span>

            <div>
              <p className="oxygen-label mb-1">My Files workspace</p>
              <h2
                className="m-0 text-lg font-bold text-[#075a84]"
                id="create-item-title"
              >
                {isFolder ? "Create New Folder" : "Create Text Document"}
              </h2>
            </div>
          </div>

          <button
            aria-label="Close dialog"
            className="oxygen-icon-button"
            onClick={onCancel}
            type="button"
          >
            <X size={14} />
          </button>
        </header>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              className="oxygen-label mb-2 block"
              htmlFor="desktop-item-name"
            >
              {isFolder ? "Folder name" : "File name"}
            </label>

            <input
              className="oxygen-input"
              id="desktop-item-name"
              onChange={(event) => setName(event.target.value)}
              placeholder={isFolder ? "New Folder" : "New Text Document.txt"}
              ref={inputRef}
              type="text"
              value={name}
            />

            {!isFolder && (
              <p className="mt-2 text-[0.67rem] text-[#28779e]">
                OxygenOS adds <code>.txt</code> automatically if needed.
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="rounded-xl border border-[#d95765]/35 bg-[#fff1f2]/75 px-3 py-2 text-xs font-bold text-[#ad3445]">
              {errorMessage}
            </p>
          )}

          <footer className="flex justify-end gap-2">
            <button
              className="oxygen-button"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>

            <button className="oxygen-button" type="submit">
              Create
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default CreateDesktopItemDialog;