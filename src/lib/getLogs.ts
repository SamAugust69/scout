// gets all logs from match_logs

import { MatchLog } from "./types/eventType"
import { Log, logConfig } from "./types/logTypes"

export const getLogs = (matchData: MatchLog[]) => {
    const logs: Log<keyof typeof logConfig>[] = []
    matchData.map((log) => {
        logs.push(log.logs as any)
    })
    return logs
}
