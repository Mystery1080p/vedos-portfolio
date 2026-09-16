import { useState } from "react";
import useApplySystemPreferences from "./hooks/useApplySystemPreferences";
import BootScreen from "./screens/BootScreen";
import DesktopScreen from "./screens/DesktopScreen";
import LoginScreen from "./screens/LoginScreen";

function App() {
  const [screen, setScreen] = useState("boot");

  useApplySystemPreferences();

  if (screen === "boot") {
    return <BootScreen onComplete={() => setScreen("login")} />;
  }

  if (screen === "login") {
    return <LoginScreen onLoginComplete={() => setScreen("desktop")} />;
  }

  return <DesktopScreen />;
}

export default App;