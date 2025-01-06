import { MatchInfo } from "@/lib/types/eventType"
import { cn } from "@/lib/utils"
import React, { HTMLAttributes } from "react"

export const ScheduleMatchView = React.memo(
    ({
        match,
        className,
    }: { match: MatchInfo } & HTMLAttributes<HTMLDivElement>) => {
        if (!match) return
        return (
            <div
                className={cn(
                    "w-full rounded bg-neutral-200 dark:bg-[#272424]",
                    className
                )}
            >
                <div className="border-b-2 border-neutral-400 px-3 py-2 dark:border-neutral-900/50">
                    Qualifier {match.match_number}
                </div>
                <div className="grid h-12 grid-cols-3 border-b-2 border-[#a37979] bg-[#be8d8e] px-3 py-2 dark:border-[#774B4C] dark:bg-[#9A6364]">
                    <p>{match.red[0]}</p>
                    <p className="text-center">{match.red[1]}</p>
                    <p className="text-right">{match.red[2]}</p>
                </div>
                <div className="grid h-12 grid-cols-3 rounded-b bg-[#8898b8] px-3 py-2 dark:bg-[#63769A]">
                    <p>{match.blue[0]}</p>
                    <p className="text-center">{match.blue[1]}</p>
                    <p className="text-right">{match.blue[2]}</p>
                </div>
            </div>
        )
    }
)
