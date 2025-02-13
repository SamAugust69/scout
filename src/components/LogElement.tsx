import { MatchLog } from "@/lib/types/eventType"
import { Paragraph } from "./ui/paragraph"
import { Heading } from "./ui/heading"
import { Log, logConfig } from "@/lib/types/logTypes"
import { useMemo } from "react"

interface LogElementInterface {
    logInfo: MatchLog
}

export const LogElement = ({ logInfo }: LogElementInterface) => {
    const teams = useMemo(
        () => logInfo.logs.map((log) => log.team),
        [logInfo.logs]
    )
    console.log(logInfo.statistics)

    return (
        <div className="grid grid-cols-2 gap-3 rounded bg-neutral-100 p-4 dark:bg-[#302E2E]">
            <div className="col-span-2">
                <Heading>Quailifier {logInfo.matchNumber}</Heading>
                <Paragraph>{teams.join(", ")}</Paragraph>
            </div>

            <div className="rounded p-2 dark:bg-[#272424]">
                <Paragraph>Auto: {logInfo.statistics.autoAverage}</Paragraph>
                <Paragraph>
                    Teleop: {logInfo.statistics.teleopAverage}
                </Paragraph>
            </div>
            <div className="rounded p-2 dark:bg-[#272424]"></div>

            <div className="col-span-2 rounded bg-neutral-700 p-2">
                {logInfo.logs.map(
                    (log: Partial<Log<keyof typeof logConfig>>) => {
                        return <div>{log.team}</div>
                    }
                )}
            </div>
        </div>
    )
}
