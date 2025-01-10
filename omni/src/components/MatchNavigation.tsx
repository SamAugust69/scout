import { ScheduleMatchView } from "./ScheduleMatchView"
import { useAppContext } from "@/lib/context/appContext"
import { Paragraph } from "./ui/paragraph"
import { Input } from "./ui/input"
import { useEffect, useRef } from "react"

export const MatchNavigation = () => {
    const { schedule } = useAppContext()
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        containerRef.current?.children[3].scrollIntoView()
    }, [])

    return (
        <>
            <div className="rounded-t bg-neutral-200 p-4 dark:bg-[#272424]">
                <Input placeholder="1" />
            </div>
            <div
                ref={containerRef}
                className="flex h-full flex-col items-center gap-4 overflow-y-scroll rounded-b bg-neutral-200 p-4 dark:bg-[#272424]"
            >
                {schedule && schedule.length > 0 ? (
                    schedule.map((match, i) => {
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
