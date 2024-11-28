import { useAppContext } from "@/lib/context/appContext"
import { Event } from "@/lib/db"
import fetchTBA from "@/lib/fetchTBA"
import { useEffect, useState } from "react"
import { Heading } from "./ui/heading"
import { Paragraph } from "./ui/paragraph"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

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
    console.log("No events found")
    return events
}

export const EventSearcher = () => {
    const { connectionState } = useAppContext()
    const [eventsFound, setEventsFound] = useState<Event[]>()
    const [year, setYear] = useState()

    useEffect(() => {
        const search = async () => {
            const events = await searchEvents(connectionState, 155, 2024)
            console.log(events)
        }
        search()
    }, [])

    return (
        <div
            className={`relative flex flex-col rounded p-3 dark:bg-[#302E2E] ${
                !connectionState ? "cursor-not-allowed blur-xs" : ""
            }`}
        >
            <Heading>Event Searcher</Heading>
            <Paragraph className="text-sm">
                Input year, and search for events
            </Paragraph>
            <div className="mt-3 flex w-full gap-3">
                <Input placeholder="Year" />
                <Button size="md">Search</Button>
            </div>
            <span
                className={`absolute -bottom-4 left-0 text-xs ${
                    connectionState ? "hidden" : ""
                }`}
            >
                connect to internet to use
            </span>
        </div>
    )
}
