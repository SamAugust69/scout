import { ScheduleMatchView } from "@/components/ScheduleMatchView"
import { db } from "@/lib/db"
import { useLiveQuery } from "dexie-react-hooks"
import { useParams } from "react-router-dom"

export const EventSchedule = () => {
    const { id } = useParams()
    if (!id) throw new Error("ID doesn't exist")

    const events = useLiveQuery(() =>
        db.events.where("id").equalsIgnoreCase(id).toArray()
    )

    const eventData = events !== undefined ? events[0] : null

    return (
        <section className="mx-auto flex w-full max-w-2xl flex-col gap-2 p-4">
            <div className="flex flex-col gap-2 overflow-y-scroll rounded bg-neutral-100 px-4 py-3 dark:bg-[#302E2E]">
                {eventData?.schedule?.map((match, i) => {
                    return <ScheduleMatchView match={match} key={i} />
                })}
            </div>
        </section>
    )
}
