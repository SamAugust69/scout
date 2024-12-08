import { Navbar } from "@/components/navbar"
import { useLocalStorage } from "@/lib/useLocalStorage"
import { DarkModeContext } from "@/lib/context/darkModeContext"
import { AppContextContext } from "./lib/context/appContext"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { NavigationError } from "./components/NavigationError"
import { Home } from "./pages/Home"
import { Create } from "./pages/CreateEvent"
import { ConfigNewDevice } from "./pages/ConfigNewDevice"
import { handleConnection } from "./lib/checkContectivity"
import { useEffect, useState } from "react"
import { Settings } from "./lib/types/settings"
import { CreateEventManual } from "./pages/CreateEventManual"
import { EventDashboard } from "./pages/EventDashboad"
import { Help } from "./pages/Help"
import { Notifications } from "./components/ui/notifications"

function App() {
    const [dark, setDark] = useLocalStorage<boolean>(false, "theme")
    const [settings, setSettings] = useLocalStorage<Settings>(
        { team: "" }, // Default settings value,
        "settings"
    )
    const [connected, setConnected] = useState<boolean>(false)

    useEffect(() => {
        // Function to update connectivity state
        const updateConnectionState = async () => {
            const isConnected = await handleConnection()
            setConnected(isConnected)
        }

        updateConnectionState()

        window.addEventListener("online", () => setConnected(true))
        window.addEventListener("offline", () => setConnected(false))
    }, [])

    return (
        <DarkModeContext.Provider value={{ dark: dark || false, setDark }}>
            <div
                className="font-host-grotesk flex h-screen overflow-hidden bg-neutral-200 dark:bg-[#272424] dark:text-neutral-300"
                data-mode={dark ? "dark" : "light"}
            >
                <AppContextContext.Provider
                    value={{
                        connectionState: connected,
                        settings: settings || null,
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
                                path="/create/manual"
                                element={<CreateEventManual />}
                            />
                            <Route
                                errorElement={<NavigationError />}
                                path="/setup"
                                element={<ConfigNewDevice />}
                            />
                            <Route
                                path="/event/:id"
                                errorElement={<NavigationError />}
                                element={<EventDashboard />}
                            />
                            <Route
                                path="/help"
                                errorElement={<NavigationError />}
                                element={<Help />}
                            />
                        </Routes>
                        <Notifications />
                    </BrowserRouter>
                </AppContextContext.Provider>
            </div>
        </DarkModeContext.Provider>
    )
}

export default App
