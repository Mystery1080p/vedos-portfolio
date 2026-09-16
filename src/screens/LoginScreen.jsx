import CrtShell from "../components/effects/CrtShell";
import WindowFrame from "../components/windows/WindowFrame";

function LoginScreen({ onLogin }) {
  return (
    <CrtShell>
      <main className="vedos-grid flex min-h-screen items-center justify-center p-4">
        <WindowFrame
          title="VedOS Secure Login"
          className="w-full max-w-md"
          showControls={false}
        >
          <div className="space-y-6">
            <div className="text-center">
              <p className="vedos-label mb-3">Personal portfolio operating system</p>

              <div className="vedos-glow-text font-display text-4xl font-bold tracking-[0.18em]">
                VEDOS
              </div>

              <p className="mt-3 text-xs leading-5 text-cyan-100/80">
                Hello, Visitor. Authenticate to access the desktop environment.
              </p>
            </div>

            <div className="vedos-glass-deep space-y-3 p-4">
              <div>
                <p className="vedos-label mb-1">User profile</p>
                <p className="m-0 text-lg text-emerald-200">Vedanth Mandpe</p>
              </div>

              <div className="vedos-divider" />

              <p className="m-0 text-xs leading-5 text-cyan-100/70">
                Permission level: VISITOR
                <br />
                Desktop access: AVAILABLE
              </p>
            </div>

            <button
              className="vedos-button w-full"
              onClick={onLogin}
              type="button"
            >
              Login as Vedanth Mandpe
            </button>

            <p className="text-center text-[0.65rem] tracking-[0.12em] text-emerald-200/60">
              VEDOS // VISITOR SESSION // 01.03
            </p>
          </div>
        </WindowFrame>
      </main>
    </CrtShell>
  );
}

export default LoginScreen;