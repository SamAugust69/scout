import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { Event } from "@/lib/db"

interface EventButtonInterface {
    eventInfo: Event
    i: number
    selectedEvent: Event | null
    selectEvent: (eventInfo: Event) => void
}

export const EventButton = ({
    eventInfo,
    i,
    selectEvent,
    selectedEvent,
}: EventButtonInterface) => {
    return (
        <Button
            key={i}
            size="lg"
            variant="secondary"
            className="group relative"
            onClick={() => selectEvent(eventInfo)}
        >
            {/* better color here please darkmode */}
            <span
                className={`relative z-10 ${selectedEvent === eventInfo ? "font-bold dark:text-neutral-700" : null}`}
            >
                {eventInfo.name}
            </span>

            <div
                className={`absolute top-0 left-0 h-0 w-full rounded bg-[#7C8C77] transition-all group-hover:bg-[#92a38d] ${selectedEvent === eventInfo ? "h-full" : ""} px-2`}
            >
                <span
                    className={`absolute top-3 right-2 z-20 my-auto flex rounded bg-neutral-200 px-0 dark:bg-neutral-700 ${
                        selectedEvent === eventInfo ? "opacity-100" : "hidden"
                    } flex w-0 overflow-hidden transition-all group-hover:w-20 group-hover:px-2`}
                >
                    Create
                    <ChevronRight
                        className={`relative left-2 ${
                            selectedEvent === eventInfo
                                ? "opacity-100"
                                : "hidden"
                        }`}
                    />
                </span>
            </div>
        </Button>
    )
}
