import { LogCommon } from "@/lib/types/logTypes"

export type Log2025 = LogCommon & {
    auto: {
        left: boolean
        coralL1: number
        coralL2: number
        coralL3: number
        coralL4: number
        algae: number
        net: number
    }
    teleop: {
        coralL1: number
        coralL2: number
        coralL3: number
        coralL4: number
        algae: number
        net: number

        parked: boolean
        hung: boolean
        shallowHang: boolean
        deepHang: boolean
    }
}

export const scoringMap2025: { [key: string]: number } = {
    "auto.left": 3,
    "auto.coralL1": 3,
    "auto.coralL2": 4,
    "auto.coralL3": 6,
    "auto.coralL4": 7,
    "auto.algae": 6,
    "auto.net": 4,

    // Teleop Scoring
    "teleop.coralL1": 2,
    "teleop.coralL2": 3,
    "teleop.coralL3": 4,
    "teleop.coralL4": 5,
    "teleop.algae": 6,
    "teleop.net": 4,

    // Endgame Scoring
    "teleop.parked": 2,
    "teleop.shallowHang": 6,
    "teleop.deepHang": 12,
}

export const Log2025Default: Partial<Log2025> = {
    auto: {
        left: false,
        coralL1: 0,
        coralL2: 0,
        coralL3: 0,
        coralL4: 0,
        algae: 0,
        net: 0,
    },
    teleop: {
        coralL1: 0,
        coralL2: 0,
        coralL3: 0,
        coralL4: 0,
        algae: 0,
        net: 0,

        parked: false,
        hung: false,
        shallowHang: false,
        deepHang: false,
    },
}
