// gets all logs from match_logs

import { MatchLog } from "./types/eventType"
import { Log2024 } from "./types/log2024Type"

export const getLogs = (matchData: MatchLog[]) => {
    const logs: Log2024[] = []
    matchData.map((log) => {
        logs.push(log.logs)
    })
    return logs
}
