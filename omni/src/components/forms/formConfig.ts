import { Log2024, scoreAuto } from "@/lib/types/log2024Type"
import {
    Auto2024,
    Finishing2024,
    StartLogInfo2024,
    Teleop2024,
} from "./2024/FormPages2024"
import { Auto2025, StartLogInfo2025, Teleop2025 } from "./2025/FormPages2025"
import { Log2025, scoreLog } from "@/lib/types/log2025Type"

export type Log<T extends number> = T extends 2024
    ? Log2024
    : T extends 2025
      ? Log2025
      : never

export interface PageInterface {
    // handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleChange: <Year extends number>(
        year: Year,
        key: any,
        value: any
    ) => void
    formChanges: Partial<any>
}

export const formConfig: {
    year: number
    scoringFunction: (formChanges: Partial<Log2024 | Log2025>) => void
    steps: {
        title: string
        component: ({ handleChange, formChanges }: PageInterface) => JSX.Element
    }[]
}[] = [
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
