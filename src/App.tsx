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
import { Settings } from "./lib/types/settingsType"
import { CreateEventManual } from "./pages/CreateEventManual"
import { EventDashboard } from "./pages/event/EventDashboad"
import { Help } from "./pages/Help"
import { Notifications } from "./components/ui/notifications"
import { EventScout } from "./pages/event/EventScout"
import { EventSchedule } from "./pages/event/EventSchedule"
import { MatchInfo } from "./lib/types/eventType"
import { EventStats } from "./pages/EventStats"
import { TeamDashboard } from "./pages/event/team/TeamDashboard"

function App() {
    const [dark, setDark] = useLocalStorage<boolean>(false, "theme")
    const [settings, setSettings] = useLocalStorage<Settings>(
        {
            team: "",
            serverAddr: undefined,
            animationsDisabled: false,
            disableNavbar: false,
        }, // Default settings value,
        "settings"
    )
    const [schedule, setSchedule] = useState<MatchInfo[] | null>(null)
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
                className="font-host-grotesk flex h-screen overflow-x-hidden bg-neutral-200 *:transition-none dark:bg-[#272424] dark:text-neutral-300 dark:scheme-dark"
                data-mode={dark ? "dark" : "light"}
            >
                {/* TODO:  move app context to db */}
                <AppContextContext.Provider
                    value={{
                        internetConnected: connected,
                        settings: settings,
                        setSettings,
                        schedule,
                        setSchedule,
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
                                path="/event/:id/scout"
                                errorElement={<NavigationError />}
                                element={<EventScout />}
                            />
                            <Route
                                path="/event/:id/schedule"
                                errorElement={<NavigationError />}
                                element={<EventSchedule />}
                            />
                            <Route
                                path="/event/:id/team/:team"
                                errorElement={<NavigationError />}
                                element={<TeamDashboard />}
                            />

                            <Route
                                path="/help"
                                errorElement={<NavigationError />}
                                element={<Help />}
                            />
                            <Route
                                path="/eventStats"
                                errorElement={<NavigationError />}
                                element={<EventStats />}
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
