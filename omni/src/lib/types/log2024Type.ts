// This is our 2024 config file.
// This contains all the types declerations for 2024.

import { Log2025 } from "./log2025Type"
import { LogCommon } from "./logCommonType"

// Form values
export type Log2024 = LogCommon & {
    auto: {
        leftStartingZone: boolean

        scored: boolean
        speakerScore: number
        ampScore: number
    }
    teleop: {
        ampScore: number

        speakerScore: number
        amplifiedSpeakerScore: number

        parkOnStage: boolean
        hangOnChain: boolean
        hangInHarmony: boolean
        trapScore: number

        thrownNoteScore: boolean
        thrownNoteAmount: number
    }
}

// make scoring map.

export const scoreAuto = (formChanges: Partial<Log2024 | Log2025>) => {
    const { auto } = formChanges

    if (!auto) return
    console.log(auto)
}
