import { Button, buttonVariants } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { addNotification } from "@/components/ui/notifications"
import { Paragraph } from "@/components/ui/paragraph"
import { db } from "@/lib/db"
import { Event } from "@/lib/types/eventType"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

export const CreateEventManual = () => {
    const location = useLocation()
    const [eventChanges, setEventChanges] = useState<Partial<Event>>(
        location.state ?? {}
    )
    const navigate = useNavigate()

    const createEvent = async () => {
        if (
            !eventChanges.year ||
            !eventChanges.name ||
            !eventChanges.event_code
        ) {
            addNotification("error", "Please fill in all required fields.")
            return
        }
        const newEvent: Event = {
            id: eventChanges.year + eventChanges.event_code,
            name: eventChanges.name,
            event_code: eventChanges.event_code,
            week: eventChanges.week,
            year: eventChanges.year,
            statistics: eventChanges.statistics ?? [],
            match_logs: eventChanges.match_logs ?? [],
            schedule: eventChanges.schedule ?? [],
        }
        if ((await db.events.get(newEvent.id)) !== undefined) {
            addNotification(
                "error",
                `Event with id ${newEvent.id} already exists.`
            )
            return
        }

        db.events
            .add(newEvent)
            .then(() => {
                addNotification(
                    "success",
                    `Created new event ${eventChanges.name}`
                )
                navigate(`/event/${newEvent.id}`)
            })
            .catch(() => addNotification("error", "Couldn't Create Event..."))
    }

    const updateChanges = (key: keyof Event, value: any) => {
        setEventChanges((prev) => {
            return { ...prev, [key]: value }
        })
    }

    return (
        <section className="mx-auto flex w-full max-w-xl flex-col gap-2 p-4">
            <div className="flex justify-between">
                <Dialog>
                    <DialogTrigger>
                        <Button
                            variant="link"
                            className="flex gap-2"
                            size="none"
                        >
                            <ChevronLeft className="w-4" /> Go Home
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            You'll lose all your progress
                        </DialogDescription>
                        <DialogFooter className="flex justify-between">
                            <Button size="md">Cancel</Button>
                            <DialogClose>
                                <Link
                                    to={"/"}
                                    className={cn(
                                        clsx(
                                            buttonVariants({
                                                variant: "primary",
                                                size: "md",
                                            })
                                        ),
                                        "bg-red-300 dark:bg-red-500"
                                    )}
                                >
                                    Lose Progress
                                </Link>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Paragraph className="mb-1 font-bold">Create Event</Paragraph>
            </div>
            <span className="mb-4 h-0.5 w-full rounded-sm bg-[#7C8C77]"></span>
            {/* content */}

            {/* id: eventInfo.year + eventInfo.event_code,
                name: eventInfo.name,
                event_code: eventInfo.event_code,
                week: eventInfo.week,
                year: eventInfo.year,
                statistics: [],
                match_logs: [],
                schedule: [], */}

            <div className="mx-auto flex w-full flex-col justify-center gap-4">
                <Heading>New Event</Heading>
                <div className="grid gap-2 md:grid-cols-2 md:grid-rows-2">
                    <div className="">
                        <Paragraph size="sm">Event Name</Paragraph>
                        <Input
                            className="bg-neutral-300"
                            defaultValue={eventChanges.name}
                            onChange={(e) =>
                                updateChanges("name", e.currentTarget.value)
                            }
                            required
                        />
                    </div>
                    <div className="">
                        <Paragraph size="sm">Event Code</Paragraph>
                        <Input
                            className="bg-neutral-300"
                            defaultValue={eventChanges.event_code}
                            onChange={(e) =>
                                updateChanges(
                                    "event_code",
                                    e.currentTarget.value
                                )
                            }
                        />
                        <Paragraph size="xs">
                            Dictates what API searches for
                        </Paragraph>
                    </div>
                    <div className="">
                        <Paragraph size="sm">Week</Paragraph>
                        <Input
                            className="bg-neutral-300"
                            defaultValue={eventChanges.week}
                            onChange={(e) =>
                                updateChanges("week", e.currentTarget.value)
                            }
                        />
                    </div>
                    <div className="">
                        <Paragraph size="sm">Year</Paragraph>
                        <Input
                            className="bg-neutral-300"
                            defaultValue={eventChanges.year}
                            onChange={(e) =>
                                updateChanges("year", e.currentTarget.value)
                            }
                        />
                    </div>
                </div>

                <Button size="lg" onClick={createEvent}>
                    Create Event
                </Button>
            </div>
        </section>
    )
}
