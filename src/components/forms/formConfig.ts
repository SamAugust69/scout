import {
    Auto2024,
    Finishing2024,
    StartLogInfo2024,
    Teleop2024,
} from "./2024/FormPages2024"
import {
    Auto2025,
    Finishing2025,
    StartLogInfo2025,
    Teleop2025,
} from "./2025/FormPages2025"
import { logConfig, scoringMap2025 } from "@/lib/types/logTypes"

export interface FormPageInterface {
    // handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleChange: (key: any, value: any) => void
    formChanges: Partial<any>
}

interface FormConfig<Y extends keyof typeof logConfig> {
    year: Y
    scoringMap: { [key: string]: number }
    steps: {
        title: string
        component: ({
            handleChange,
            formChanges,
        }: FormPageInterface) => JSX.Element
    }[]
}

export const formConfig: FormConfig<keyof typeof logConfig>[] = [
    {
        year: 2024,
        scoringMap: scoringMap2025,
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
    {
        year: 2025,
        scoringMap: scoringMap2025,
        steps: [
            { title: "Info", component: StartLogInfo2025 },
            { title: "Auto", component: Auto2025 },
            { title: "Teleop", component: Teleop2025 },
            { title: "Finishing", component: Finishing2025 },
        ],
    },
]
