import { Event } from "@/lib/types/eventType"
import { Button } from "../ui/button"
import { LogForm } from "../forms/Form"
import { useState } from "react"
import { Heading } from "../ui/heading"
import { Paragraph } from "../ui/paragraph"
import { Log } from "../Log"

export const DashboardLogs = ({ eventData }: { eventData: Event | null }) => {
    if (!eventData) return

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [renderList, setRenderList] = useState<boolean>(false) // controls wether or not the list displays as a match group or a list

    return (
        <>
            <LogForm
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                eventData={eventData}
            />
            <div className="flex justify-end gap-2">
                <Button onClick={() => setRenderList(false)}></Button>
                <Button onClick={() => setRenderList(true)}></Button>
            </div>
            <div className="flex flex-col gap-4 rounded bg-neutral-100 p-4 dark:bg-[#302E2E]">
                <div className="">
                    <Heading>Quailifier 1</Heading>
                    <Paragraph>123, 13</Paragraph>
                </div>

                <div className="rounded bg-neutral-700 p-2"></div>
            </div>
            {eventData.match_logs.map(() => {
                return <Log renderAsListElement={renderList} />
            })}
            <Button onClick={() => setIsOpen(!isOpen)}>Scout</Button>
        </>
    )
}
