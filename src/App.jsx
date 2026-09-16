import { useEffect, useState } from "react";
import BootScreen from "./screens/BootScreen";
import LoginScreen from "./screens/LoginScreen";
import DesktopScreen from "./screens/DesktopScreen";

function App() {
  const [screen, setScreen] = useState("boot");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setScreen("login");
    }, 1000);

    return () => window.clearTimeout(timer);
  }, []);

  if (screen === "boot") {
    return <BootScreen />;
  }

  if (screen === "login") {
    return <LoginScreen onLogin={() => setScreen("desktop")} />;
  }

  return <DesktopScreen />;
}

export default App;