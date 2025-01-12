import { Event } from "@/lib/types/eventType"
import { LogForm } from "../forms/Form"
import { useState } from "react"
import { Heading } from "../ui/heading"
import { Button } from "../ui/button"

export const DashboardLogs = ({ eventData }: { eventData: Event | null }) => {
    if (!eventData) return

    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <>
            <LogForm
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                eventData={eventData}
            />
            <div className="rounded bg-neutral-100 px-4 py-3 dark:bg-[#302E2E]">
                <Heading>Match</Heading>

                <div className="rounded bg-neutral-700 p-2"></div>
            </div>
            <Button onClick={() => setIsOpen(!isOpen)}>Scout</Button>
        </>
    )
}
