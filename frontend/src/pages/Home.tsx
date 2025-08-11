import { buttonVariants } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Paragraph } from "@/components/ui/paragraph"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { Dot, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"
import { Event } from "@/lib/types/eventType"
import { Page, PageContent, PageHeader } from "@/components/ui/page"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionLabel,
} from "@/components/ui/accordion"

export const Home = () => {
    const eventsYear = useLiveQuery(async () => {
        const events = await db.events.toArray()

        const eventsYear = new Map<number, Event[]>()

        events.every((event) =>
            eventsYear.set(event.year, [
                ...(eventsYear.get(event.year) || []),
                event,
            ])
        )
        return eventsYear
    })

    return (
        <Page>
            <PageHeader title="Home" />
            <PageContent className="flex flex-col gap-4">
                <div>
                    <Heading size="lg">Select an Event!</Heading>
                    {/* changing text */}
                    {eventsYear && eventsYear.size < 0 ? (
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

                {eventsYear && (
                    <Accordion>
                        {[...eventsYear.entries()]
                            .sort((a, b) => b[0] - a[0])
                            .map(([year, events]) => {
                                return (
                                    <AccordionItem
                                        isOpen={
                                            year === new Date().getFullYear()
                                        }
                                    >
                                        <AccordionLabel>{year}</AccordionLabel>
                                        <AccordionContent className="flex flex-col gap-2">
                                            {events.map((event) => {
                                                return (
                                                    <Link
                                                        key={event.id}
                                                        to={`event/${event.id} `}
                                                        className={cn(
                                                            clsx(
                                                                buttonVariants({
                                                                    variant:
                                                                        "secondary",
                                                                    size: "xl",
                                                                })
                                                            ),
                                                            "flex w-full flex-col justify-center font-bold sm:items-center"
                                                        )}
                                                    >
                                                        <Paragraph className="w-full truncate text-left sm:text-center">
                                                            {event.name}
                                                        </Paragraph>
                                                        <Paragraph
                                                            size="xs"
                                                            className="flex h-4 w-full items-center justify-start sm:justify-center"
                                                        >
                                                            {event.year} <Dot />{" "}
                                                            {event.event_code}
                                                        </Paragraph>
                                                    </Link>
                                                )
                                            })}
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            })}
                    </Accordion>
                )}
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
            </PageContent>
        </Page>
    )
}
