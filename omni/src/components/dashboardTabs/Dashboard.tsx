import { Event } from "@/lib/types/eventType"
import { Heading } from "../ui/heading"
import { ScheduleMatchView } from "../ScheduleMatchView"
import { useEffect } from "react"
import { Paragraph } from "../ui/paragraph"
import { StyledLink } from "../StyledLink"
import { ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { useAppContext } from "@/lib/context/appContext"
import { EventSettings } from "@/lib/types/eventSettings"

export const Dashboard = ({
    eventData,
    eventUserSettings,
}: {
    eventData: Event | null
    eventUserSettings: { [key: string]: EventSettings }
    editEventUserSettings: (key: string, value: Partial<EventSettings>) => void
}) => {
    if (!eventData || !eventUserSettings[eventData.id]) return

    const { setSchedule } = useAppContext()

    useEffect(() => {
        setSchedule(eventData.schedule)
    }, [])
    return (
        <>
            <div className="grid grid-cols-2 gap-2">
                <div className="rounded bg-neutral-100 px-4 py-3 dark:bg-[#302E2E]">
                    <Heading>Matches Scouted</Heading>
                    <Paragraph>
                        {eventData.schedule.length > 0
                            ? `${eventUserSettings[eventData.id].currentMatch}/${eventData.schedule.length}`
                            : "test"}
                    </Paragraph>
                </div>
                <div className="rounded bg-neutral-100 px-4 py-3 dark:bg-[#302E2E]"></div>
                <div className="col-span-2 rounded bg-neutral-100 px-4 py-3 dark:bg-[#302E2E]"></div>
            </div>
            <div className="flex flex-col gap-3 rounded bg-neutral-100 p-3 dark:bg-[#302E2E]">
                <div className="flex justify-between">
                    <Heading>Next Match</Heading>
                    <StyledLink
                        variant="link"
                        to={"./schedule"}
                        size="none"
                        className="group relative left-4 gap-1 text-sm transition-all hover:left-0"
                    >
                        View Full Schedule
                        <ChevronRight className="relative right-4 w-4 opacity-0 transition-opacity group-hover:right-0 group-hover:opacity-100" />
                    </StyledLink>
                </div>
                <ScheduleMatchView
                    match={
                        eventData?.schedule[
                            eventUserSettings[eventData.id].currentMatch
                        ]
                    }
                />
                <Button size="lg">Scout Now</Button>
            </div>
        </>
    )
}
