import { Navbar } from "@/components/Navbar";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { DarkModeContext } from "@/lib/context/darkModeContext";
import { AppContextContext } from "./lib/context/appContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavigationError } from "./components/NavigationError";
import { Home } from "./pages/Home";
import { Create } from "./pages/CreateEvent";
import { ConfigNewDevice } from "./pages/ConfigNewDevice";
import { Button } from "./components/ui/button";
import { Settings } from "lucide-react";

function App() {
  const [dark, setDark] = useLocalStorage<boolean>(false, "theme");

  return (
    <DarkModeContext.Provider value={{ dark: dark || false, setDark }}>
      <div
        className="flex h-screen font-host-grotesk bg-neutral-200 dark:bg-[#272424] dark:text-neutral-300 overflow-hidden"
        data-mode={dark ? "dark" : "light"}
      >
        <AppContextContext.Provider value={{ connectionState: "connected" }}>
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
