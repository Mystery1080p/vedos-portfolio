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
  "POST: processor handshake established",
  "MEMCHK: virtual memory banks available",
  "CRTDRV: phosphor display profile loaded",
  "FSBOOT: virtual workspace mounted",
  "NETLINK: public portfolio uplink detected",
  "VEDOS: desktop environment initialized",
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

    const timeoutId = window.setTimeout(() => {
      onComplete();
    }, BOOT_COMPLETE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isComplete, onComplete]);

  const visibleMessageCount = Math.max(
    1,
    Math.ceil((progress / 100) * bootMessages.length)
  );

  return (
    <CrtShell>
      <main className="vedos-screen-boot flex min-h-screen items-center justify-center bg-black p-4 sm:p-8">
        <section className="w-full max-w-4xl border border-cyan-300/70 bg-[#03100c]/85 p-4 shadow-[0_0_40px_rgba(54,255,139,0.12)] sm:p-7">
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-300/70 pb-3 text-xs">
            <div className="vedos-glow-text tracking-[0.16em]">
              {SYSTEM_NAME} BIOS(TM)
            </div>

            <div className="flex gap-4 text-emerald-300">
              <span>RESEARCH</span>
              <span>VER {SYSTEM_VERSION}</span>
              <span>PORT 03</span>
            </div>
          </header>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-2 text-[0.68rem] leading-5 text-emerald-200/90 sm:text-xs">
              <p className="m-0 text-cyan-100">
                COPYRIGHT {PORTFOLIO_OWNER.toUpperCase()} © 2026
              </p>

              <p className="m-0 text-emerald-300">
                BEGINNING SYSTEM INITIALIZATION...
              </p>

              <div className="mt-4 space-y-1">
                {bootMessages.slice(0, visibleMessageCount).map((message) => (
                  <p key={message} className="m-0">
                    <span className="mr-2 text-cyan-300">[OK]</span>
                    {message}
                  </p>
                ))}
              </div>

              <p className="vedos-cursor vedos-glow-green mt-5">
                {isComplete
                  ? "SYSTEM READY. TRANSFERRING TO LOGIN..."
                  : "PLEASE WAIT. DO NOT POWER OFF."}
              </p>
            </div>

            <aside className="vedos-glass-deep vedos-noise min-h-52 p-4">
              <p className="vedos-label mb-4">VedOS visual kernel</p>

              <pre
                aria-hidden="true"
                className="vedos-glow-green m-0 overflow-hidden text-center text-[0.48rem] leading-[0.66rem] sm:text-[0.6rem] sm:leading-[0.8rem]"
              >
{`     .-=========-.
    /  VEDOS //  \\
   /  MATRIX 01   \\
  |  [  ◉   ◉  ]  |
  |      /\\       |
  |   ___||___    |
  |  /  CORE  \\   |
   \\___________/
      ONLINE`}
              </pre>

              <div className="mt-5 text-center text-[0.64rem] tracking-[0.14em] text-cyan-100/70">
                SIGNAL_LOCKED // {progress.toString().padStart(3, "0")}
              </div>
            </aside>
          </div>

          <LoadingBar
            className="mt-8"
            label={isComplete ? "Boot sequence complete" : "Loading VedOS"}
            progress={progress}
          />

          <footer className="mt-5 flex flex-wrap justify-between gap-2 border-t border-cyan-300/30 pt-3 text-[0.6rem] tracking-[0.1em] text-cyan-100/60">
            <span>CPU: WEB_RUNTIME</span>
            <span>MEMORY: 640K OK</span>
            <span>DISPLAY: CRT_GLASS</span>
          </footer>
        </section>
      </main>
    </CrtShell>
  );
}

export default BootScreen;