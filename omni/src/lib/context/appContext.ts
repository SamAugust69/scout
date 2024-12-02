import { createContext, Dispatch, SetStateAction, useContext } from "react"
import { Settings } from "../types/settings"

export type AppContextType = {
    connectionState: boolean
    settings: Settings | null
    setSettings: Dispatch<SetStateAction<Settings>>
}

export const AppContextContext = createContext<AppContextType | undefined>(
    undefined
)

export const useAppContext = () => {
    const context = useContext(AppContextContext)
    if (context === undefined) throw new Error("Use within App Context")

    return context
}
