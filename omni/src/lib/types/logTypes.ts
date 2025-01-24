// Log common, shouldn't need to be edited
export type LogCommon = {
    id: string
    match: number
    team: number
    scout: string
    dateSubmitted: Date
}

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

export const logConfig = {
    2024: {} as Log2024,
    2025: {} as Log2025,
} as const

export type Log<T extends keyof typeof logConfig> = (typeof logConfig)[T]
