import { Navbar } from "@/components/navbar";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { DarkModeContext } from "@/lib/context/darkModeContext";
import { AppContextContext } from "./lib/context/appContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavigationError } from "./components/NavigationError";
import { Home } from "./pages/Home";
import { Create } from "./pages/CreateEvent";
import { ConfigNewDevice } from "./pages/ConfigNewDevice";
import { handleConnection } from "./lib/checkContectivity";
import { useEffect, useState } from "react";
import { Settings } from "./lib/types/settings";

function App() {
  const [dark, setDark] = useLocalStorage<boolean>(false, "theme");
  const [settings, setSettings] = useLocalStorage<Settings>(
    { team: null },
    "settings"
  );
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    // Function to update connectivity state
    const updateConnectionState = async () => {
      const isConnected = await handleConnection();
      setConnected(isConnected);
    };

    updateConnectionState();

    window.addEventListener("online", () => setConnected(true));
    window.addEventListener("offline", () => setConnected(false));
  }, []);

  return (
    <DarkModeContext.Provider value={{ dark: dark || false, setDark }}>
      <div
        className="flex h-screen font-host-grotesk bg-neutral-200 dark:bg-[#272424] dark:text-neutral-300 overflow-hidden"
        data-mode={dark ? "dark" : "light"}
      >
        <AppContextContext.Provider
          value={{
            connectionState: connected,
            settings: settings || { team: null },
            setSettings,
          }}
        >
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route
                errorElement={<NavigationError />}
                path="/"
                element={<Home />}
              />
              <Route
                errorElement={<NavigationError />}
                path="/create"
                element={<Create />}
              />
              <Route
                errorElement={<NavigationError />}
                path="/setup"
                element={<ConfigNewDevice />}
              />
            </Routes>
          </BrowserRouter>
        </AppContextContext.Provider>
      </div>
    </DarkModeContext.Provider>
  );
}

export default App;
