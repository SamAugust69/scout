import {
    Auto2024,
    Finishing2024,
    StartLogInfo2024,
    Teleop2024,
} from "./2024/FormPages2024"
import { Log2024 } from "./2024/Log2024"
import {
    Auto2025,
    Finishing2025,
    StartLogInfo2025,
    Teleop2025,
} from "./2025/FormPages2025"
import { Log2025, Log2025Default, scoringMap2025 } from "./2025/Log2025"

export interface FormPageInterface {
    // handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleChange: (key: any, value: any) => void
    formChanges: Partial<any>
}

interface FormConfig<Year extends keyof typeof logConfig> {
    [key: string]: {
        scoringMap: { [key: string]: number }
        defaultForm: Partial<Log<Year>>
        steps: {
            title: string
            component: ({
                handleChange,
                formChanges,
            }: FormPageInterface) => JSX.Element
        }[]
    }
}

export const logConfig = {
    2024: {} as Log2024,
    2025: {} as Log2025,
} as const

export type Log<T extends keyof typeof logConfig> = (typeof logConfig)[T]

export const formConfig: FormConfig<keyof typeof logConfig> = {
    2024: {
        scoringMap: scoringMap2025,
        defaultForm: Log2025Default,
        steps: [
            {
                title: "Info",
                component: StartLogInfo2024,
            },
            { title: "Auto", component: Auto2024 },
            { title: "Teleop", component: Teleop2024 },
            { title: "Notes", component: Finishing2024 },
        ],
    },
    2025: {
        scoringMap: scoringMap2025,
        defaultForm: Log2025Default,
        steps: [
            { title: "Info", component: StartLogInfo2025 },
            { title: "Auto", component: Auto2025 },
            { title: "Teleop", component: Teleop2025 },
            { title: "Finishing", component: Finishing2025 },
        ],
    },
}
