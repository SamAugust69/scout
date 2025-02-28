import { LogCommon } from "@/lib/types/logTypes"

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
