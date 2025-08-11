import { Event } from "@/lib/types/eventType"
import { Button } from "../ui/button"
import { useEffect, useState, useMemo, useCallback } from "react"
import { LogElement } from "../LogElement"
import { getLogs } from "@/lib/getLogs"
import { Log, logConfig } from "../forms/formConfig"
import { FilterLogList } from "../FilterLogList"
import { ScoreBreakdown } from "../ScoreBreakdown"
import { Input } from "../ui/input"
import { ChevronFirst, ChevronLast, ChevronLeft, Filter } from "lucide-react"
import { Dialog, DialogContent } from "../ui/dialog"
import {
    Dropdown,
    DropdownButton,
    DropdownContent,
    DropdownItem,
    DropdownText,
} from "../ui/dropdown"
import { usePagination } from "@/lib/usePagination"
import { Paragraph } from "../ui/paragraph"
import { useFormContext } from "@/lib/context/formContext"

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
    const { setFormIsOpen, formIsOpen } = useFormContext()

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

    const [showFilters, setShowFilters] = useState(false)
    const [filterTeam, setFilterTeam] = useState("")

    useEffect(() => {
        setFilteredLogs(
            filterTeamsAndLogs(filteredLogsAsTeams, selectedFilters)
        )
    }, [selectedFilters, filteredLogsAsTeams, filterTeamsAndLogs])

    const handleToggleRenderList = useCallback((value: boolean) => {
        setRenderList(value)
    }, [])

    const [logsToDisplay, setLogsToDisplay] = useState(
        Object.entries(filteredLogs).filter(([team]) => {
            return team.includes(filterTeam)
        })
    )

    const {
        currentPage,
        totalPages,
        goToStep,
        currentStepNumber,
        backwards,
        forwards,
    } = usePagination(5, logsToDisplay)
    useEffect(() => {
        setLogsToDisplay(
            Object.entries(filteredLogs).filter(([team]) => {
                return team.includes(filterTeam)
            })
        )
        goToStep(0)
    }, [filteredLogs, filterTeam])

    const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)

    const onEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        setSearchDropdownOpen(false)
        e.currentTarget.blur()
    }

    const fillRange = (start: number, end: number) => {
        return [...Array(end - start + 1)].map((_, i) => start + i)
    }

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

            <div className="relative flex items-center gap-2 px-0.5">
                <Button
                    variant="link"
                    className="absolute right-16 z-[2] h-full text-sm"
                    onClick={() => setFilterTeam("")}
                >
                    Clear
                </Button>
                <Dropdown
                    className="relative w-full"
                    isOpen={searchDropdownOpen}
                    setIsOpen={setSearchDropdownOpen}
                >
                    <DropdownButton>
                        <Input
                            onKeyUp={(e) => {
                                e.key === "Enter" && onEnterKeyPress(e)
                            }}
                            type="number"
                            value={filterTeam}
                            onChange={(e) =>
                                setFilterTeam(e.currentTarget.value)
                            }
                            className="h-12 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                    </DropdownButton>
                    <DropdownContent className="max-h-60 w-full overflow-y-scroll">
                        {logsToDisplay.length <= 0 ? (
                            <DropdownText>Nutting to display</DropdownText>
                        ) : null}
                        {Object.keys(filteredLogs)
                            .filter((log) => {
                                return log.includes(filterTeam)
                            })
                            .map((team) => {
                                return (
                                    <DropdownItem
                                        key={team}
                                        onClick={() => {
                                            setFilterTeam(team)
                                            setSearchDropdownOpen(false)
                                        }}
                                    >
                                        {team}
                                    </DropdownItem>
                                )
                            })}
                    </DropdownContent>
                </Dropdown>
                <Dialog isOpen={showFilters} setIsOpen={setShowFilters}>
                    <DialogContent
                        overlayInvisible
                        className={`absolute top-14 left-0 z-10 max-h-full w-full max-w-full translate-none p-0`}
                    >
                        <FilterLogList
                            year={eventData.year as keyof typeof logConfig}
                            selectedFilters={selectedFilters}
                            setSelectedFilters={setSelectedFilters}
                        />
                    </DialogContent>
                </Dialog>
                <Button
                    className={`p-3 ${showFilters ? "dark:bg-cool-green hover:dark:bg-cool-green/50" : null}`}
                    variant="dark"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter />
                </Button>
                {/* <Dialog>
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
                </Dialog> */}
            </div>

            <div className="relative flex h-screen flex-col gap-2 overflow-y-scroll rounded">
                {renderList && currentPage.length <= 0 ? (
                    <div className="m-auto flex flex-col gap-2 rounded px-8 py-3 dark:bg-[#302E2E]">
                        <Paragraph className="text-sm font-bold">
                            Nothing to display :{"< "}
                        </Paragraph>
                        <Button
                            size="none"
                            variant="link"
                            className="text-sm underline"
                            onClick={() => setFormIsOpen(!formIsOpen)}
                        >
                            Scout a Match?
                        </Button>
                    </div>
                ) : null}
                {renderList && currentPage
                    ? currentPage.map(([team, logs]) => {
                          return (
                              <ScoreBreakdown
                                  key={team}
                                  team={team}
                                  logs={logs}
                              />
                          )
                      })
                    : null}

                {!renderList ? (
                    <>
                        <p>This aint done, dont care about it</p>

                        {eventData.match_logs.map((log, i) => (
                            <LogElement key={i} logInfo={log} />
                        ))}
                    </>
                ) : null}
            </div>

            <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-2">
                <div>
                    <Button variant="link" onClick={() => goToStep(0)}>
                        <ChevronFirst className="w-5" />
                    </Button>
                    <Button variant="link" onClick={backwards}>
                        <ChevronLeft className="w-5" />
                    </Button>
                </div>
                <div className="flex gap-3">
                    {fillRange(
                        Math.max(
                            0,
                            currentStepNumber -
                                2 -
                                Math.max(
                                    0,
                                    currentStepNumber + 2 - totalPages + 1
                                )
                        ),
                        Math.min(
                            totalPages - 1,
                            currentStepNumber +
                                2 +
                                Math.max(0, 2 - currentStepNumber)
                        )
                    ).map((num) => {
                        return (
                            <Button
                                key={num}
                                className={`px-4 py-2 ${currentStepNumber === num ? "dark:bg-cool-green bg-cool-green hover:enabled:bg-cool-green/50 dark:enabled:hover:bg-cool-green/50" : ""}`}
                                onClick={() => goToStep(num)}
                            >
                                {num}
                            </Button>
                        )
                    })}
                </div>
                <div>
                    <Button variant="link" onClick={forwards}>
                        <ChevronLeft className="w-5 rotate-180" />
                    </Button>
                    <Button
                        variant="link"
                        onClick={() => goToStep(totalPages - 1)}
                    >
                        <ChevronLast className="w-5" />
                    </Button>
                </div>
            </div>
        </>
    )
}
