import { Log2024 } from "./log2024Type"

export interface Event {
    id: string
    name: string
    week: number
    year: number
    event_code: string
    statistics: any
    match_logs: MatchLog[]
}

export type MatchLog = {
    matchNumber: number
    statistics: MatchStatistics
    logs: Log2024
}

export type MatchStatistics = {
    overallScore: number
}
