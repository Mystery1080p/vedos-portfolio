import CrtShell from "../components/effects/CrtShell";

function BootScreen() {
  return (
    <CrtShell>
      <main className="vedos-screen-boot flex min-h-screen items-center justify-center bg-black px-4">
        <section className="w-full max-w-3xl border border-cyan-300/70 bg-emerald-950/20 p-5 text-xs text-cyan-100 shadow-[0_0_30px_rgba(54,255,139,0.12)] sm:p-8">
          <header className="mb-6 flex items-center justify-between border-b border-cyan-300/70 pb-3">
            <span className="vedos-glow-text tracking-[0.18em]">
              VEDOS BIOS(TM)
            </span>
            <span className="text-emerald-300">VER 01.03</span>
          </header>

          <div className="space-y-1 text-emerald-200/90">
            <p>Copyright Vedanth Mandpe. All systems reserved.</p>
            <p>Initializing memory banks........................ [OK]</p>
            <p>Mounting virtual file system..................... [OK]</p>
            <p>Calibrating CRT signal........................... [OK]</p>
            <p>Loading visual matrix............................ [OK]</p>
            <p>Starting VedOS portfolio environment............. [OK]</p>
          </div>

          <div className="mt-8">
            <p className="vedos-label mb-2">System startup</p>

            <div className="h-4 overflow-hidden border border-cyan-300/80 p-[2px]">
              <div className="h-full w-full origin-left animate-[pulse_1.1s_ease-in-out_infinite] bg-gradient-to-r from-emerald-400 via-cyan-200 to-emerald-400 shadow-[0_0_14px_rgba(114,255,229,0.85)]" />
            </div>

            <p className="vedos-cursor vedos-glow-green mt-3">
              PREPARING VISITOR SESSION
            </p>
          </div>
        </section>
      </main>
    </CrtShell>
  );
}

export default BootScreen;