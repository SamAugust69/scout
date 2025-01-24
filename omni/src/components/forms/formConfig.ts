import { scoreAuto } from "@/lib/types/log2024Type"
import {
    Auto2024,
    Finishing2024,
    StartLogInfo2024,
    Teleop2024,
} from "./2024/FormPages2024"
import { Auto2025, StartLogInfo2025, Teleop2025 } from "./2025/FormPages2025"
import { scoreLog } from "@/lib/types/log2025Type"
import { Log, logConfig } from "@/lib/types/logTypes"

export interface FormPageInterface {
    // handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleChange: (key: any, value: any) => void
    formChanges: Partial<any>
}

interface FormConfig<Y extends keyof typeof logConfig> {
    year: Y
    scoringFunction: (formChanges: Partial<Log<Y>>) => void
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
        scoringFunction: scoreAuto,
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
        scoringFunction: scoreLog,
        steps: [
            { title: "Info", component: StartLogInfo2025 },
            { title: "Auto", component: Auto2025 },
            { title: "Teleop", component: Teleop2025 },
        ],
    },
]
