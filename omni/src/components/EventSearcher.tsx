import { useAppContext } from "@/lib/context/appContext"
import { db, Event } from "@/lib/db"
import fetchTBA from "@/lib/fetchTBA"
import { useState } from "react"
import { Heading } from "./ui/heading"
import { Paragraph } from "./ui/paragraph"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { ChevronRight } from "lucide-react"
import { EventButton } from "./EventButton"
import { useNavigate } from "react-router-dom"

const searchEvents = async (
    connectionState: boolean,
    team: number,
    year: number
): Promise<Event[] | null> => {
    if (!connectionState) return null
    // search for event keys
    var eventKeys = await fetchTBA({
        url: `https://www.thebluealliance.com/api/v3/team/frc${team}/events/${year}/keys`,
        onErr: (e: any) => console.log("issue", e),
    }).then((res: Array<string>) => {
        return res
    })

    var events: Array<any> = []

    if (eventKeys == undefined) return null

    await Promise.all(
        eventKeys.map(async (key) => {
            var event = await fetchTBA({
                url: `https://www.thebluealliance.com/api/v3/event/${key}`,
            })
            events = [...events, event]
        })
    )
    return events
}

export const EventSearcher = () => {
    const { connectionState } = useAppContext()
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const { settings } = useAppContext()

    const [eventsFound, setEventsFound] = useState<Event[]>()
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

    const navigate = useNavigate()

    const search = async () => {
        const events = await searchEvents(
            connectionState,
            parseInt(settings ? settings.team || "0" : "0"),
            year
        )
        events && setEventsFound(events)
    }

    const selectEvent = (eventInfo: Event) => {
        if (eventInfo == selectedEvent) {
            const newEvent: Event = {
                id: eventInfo.year + eventInfo.event_code,
                name: eventInfo.name,
                event_code: eventInfo.event_code,
                week: eventInfo.week,
                year: eventInfo.year,
                logs: [],
                statistics: [],
            }
            db.events
                .add(newEvent)
                .then(() =>
                    navigate(`/event/${eventInfo.year + eventInfo.event_code}`)
                )
        }
        setSelectedEvent(eventInfo)
    }

    return (
        <div
            className={`relative flex flex-col gap-4 rounded bg-neutral-100 p-3 dark:bg-[#302E2E] ${!connectionState ? "select-none" : ""}`}
        >
            <div
                className={`absolute top-0 left-0 h-full w-full cursor-not-allowed bg-red-100/25 select-none ${connectionState ? "hidden" : ""}`}
            ></div>
            <div>
                <Heading>Event Searcher</Heading>
                <Paragraph className="text-sm">
                    Input year, and search for events
                </Paragraph>
            </div>
            <div className="relative flex w-full gap-3">
                <Input
                    placeholder="Year"
                    className="bg-neutral-200"
                    defaultValue={year}
                    type="number"
                    onChange={(e) => setYear(parseInt(e.target.value))}
                />
                <span className="absolute -bottom-4 left-1 text-xs">
                    {settings?.team ?? "No Team Configured"}
                </span>
                <Button size="md" variant="secondary" onClick={() => search()}>
                    Search
                </Button>
            </div>
            <div className="flex flex-col gap-2">
                {eventsFound?.map((eventInfo, i) => {
                    return (
                        <EventButton
                            eventInfo={eventInfo}
                            i={i}
                            selectEvent={selectEvent}
                            selectedEvent={selectedEvent}
                        />
                    )
                })}
            </div>
            <span
                className={`absolute -bottom-4 left-0 text-xs text-red-500 ${
                    connectionState ? "hidden" : ""
                }`}
            >
                connect to the internet to use
            </span>
        </div>
    )
}
