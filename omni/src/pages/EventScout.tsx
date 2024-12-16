import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { addNotification } from "@/components/ui/notifications"
import { db } from "@/lib/db"
import { Event } from "@/lib/types/eventType"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export const EventScout = () => {
    const { id } = useParams()
    if (!id) throw new Error("ID doesnt exist")
    const [eventData, setEventData] = useState<Event | null>(null)

    const getEventData = async () => {
        const eventData = await db.events
            .where("id")
            .equalsIgnoreCase(id)
            .toArray()

        console.log(eventData)
        if (eventData.length <= 0) addNotification("error", "No Log Found")
        setEventData(eventData[0])
    }

    useEffect(() => {
        getEventData()
    }, [])

    if (!eventData) return <div>Loading...</div>

    return (
        <div className="mx-auto flex flex-col justify-center gap-4">
            <Heading>Scouting for {eventData?.name}</Heading>
            <Button>create new log</Button>
        </div>
    )
}
