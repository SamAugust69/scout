import { Event } from "@/lib/types/eventType"
import { Button } from "../ui/button"
import { useEffect, useState, useMemo, useCallback, createRef } from "react"
import { LogElement } from "../LogElement"
import { getLogs } from "@/lib/getLogs"
import { Log, logConfig } from "../forms/formConfig"
import { FilterLogList } from "../FilterLogList"
import { useFormContext } from "@/lib/context/formContext"
import { ScoreBreakdown } from "../ScoreBreakdown"
import { Input } from "../ui/input"
import { Modal, ModalContent, ModalTrigger } from "../ui/modal"
import { Filter } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"

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
    if (!eventData) return null

    const [renderList, setRenderList] = useState<boolean>(true)
    const { formIsOpen, setFormIsOpen } = useFormContext()

    const filteredLogsAsTeams = useMemo(
        () => filterLogsAsTeams(getLogs(eventData.match_logs)),
        [eventData.match_logs]
    )

    type Year = keyof typeof logConfig

    const [selectedFilters, setSelectedFilters] = useState<FilterButtonsType>({
        auto: [],
        teleop: [],
    })
    const [filteredLogs, setFilteredLogs] = useState<
        Record<number, Log<Year>[]>
    >({})

    const filterTeamsAndLogs = useCallback(
        (
            teamLogs: Record<number, Log<Year>[]>,
            selectedFilters: FilterButtonsType
        ): Record<number, Log<Year>[]> => {
            const filteredTeams: Record<number, Log<Year>[]> = {}

            for (const [team, logs] of Object.entries(teamLogs)) {
                const teamNumber = Number(team)

                const filteredLogs = logs.filter((log) => {
                    const autoMatches = selectedFilters.auto.every(
                        (key) =>
                            log.auto &&
                            log.auto[key] !== undefined &&
                            log.auto[key] !== false &&
                            log.auto[key] !== 0
                    )

                    const teleopMatches = selectedFilters.teleop.every(
                        (key) =>
                            log.teleop &&
                            log.teleop[key] !== undefined &&
                            log.teleop[key] !== false &&
                            log.teleop[key] !== 0
                    )

                    return autoMatches && teleopMatches
                })

                if (filteredLogs.length > 0) {
                    filteredTeams[teamNumber] = logs
                }
            }

            return filteredTeams
        },
        []
    )
    const scrollRef = createRef<HTMLDivElement>()

    const [fixedTeamName, setFixedTeamName] = useState<string | undefined>(
        undefined
    )

    useEffect(() => {
        if (!scrollRef.current) return

        const scrollEvent = scrollRef.current.addEventListener(
            "scroll",
            (e) => {
                const target = e.target as HTMLDivElement
                target.childNodes.forEach((child) => {
                    const fchild = child as HTMLDivElement

                    const span = fchild.firstChild?.lastChild as HTMLSpanElement

                    if (!span) return
                    const posFromTop =
                        fchild.getBoundingClientRect().top -
                        target.getBoundingClientRect().top

                    if (posFromTop < 0) setFixedTeamName(span.innerText)
                })
            }
        )

        return () => {
            scrollRef.current?.removeEventListener("scroll", scrollEvent)
        }
    }, [scrollRef])

    useEffect(() => {
        setFilteredLogs(
            filterTeamsAndLogs(filteredLogsAsTeams, selectedFilters)
        )
    }, [selectedFilters, filteredLogsAsTeams, filterTeamsAndLogs])

    const handleToggleRenderList = useCallback((value: boolean) => {
        setRenderList(value)
    }, [])

    const [showFilters, setShowFilters] = useState(false)

    return (
        <>
            <div className="flex justify-end gap-2">
                <Button
                    className={`${renderList ? "" : "dark:bg-neutral-300"}`}
                    onClick={() => handleToggleRenderList(false)}
                ></Button>
                <Button
                    className={`${renderList ? "dark:bg-neutral-300" : ""}`}
                    onClick={() => handleToggleRenderList(true)}
                ></Button>
            </div>

            <div className="relative flex gap-2">
                <Input />
                <Dialog>
                    <DialogTrigger>
                        <Button
                            className={`p-3 ${showFilters ? "dark:bg-cool-green hover:dark:bg-cool-green/50" : null}`}
                            variant="dark"
                        >
                            <Filter />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <FilterLogList
                            year={eventData.year as keyof typeof logConfig}
                            selectedFilters={selectedFilters}
                            setSelectedFilters={setSelectedFilters}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div
                ref={scrollRef}
                className="relative flex flex-col gap-2 overflow-y-scroll"
            >
                <div
                    className={`fixed z-10 bg-neutral-600 p-2 transition-opacity ${!fixedTeamName ? "opacity-0" : "opacity-100"}`}
                >
                    {fixedTeamName}
                </div>
                {renderList
                    ? Object.entries(filteredLogs).map(([team, logs]) => {
                          return (
                              <ScoreBreakdown
                                  key={team}
                                  team={team}
                                  logs={logs}
                              />
                          )
                      })
                    : null}

                {!renderList
                    ? eventData.match_logs.map((log, i) => (
                          <LogElement key={i} logInfo={log} />
                      ))
                    : null}
            </div>

            <Button onClick={() => setFormIsOpen(!formIsOpen)}>Scout</Button>
        </>
    )
}
