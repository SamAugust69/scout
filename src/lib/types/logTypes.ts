// Log common, shouldn't need to be edited

export type LogStatistics = {
    teleopScore: number
    autoScore: number
}

export type LogCommon = {
    id: string
    match: number
    team: number
    scout: string
    dateSubmitted: Date
    statistics: LogStatistics
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
        coralStow: number
        coralL1: number
        coralL2: number
        coralL3: number
        coralL4: number
        algae: number
        net: number
    }
    teleop: {
        coralStow: number
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

// Scoring maps

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
    "end.parked": 2,
    "end.shallowHang": 6,
    "end.deepHang": 12,
}
