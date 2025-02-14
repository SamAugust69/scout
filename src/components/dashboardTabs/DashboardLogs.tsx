import { Event, MatchLog } from "@/lib/types/eventType"
import { Button } from "../ui/button"
import { LogForm } from "../forms/Form"
import { useState } from "react"
import { Log, logConfig } from "@/lib/types/logTypes"
import { LogElement } from "../LogElement"

const getAllLogs = <Y extends keyof typeof logConfig>(
    matchLogs: MatchLog[]
): Partial<Log<Y>>[] => {
    const logs: Partial<Log<Y>>[] = []

    matchLogs.map((match) => {
        logs.push(...(match.logs as any))
    })

    return logs
}

export const DashboardLogs = ({ eventData }: { eventData: Event | null }) => {
    if (!eventData) return

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [renderList, setRenderList] = useState<boolean>(false) // controls wether or not the list displays as a match group or a list

    const allLogs = getAllLogs(eventData.match_logs)

    return (
        <>
            <LogForm
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                eventData={eventData}
            />
            <div className="flex justify-end gap-2">
                <Button
                    className={`${renderList ? "" : "dark:bg-neutral-300"}`}
                    onClick={() => setRenderList(false)}
                ></Button>
                <Button
                    className={`${renderList ? "dark:bg-neutral-300" : ""}`}
                    onClick={() => setRenderList(true)}
                ></Button>
            </div>

            {renderList
                ? allLogs.map((log) => {
                      return (
                          <div className="bg-neutral-700">
                              {log.match} {log.team}
                          </div>
                      )
                  })
                : eventData.match_logs.map((log) => {
                      return <LogElement logInfo={log} />
                  })}

            <Button onClick={() => setIsOpen(!isOpen)}>Scout</Button>
        </>
    )
}
