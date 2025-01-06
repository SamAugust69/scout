import {
    Auto2024,
    Finishing2024,
    StartLogInfo2024,
    Teleop2024,
} from "./2024/FormPages2024"
import { Auto2025, StartLogInfo2025, Teleop2025 } from "./2025/FormPages2025"

export const formConfig = [
    {
        year: 2024,
        steps: [
            { title: "Info", component: StartLogInfo2024 },
            { title: "Auto", component: Auto2024 },
            { title: "Teleop", component: Teleop2024 },
            { title: "Notes", component: Finishing2024 },
        ],
    },
    {
        year: 2025,
        steps: [
            { title: "Info", component: StartLogInfo2025 },
            { title: "Auto", component: Auto2025 },
            { title: "Teleop", component: Teleop2025 },
        ],
    },
]
