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
      <main className="flex min-h-screen items-center justify-center p-4">
        <WindowFrame
          className="w-full max-w-md"
          showControls={false}
          title={isAuthenticating ? "OxygenOS Login" : "Welcome to OxygenOS"}
        >
          {!isAuthenticating ? (
            <div className="space-y-6 text-center">

              <div>
                <p className="oxygen-label mb-2">
                  Personal portfolio experience
                </p>

                <h1 className="m-0 text-3xl font-bold text-[#075f8d]">
                  Welcome
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#28779e]">
                  Hello, Visitor. Explore the creative world of {PORTFOLIO_OWNER}.
                </p>
              </div>

              <div className="oxygen-glass-deep text-left p-4">
                <p className="oxygen-label mb-1">Profile</p>
                <p className="m-0 text-lg font-bold text-[#0c6590]">
                  {PORTFOLIO_OWNER}
                </p>

                <div className="oxygen-divider my-3" />

                <p className="m-0 text-xs leading-5 text-[#28779e]">
                  Session type: Visitor exploration
                  <br />
                  Desktop access: Available
                </p>
              </div>

              <button
                className="oxygen-button w-full"
                onClick={handleLogin}
                type="button"
              >
                Enter OxygenOS
              </button>
            </div>
          ) : (
            <div className="space-y-6 py-3 text-center">
              <div>
                <p className="m-0 text-xl font-bold text-[#075f8d]">
                  Opening your desktop
                </p>
                <p className="mt-3 text-xs leading-5 text-[#28779e]">
                  Getting everything ready for your visit.
                </p>
              </div>

              <div className="oxygen-glass-deep space-y-2 p-4 text-left text-xs text-[#28779e]">
                <p className="m-0">
                  {progress >= 25 ? "✓" : "○"} Loading personal workspace
                </p>
                <p className="m-0">
                  {progress >= 50 ? "✓" : "○"} Placing desktop folders
                </p>
                <p className="m-0">
                  {progress >= 75 ? "✓" : "○"} Refreshing nature interface
                </p>
                <p className="m-0">
                  {progress >= 100 ? "✓" : "○"} Opening OxygenOS
                </p>
              </div>

              <LoadingBar label="Welcome sequence" progress={progress} />
            </div>
          )}
        </WindowFrame>
      </main>
    </CrtShell>
  );
}

export default LoginScreen;