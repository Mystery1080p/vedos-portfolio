import CrtShell from "../components/effects/CrtShell";
import WindowFrame from "../components/windows/WindowFrame";

function DesktopScreen() {
  return (
    <CrtShell>
      <main className="vedos-os vedos-grid min-h-screen p-4 sm:p-8">
        <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col gap-4">
          <header className="vedos-glass flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="vedos-label mb-1">VEDOS / DESKTOP PREVIEW</p>
              <h1 className="vedos-glow-text m-0 text-xl tracking-[0.16em] sm:text-2xl">
                SYSTEM ONLINE
              </h1>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <span className="vedos-status-dot" />
              <span>UPLINK_STABLE</span>
            </div>
          </header>

          <div className="grid flex-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <WindowFrame title="About VedOS">
              <div className="space-y-5">
                <div>
                  <p className="vedos-label mb-2">System identity</p>
                  <p className="leading-6 text-cyan-50/90">
                    A Matrix-inspired personal portfolio operating system for
                    Vedanth Mandpe.
                  </p>
                </div>

                <div className="vedos-divider" />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="vedos-glass-deep p-3">
                    <p className="vedos-label mb-2">Interface</p>
                    <p className="vedos-glow-green m-0">Y2K / CRT / GLASS</p>
                  </div>

                  <div className="vedos-glass-deep p-3">
                    <p className="vedos-label mb-2">Runtime</p>
                    <p className="vedos-glow-green m-0">REACT / WEBGL</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button className="vedos-button" type="button">
                    Open Portfolio
                  </button>

                  <button className="vedos-button" type="button">
                    View System Log
                  </button>

                  <button
                    className="vedos-button vedos-button-danger"
                    type="button"
                  >
                    Abort Preview
                  </button>
                </div>
              </div>
            </WindowFrame>

            <aside className="vedos-glass vedos-noise p-4">
              <p className="vedos-label mb-3">Live diagnostic output</p>

              <div className="space-y-2 text-xs leading-5 text-emerald-100/90">
                <p className="m-0">[OK] CRT overlay initialized</p>
                <p className="m-0">[OK] Glass protocol active</p>
                <p className="m-0">[OK] Cyan luminance calibrated</p>
                <p className="m-0">[OK] File system pending</p>
                <p className="m-0">[OK] Terminal pending</p>
                <p className="vedos-cursor vedos-glow-green m-0">
                  READY_FOR_INPUT
                </p>
              </div>
            </aside>
          </div>

          <footer className="vedos-glass flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-[0.68rem] tracking-[0.12em] text-cyan-100/80">
            <span>VEDOS v1.03</span>
            <span>GRAPHICS: CRT_GLASS_PIPELINE</span>
            <span>MEMORY: STABLE</span>
          </footer>
        </section>
      </main>
    </CrtShell>
  );
}

export default DesktopScreen;