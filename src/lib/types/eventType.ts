import { Log, logConfig } from "@/components/forms/formConfig"

export type MatchInfo = {
    match_number: number
    red: string[]
    blue: string[]
}

export interface Event {
    id: string
    name: string
    week?: number
    year: number
    event_code: string
    statistics: any
    match_logs: MatchLog[]
    schedule: MatchInfo[]
}

export type MatchLog = {
    matchNumber: number
    statistics: MatchStatistics
    logs: Partial<Log<keyof typeof logConfig>>[]
}

export type MatchStatistics = {
    autoAverage: number
    teleopAverage: number
}
