import { Navbar } from "@/components/navbar"
import { useLocalStorage } from "@/lib/useLocalStorage"
import { DarkModeContext } from "@/lib/context/darkModeContext"
import { AppContextContext } from "./lib/context/appContext"
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import { NavigationError } from "./components/NavigationError"
import { Home } from "./components/pages/Home"
import { Create } from "./components/pages/CreateEvent"
import { ConfigNewDevice } from "./components/pages/ConfigNewDevice"
import { handleConnection } from "./lib/checkContectivity"
import { useEffect, useState } from "react"
import { Settings } from "./lib/types/settingsType"
import { CreateEventManual } from "./components/pages/CreateEventManual"
import { EventDashboard } from "./components/pages/event/EventDashboad"
import { Help } from "./components/pages/Help"
import { Notifications } from "./components/ui/notifications"
import { EventScout } from "./components/pages/event/EventScout"
import { EventSchedule } from "./components/pages/event/EventSchedule"
import { MatchInfo } from "./lib/types/eventType"
import { EventStats } from "./components/pages/EventStats"
import { TeamDashboard } from "./components/pages/event/team/TeamDashboard"
import { FormBuilder } from "./components/pages/FormBuilder"
import { MainLayout } from "./components/layouts/MainLayout"
import { NoNavLayout } from "./components/layouts/NoNavLayout"

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
                        <Routes>
                            {/* All routes with navbar */}
                            <Route element={<MainLayout />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/create" element={<Create />} />
                                <Route
                                    path="/create/manual"
                                    element={<CreateEventManual />}
                                />
                                <Route
                                    path="/setup"
                                    element={<ConfigNewDevice />}
                                />
                                <Route
                                    path="/event/:id"
                                    element={<EventDashboard />}
                                />
                                <Route
                                    path="/event/:id/scout"
                                    element={<EventScout />}
                                />
                                <Route
                                    path="/event/:id/schedule"
                                    element={<EventSchedule />}
                                />
                                <Route
                                    path="/event/:id/team/:team"
                                    element={<TeamDashboard />}
                                />
                                <Route path="/help" element={<Help />} />
                                <Route
                                    path="/eventStats"
                                    element={<EventStats />}
                                />
                            </Route>

                            {/* Routes without navbar */}
                            <Route element={<NoNavLayout />}>
                                <Route
                                    path="/FormBuilder"
                                    element={<FormBuilder />}
                                />
                            </Route>
                        </Routes>

                        <Notifications />
                    </BrowserRouter>
                </AppContextContext.Provider>
            </div>
        </DarkModeContext.Provider>
    )
}

export default App
