import { Button, buttonVariants } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Paragraph } from "@/components/ui/paragraph"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { Dot, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"

export const Home = () => {
    const events = useLiveQuery(async () => {
        return await db.events.toArray()
    })

    return (
        <section className="mx-auto flex w-full max-w-xl min-w-96 flex-col gap-2 p-4">
            <Paragraph className="mb-1 text-end font-bold">Home</Paragraph>
            <span className="mb-4 h-0.5 w-full rounded-sm bg-[#7C8C77]"></span>
            <div className="mx-auto flex w-full flex-col justify-center gap-4">
                <div>
                    <Heading size="lg">Select an Event!</Heading>
                    {/* changing text */}
                    {events && events.length < 0 ? (
                        <Paragraph>
                            No events?{" "}
                            <Link
                                to={"/create"}
                                className={cn(
                                    clsx(
                                        buttonVariants({
                                            variant: "link",
                                            size: "none",
                                        })
                                    ),
                                    "underline"
                                )}
                            >
                                Create one
                            </Link>{" "}
                            below
                        </Paragraph>
                    ) : (
                        <Paragraph>Select an event and get scouting!</Paragraph>
                    )}
                </div>
                {events && events?.length > 0 ? (
                    <div className="flex flex-col gap-3 rounded bg-neutral-100 p-2 dark:bg-[#302E2E]">
                        {events?.map((event) => {
                            return (
                                <Link
                                    to={`event/${event.id} `}
                                    className={cn(
                                        clsx(
                                            buttonVariants({
                                                variant: "secondary",
                                                size: "xl",
                                            })
                                        ),
                                        "flex w-full flex-col items-center justify-center font-bold"
                                    )}
                                >
                                    {event.name}
                                    <Paragraph
                                        size="xs"
                                        className="flex h-4 items-center"
                                    >
                                        {event.year} <Dot /> {event.event_code}
                                    </Paragraph>
                                </Link>
                            )
                        })}
                    </div>
                ) : null}
                <Link
                    to="/create"
                    className={cn(
                        clsx(
                            buttonVariants({ variant: "primary", size: "lg" })
                        ),
                        "flex w-full items-center justify-center gap-2"
                    )}
                >
                    Add Event
                    <Plus className="w-4" />
                </Link>
            </div>
        </section>
    )
}
