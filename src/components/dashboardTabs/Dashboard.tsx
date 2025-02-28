import { Event } from "@/lib/types/eventType"
import { Heading } from "../ui/heading"
import { ScheduleMatchView } from "../ScheduleMatchView"
import { useEffect } from "react"
import { Paragraph } from "../ui/paragraph"
import { ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { useAppContext } from "@/lib/context/appContext"
import { EventSettings } from "@/lib/types/eventSettings"
import { useFormContext } from "@/lib/context/formContext"

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

    const { formIsOpen, setFormIsOpen } = useFormContext()
    return (
        <>
            <div className="grid grid-cols-2 gap-2">
                <div className="rounded bg-neutral-100 px-4 py-3 dark:bg-[#302E2E]">
                    <Paragraph>Matches Scouted</Paragraph>
                    <Heading>{`${eventUserSettings[eventData.id].currentMatch} / ${eventData.schedule.length > 0 ? eventData.schedule.length : "?"}`}</Heading>
                </div>
                <div className="relative rounded bg-neutral-100 px-4 py-3 dark:bg-[#302E2E]">
                    <Paragraph>Best Scored Team</Paragraph>
                    <Heading>155</Heading>
                    <ChevronRight className="absolute right-3.5 bottom-3.5 w-5" />
                </div>
                <div className="col-span-2 rounded bg-neutral-100 px-4 py-3 dark:bg-[#302E2E]"></div>
            </div>
            <div className="flex flex-col gap-3 rounded bg-neutral-100 p-3 dark:bg-[#302E2E]">
                <div className="flex justify-between">
                    <Heading>Next Match</Heading>
                    {/* <StyledLink
                        variant="link"
                        to={"./schedule"}
                        size="none"
                        className="group relative left-3 gap-1 text-sm transition-all hover:left-0"
                    >
                        View Full Schedule
                        <ChevronRight className="relative right-4 w-4 opacity-0 transition-opacity group-hover:right-0 group-hover:opacity-100" />
                    </StyledLink> */}
                </div>
                <ScheduleMatchView
                    match={
                        eventData?.schedule[
                            eventUserSettings[eventData.id].currentMatch
                        ]
                    }
                />
                <Button size="lg" onClick={() => setFormIsOpen(!formIsOpen)}>
                    Scout Now
                </Button>
            </div>
        </>
    )
}
