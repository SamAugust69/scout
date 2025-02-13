// This is our 2024 config file.
// This contains all the types declerations for 2024.

import { MatchStatistics } from "./eventType"
import { LogCommon } from "./logTypes"

// Form values
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
    }
    end: {
        parked: boolean
        shallowHang: boolean
        deepHang: boolean
    }
}

// make scoring map.

const scoringMap2025: { [key: string]: number } = {
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
    "end.parked": 2,
    "end.shallowHang": 6,
    "end.deepHang": 12,
}

export const scoreLog = (formChanges: Partial<Log2025>): MatchStatistics => {
    console.log(formChanges)

    var scores: { [key: string]: number } = {}

    Object.entries(formChanges).map(([section, values]) => {
        if (typeof values === "object" && values !== null) {
            // is object

            Object.entries(values).map(([key, value]) => {
                // console.log(`${section}.${key}`)
                const prevScore = scores[section] || 0

                scores[section] =
                    prevScore + value * scoringMap2025[`${section}.${key}`]
            })
        }
    })

    console.log(scores)
    return { autoAverage: scores?.auto, teleopAverage: scores?.teleop }
}
