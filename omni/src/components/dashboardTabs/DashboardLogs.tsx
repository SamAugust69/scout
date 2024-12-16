import { getLogs } from "@/lib/getLogs"
import { Event } from "@/lib/types/eventType"

export const DashboardLogs = ({ eventData }: { eventData: Event | null }) => {
    if (!eventData) return
    return <>{getLogs(eventData.match_logs)}</>
}
