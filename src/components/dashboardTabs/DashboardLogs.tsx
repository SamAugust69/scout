import { Event } from "@/lib/types/eventType"
import { Button } from "../ui/button"
import { LogForm } from "../forms/Form"
import { useEffect, useState } from "react"
import { LogElement } from "../LogElement"
import { getLogs } from "@/lib/getLogs"
import { Log, logConfig } from "../forms/formConfig"
import { FilterLogList } from "../FilterLogList"

const filterLogsAsTeams = (
    allLogs: Log<keyof typeof logConfig>[]
): { [key: number]: Log<keyof typeof logConfig>[] } => {
    const filteredTeamLogs: { [key: number]: Log<keyof typeof logConfig>[] } =
        {}

    allLogs.forEach((log) => {
        const team = log.team

        if (!filteredTeamLogs[team]) filteredTeamLogs[team] = []
        filteredTeamLogs[team].push(log)
    })

    return filteredTeamLogs
}

export type FilterButtonsType = {
    auto: (keyof Log<keyof typeof logConfig>["auto"])[]
    teleop: (keyof Log<keyof typeof logConfig>["teleop"])[]
}

export const DashboardLogs = ({ eventData }: { eventData: Event | null }) => {
    if (!eventData) return

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [renderList, setRenderList] = useState<boolean>(true) // controls wether or not the list displays as a match group or a list

    const filteredLogsAsTeams = filterLogsAsTeams(getLogs(eventData.match_logs))

    type Year = keyof typeof logConfig

    const [selectedFilters, setSelectedFilters] = useState<{
        auto: (keyof Log<Year>["auto"])[]
        teleop: (keyof Log<Year>["teleop"])[]
    }>({ auto: [], teleop: [] })
    const [filteredLogs, setFilteredLogs] = useState<
        Record<number, Log<Year>[]>
    >({})

    const filterTeamsAndLogs = (
        teamLogs: Record<number, Log<Year>[]>,
        selectedFilters: FilterButtonsType
    ): Record<number, Log<Year>[]> => {
        const filteredTeams: Record<number, Log<Year>[]> = {}

        for (const [team, logs] of Object.entries(teamLogs)) {
            const teamNumber = Number(team)

            const filteredLogs = logs.filter((log) => {
                // auto filters
                const autoMatches = selectedFilters.auto.every(
                    (key) =>
                        log.auto &&
                        log.auto[key] !== undefined &&
                        log.auto[key] !== false &&
                        log.auto[key] !== 0
                )

                // teleop filters
                const teleopMatches = selectedFilters.teleop.every(
                    (key) =>
                        log.teleop &&
                        log.teleop[key] !== undefined &&
                        log.teleop[key] !== false &&
                        log.teleop[key] !== 0
                )

                // return true if both filters pass
                return autoMatches && teleopMatches
            })

            // only include the team if they have at least one matching log
            if (filteredLogs.length > 0) {
                filteredTeams[teamNumber] = filteredLogs
            }
        }

        return filteredTeams
    }

    useEffect(() => {
        setFilteredLogs(
            filterTeamsAndLogs(filteredLogsAsTeams, selectedFilters)
        )
    }, [selectedFilters])

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

            <FilterLogList
                year={eventData.year as keyof typeof logConfig}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
            />
            <div className="w-full">
                {renderList
                    ? Object.entries(filteredLogs).map(([team, logs]) => {
                          return (
                              <div>
                                  {team}
                                  {logs.map((log) => {
                                      return <div>{JSON.stringify(log)}</div>
                                  })}
                              </div>
                          )
                      })
                    : null}

                {!renderList
                    ? eventData.match_logs.map((log) => {
                          return <LogElement logInfo={log} />
                      })
                    : null}
            </div>

            <Button onClick={() => setIsOpen(!isOpen)}>Scout</Button>
        </>
    )
}
