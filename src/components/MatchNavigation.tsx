import { ScheduleMatchView } from "./ScheduleMatchView"
import { useAppContext } from "@/lib/context/appContext"
import { Paragraph } from "./ui/paragraph"
import { Input } from "./ui/input"
import { createRef, useRef, useState } from "react"
import { MatchInfo } from "@/lib/types/eventType"

export const MatchNavigation = () => {
    const { schedule } = useAppContext()
    const containerRef = useRef<HTMLDivElement>(null)
    const filterRef = createRef<HTMLInputElement>()
    const [filteredSchedule, setFilteredSchedule] = useState<MatchInfo[]>(schedule || [])

    const filterScheduleByNumber = (number: number) => {
        console.log('fart')

        if (!schedule) return
        setFilteredSchedule(() => 
            schedule.filter((match) => {
                return match.match_number >= number
            })
        )
    }

    // const filterScheduleByTeam = (number: number) => {
    //     console.log('fart')

    //     if (!schedule) return
    //     setFilteredSchedule(() => 
    //         schedule.filter((match) => {
    //             return match.
    //         })
    //     )
    // }

    return (
        <>
            <div className="rounded-t bg-neutral-200 p-4 dark:bg-[#272424]">
                <Input ref={filterRef} onChange={(e) => filterScheduleByNumber(Number(e.currentTarget.value) || 0)} placeholder="Team Number" />
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
