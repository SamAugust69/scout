import { motion } from "motion/react"
import { ScheduleMatchView } from "./ScheduleMatchView"
import { useAppContext } from "@/lib/context/appContext"

export const MatchNavigation = () => {
    const { schedule } = useAppContext()

    return (
        <motion.div
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 5, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex h-full flex-col gap-0.5"
        >
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
        </motion.div>
    )
}
