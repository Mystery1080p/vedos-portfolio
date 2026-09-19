import { useEffect, useState } from "react";
import CrtShell from "../components/effects/CrtShell";
import LoadingBar from "../components/ui/LoadingBar";
import {
  BOOT_COMPLETE_DELAY_MS,
  BOOT_DURATION_MS,
  PORTFOLIO_OWNER,
  SYSTEM_NAME,
  SYSTEM_VERSION,
} from "../lib/constants";

const bootMessages = [
  "Loading sky and water environment",
  "Preparing glass interface",
  "Connecting portfolio modules",
  "Refreshing desktop icons",
  "Starting OxygenOS workspace",
];

function BootScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const startedAt = Date.now();

    const intervalId = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(
        100,
        Math.round((elapsed / BOOT_DURATION_MS) * 100)
      );

      setProgress(nextProgress);

      if (nextProgress >= 100) {
        window.clearInterval(intervalId);
        setIsComplete(true);
      }
    }, 50);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isComplete) {
      return undefined;
    }

    const timeoutId = window.setTimeout(onComplete, BOOT_COMPLETE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isComplete, onComplete]);

  const visibleMessageCount = Math.max(
    1,
    Math.ceil((progress / 100) * bootMessages.length)
  );

  return (
    <CrtShell>
      <main className="oxygen-boot-in flex min-h-screen items-center justify-center p-4 sm:p-8">
        <section className="oxygen-glass oxygen-glass-shine w-full max-w-3xl p-5 sm:p-8">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/65 pb-4">
            <div>
              <p className="oxygen-label mb-1">Personal portfolio environment</p>
              <h1 className="m-0 text-3xl font-bold tracking-tight text-[#075f8d] sm:text-4xl">
                {SYSTEM_NAME}
              </h1>
            </div>

            <div className="rounded-full border border-white/70 bg-white/35 px-3 py-1 text-xs font-bold text-[#13759b]">
              VERSION {SYSTEM_VERSION}
            </div>
          </header>

          <div className="mt-7 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-sm font-semibold text-[#0b618d]">
                Welcome. Preparing your portfolio experience.
              </p>

              <div className="mt-4 space-y-2 text-xs text-[#28779e]">
                {bootMessages.slice(0, visibleMessageCount).map((message) => (
                  <p key={message} className="m-0">
                    <span className="mr-2 font-bold text-[#4cbf48]">●</span>
                    {message}
                  </p>
                ))}
              </div>

              <p className="mt-5 text-xs font-semibold text-[#248d41]">
                {isComplete
                  ? "Everything is ready. Opening your desktop..."
                  : "Please wait while OxygenOS starts."}
              </p>
            </div>

            <div>
              <img
                alt="Rotating pixelated Earth"
                className="h-50 w-50 object-contain [image-rendering:pixelated] sm:h-70 sm:w-70"
                src="/earth/rotating-earth.gif"
              />
            </div>
          </div>

          <LoadingBar
            className="mt-8"
            label={isComplete ? "Startup complete" : "Starting OxygenOS"}
            progress={progress}
          />

          <footer className="mt-5 border-t border-white/55 pt-3 text-[0.63rem] font-semibold tracking-[0.06em] text-[#28779e]">
            {PORTFOLIO_OWNER.toUpperCase()} — PERSONAL PORTFOLIO SYSTEM
          </footer>
        </section>
      </main>
    </CrtShell>
  );
}

export default BootScreen;