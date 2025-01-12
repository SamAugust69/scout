// This is our 2024 config file.
// This contains all the types declerations for 2024.

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

export const scoreAuto = (log: Partial<Log2024>) => {
    const { auto } = log

    if (!auto) return
    console.log(auto)
}
