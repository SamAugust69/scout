import { Event } from "@/lib/types/eventType"
import { Button } from "../ui/button"
import { LogForm } from "../forms/Form"
import { useState } from "react"
import { LogElement } from "../LogElement"
import { getLogs } from "@/lib/getLogs"

export const DashboardLogs = ({ eventData }: { eventData: Event | null }) => {
    if (!eventData) return

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [renderList, setRenderList] = useState<boolean>(false) // controls wether or not the list displays as a match group or a list

    const allLogs = getLogs(eventData.match_logs)

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
