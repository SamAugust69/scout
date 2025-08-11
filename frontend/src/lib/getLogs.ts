// gets all logs from match_logs

import { Log, logConfig } from "@/components/forms/formConfig"
import { MatchLog } from "./types/eventType"

export const getLogs = (matchData: MatchLog[]) => {
    const logs: Log<keyof typeof logConfig>[] = []
    matchData.map((log) => {
        logs.push(...(log.logs as any))
    })
    return logs
}
