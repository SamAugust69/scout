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
    score: LogScore
    notes: string
    broken: boolean
    damaged: boolean
    defence: boolean
    offence: boolean
}

export type LogScore = {
    teleopScore: number
    autoScore: number
}

// Scoring maps
