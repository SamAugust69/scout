import { Log2024 } from "./log2024Type"
import { Log2025 } from "./log2025Type"

export type MatchInfo = {
    match_number: number
    red: string[]
    blue: string[]
}

export interface Event {
    id: string
    name: string
    week: number
    year: number
    event_code: string
    statistics: any
    match_logs: MatchLog[]
    schedule: MatchInfo[]
}

export type MatchLog = {
    matchNumber: number
    statistics: MatchStatistics
    logs: Partial<Log2024 | Log2025>[]
}

export type MatchStatistics = {
    overallScore: number
}
