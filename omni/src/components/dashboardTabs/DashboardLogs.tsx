import { Event } from "@/lib/types/eventType"
import { Button } from "../ui/button"
import { LogForm } from "../forms/Form"
import { useState } from "react"

export const DashboardLogs = ({ eventData }: { eventData: Event | null }) => {
    if (!eventData) return

    const [isOpen, setIsOpen] = useState<boolean>(true)

    return (
        <div>
            <div>logs</div>
            <Button size="xl" onClick={() => setIsOpen(!isOpen)}>
                Scout
            </Button>
            <LogForm
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                year={eventData.year}
            />
        </div>
    )
}
