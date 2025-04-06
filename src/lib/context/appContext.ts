import { createContext, Dispatch, SetStateAction, useContext } from "react"
import { Settings } from "../types/settingsType"
import { MatchInfo } from "../types/eventType"

export type AppContextType = {
    internetConnected: boolean
    settings: Settings
    setSettings: Dispatch<SetStateAction<Settings>>
    schedule: MatchInfo[] | null
    setSchedule: Dispatch<SetStateAction<MatchInfo[] | null>>
}

export const AppContextContext = createContext<AppContextType | undefined>(
    undefined
)

export const useAppContext = () => {
    const context = useContext(AppContextContext)
    if (context === undefined) throw new Error("Use within App Context")

    return context
}
