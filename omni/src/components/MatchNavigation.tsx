import { AnimatePresence, motion } from "motion/react"
import { ScheduleMatchView } from "./ScheduleMatchView"
import { useAppContext } from "@/lib/context/appContext"

export const MatchNavigation = () => {
    const { schedule } = useAppContext()

    return (
        <>
            <div className="rounded-t bg-neutral-200 p-4 dark:bg-[#272424]"></div>
            <div className="flex flex-col gap-4 overflow-y-scroll rounded-b bg-neutral-200 p-4 dark:bg-[#272424]">
                {schedule &&
                    schedule.map((match, i) => {
                        return (
                            <ScheduleMatchView
                                match={match}
                                key={i}
                                className="dark:bg-neutral-700/50"
                            />
                        )
                    })}
            </div>
        </>
    )
}
