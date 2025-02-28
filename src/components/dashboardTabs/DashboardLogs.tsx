import { Event } from "@/lib/types/eventType"
import { Button } from "../ui/button"
import { LogForm } from "../forms/Form"
import { useState } from "react"
import { LogElement } from "../LogElement"
import { getLogs } from "@/lib/getLogs"
import { Paragraph } from "../ui/paragraph"
import { scoreLog } from "@/lib/types/logCommonType"
import { formConfig } from "../forms/formConfig"

export const DashboardLogs = ({ eventData }: { eventData: Event | null }) => {
    if (!eventData) return

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [renderList, setRenderList] = useState<boolean>(true) // controls wether or not the list displays as a match group or a list

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

            {/* <FilterLogList year={eventData.year as keyof typeof logConfig} /> */}

            {renderList
                ? allLogs.map((log) => {
                      console.log(allLogs)
                      return (
                          <div className="flex flex-col bg-neutral-700">
                              <Paragraph>{JSON.stringify(log)}</Paragraph>
                              <Button
                                  onClick={() =>
                                      console.log(
                                          scoreLog(
                                              log,
                                              formConfig[
                                                  eventData.year as keyof typeof formConfig
                                              ].scoringMap
                                          )
                                      )
                                  }
                              >
                                  Score Function Again
                              </Button>
                          </div>
                      )
                  })
                : null}

            {!renderList
                ? eventData.match_logs.map((log) => {
                      return <LogElement logInfo={log} />
                  })
                : null}

            <Button onClick={() => setIsOpen(!isOpen)}>Scout</Button>
        </>
    )
}
