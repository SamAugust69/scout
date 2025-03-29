import { ScheduleMatchView } from "./ScheduleMatchView"
import { useAppContext } from "@/lib/context/appContext"
import { Paragraph } from "./ui/paragraph"
import { Input } from "./ui/input"
import { useEffect, useMemo, useRef, useState } from "react"
import { MatchInfo } from "@/lib/types/eventType"
import {
    Dropdown,
    DropdownButton,
    DropdownContent,
    DropdownItem,
} from "./ui/dropdown"

export const MatchNavigation = () => {
    const { schedule } = useAppContext()
    const containerRef = useRef<HTMLDivElement>(null)

    const [searchState, setSearchState] = useState("")

    const [filteredSchedule, setFilteredSchedule] = useState<MatchInfo[]>(
        schedule || []
    )

    const filterScheduleByTeam = () => {
        if (!schedule) return

        const filtered: MatchInfo[] = []

        schedule.map((match) => {
            ;[...match.blue, ...match.red].filter((team) => {
                return team.includes(searchState)
            }).length > 0 && filtered.push(match)
        })

        setFilteredSchedule(filtered)
    }

    useEffect(() => {
        filterScheduleByTeam()
    }, [searchState])

    const getAllTeams = () => {
        const teams = new Set<string>()

        schedule?.map((match) => {
            ;[...match.blue, ...match.red].every((team) => teams.add(team))
        })

        return [...teams].sort((a, b) => {
            return Number(a) > Number(b) ? 1 : -1
        })
    }

    const allTeams = useMemo(() => getAllTeams(), [schedule])

    const [dropdownOpen, setDropdownOpen] = useState(false)

    return (
        <>
            <div className="relative rounded-t bg-neutral-200 p-4 dark:bg-[#272424]">
                <Dropdown isOpen={dropdownOpen} setIsOpen={setDropdownOpen}>
                    <DropdownButton>
                        <Input
                            type="number"
                            value={searchState}
                            onChange={(e) =>
                                setSearchState(e.currentTarget.value)
                            }
                            placeholder="Team Number"
                        />
                    </DropdownButton>
                    <DropdownContent className="max-h-60 w-full overflow-y-scroll">
                        {allTeams
                            .filter((team) => {
                                return team.includes(searchState)
                            })
                            .map((team) => {
                                return (
                                    <DropdownItem
                                        key={team}
                                        onClick={() => {
                                            setDropdownOpen(!dropdownOpen)
                                            setSearchState(team)
                                        }}
                                    >
                                        {team}
                                    </DropdownItem>
                                )
                            })}
                    </DropdownContent>
                </Dropdown>
            </div>
            <div
                ref={containerRef}
                className="flex h-full flex-col items-center gap-4 overflow-y-scroll rounded-b bg-neutral-200 p-4 dark:bg-[#272424]"
            >
                {schedule && schedule.length > 0 ? (
                    filteredSchedule.map((match, i) => {
                        return (
                            <ScheduleMatchView
                                match={match}
                                key={i}
                                className="bg-neutral-100 dark:bg-neutral-700/50"
                            />
                        )
                    })
                ) : (
                    <Paragraph className="my-auto">
                        No schedule to display
                    </Paragraph>
                )}
            </div>
        </>
    )
}
