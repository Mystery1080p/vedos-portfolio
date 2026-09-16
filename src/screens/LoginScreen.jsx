import { useEffect, useState } from "react";
import CrtShell from "../components/effects/CrtShell";
import LoadingBar from "../components/ui/LoadingBar";
import WindowFrame from "../components/windows/WindowFrame";
import { LOGIN_DURATION_MS, PORTFOLIO_OWNER } from "../lib/constants";

function LoginScreen({ onLoginComplete }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isAuthenticating) {
      return undefined;
    }

    const startedAt = Date.now();

    const intervalId = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(
        100,
        Math.round((elapsed / LOGIN_DURATION_MS) * 100)
      );

      setProgress(nextProgress);

      if (nextProgress >= 100) {
        window.clearInterval(intervalId);
        window.setTimeout(() => {
          onLoginComplete();
        }, 250);
      }
    }, 50);

    return () => window.clearInterval(intervalId);
  }, [isAuthenticating, onLoginComplete]);

  const handleLogin = () => {
    setProgress(0);
    setIsAuthenticating(true);
  };

  return (
    <CrtShell>
      <main className="vedos-grid flex min-h-screen items-center justify-center p-4">
        <WindowFrame
          className="w-full max-w-md"
          showControls={false}
          title={isAuthenticating ? "VedOS Authentication" : "VedOS Secure Login"}
        >
          {!isAuthenticating ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="vedos-label mb-3">
                  Personal portfolio operating system
                </p>

                <div className="vedos-glow-text text-4xl font-bold tracking-[0.18em]">
                  VEDOS
                </div>

                <p className="mt-3 text-xs leading-5 text-cyan-100/80">
                  Hello, Visitor. Please identify the owner profile to continue.
                </p>
              </div>

              <div className="vedos-glass-deep space-y-3 p-4">
                <div>
                  <p className="vedos-label mb-1">User profile</p>
                  <p className="m-0 text-lg text-emerald-200">
                    {PORTFOLIO_OWNER}
                  </p>
                </div>

                <div className="vedos-divider" />

                <p className="m-0 text-xs leading-5 text-cyan-100/70">
                  Permission level: VISITOR
                  <br />
                  Desktop access: AVAILABLE
                  <br />
                  Session type: PORTFOLIO_EXPLORATION
                </p>
              </div>

              <button
                className="vedos-button w-full"
                onClick={handleLogin}
                type="button"
              >
                Login as {PORTFOLIO_OWNER}
              </button>

              <p className="text-center text-[0.65rem] tracking-[0.12em] text-emerald-200/60">
                ACCESS_NODE // VEDOS // READY
              </p>
            </div>
          ) : (
            <div className="space-y-6 py-3">
              <div className="text-center">
                <p className="vedos-glow-text text-xl tracking-[0.12em]">
                  AUTHENTICATING VISITOR
                </p>

                <p className="mt-3 text-xs leading-5 text-cyan-100/70">
                  Loading {PORTFOLIO_OWNER}'s desktop session.
                </p>
              </div>

              <div className="vedos-glass-deep space-y-2 p-4 text-xs text-emerald-100/85">
                <p className="m-0">
                  [{progress >= 25 ? "OK" : ".."}] Loading user interface
                </p>
                <p className="m-0">
                  [{progress >= 50 ? "OK" : ".."}] Mounting portfolio folders
                </p>
                <p className="m-0">
                  [{progress >= 75 ? "OK" : ".."}] Linking terminal subsystem
                </p>
                <p className="m-0">
                  [{progress >= 100 ? "OK" : ".."}] Opening VedOS desktop
                </p>
              </div>

              <LoadingBar
                label="Login in progress"
                progress={progress}
              />

              <p className="vedos-cursor text-center text-xs text-emerald-300">
                ESTABLISHING SESSION
              </p>
            </div>
          )}
        </WindowFrame>
      </main>
    </CrtShell>
  );
}

export default LoginScreen;