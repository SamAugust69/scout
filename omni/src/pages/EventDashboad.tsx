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
import { Loader } from "@/components/ui/loader"
import { Paragraph } from "@/components/ui/paragraph"
import { db, Event } from "@/lib/db"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { ChevronLeft, Dot } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useLoaderData, useParams } from "react-router-dom"

export const EventDashboard = () => {
    const { id } = useParams()
    if (!id) throw new Error("ID doesnt exist")

    const [eventData, setEventData] = useState<Event | null>(null)

    const getEventData = async () => {
        const eventData = await db.events
            .where("id")
            .equalsIgnoreCase(id)
            .toArray()

        console.log(eventData)
        setEventData(eventData[0])
    }

    useEffect(() => {
        getEventData()
    }, [])

    return (
        <section className="mx-auto flex w-full max-w-2xl flex-col gap-2 p-4">
            <div className="flex justify-between">
                <Link
                    to={"/"}
                    className={cn(
                        clsx(
                            buttonVariants({
                                variant: "link",
                                size: "none",
                            }),
                            "flex items-center gap-2"
                        )
                    )}
                >
                    <ChevronLeft className="w-4" /> Go Home
                </Link>
                <Paragraph className="mb-1 font-bold">
                    Event Dashboard
                </Paragraph>
            </div>
            <span className="mb-4 h-0.5 w-full rounded-sm bg-[#7C8C77]"></span>
            {/* content */}
            <div className="mx-auto flex w-full flex-col justify-center gap-2">
                <div className="flex rounded bg-neutral-300 p-1">
                    <Button className="w-full font-bold">Test</Button>
                    <Button className="w-full bg-neutral-300 font-bold">
                        Settings
                    </Button>
                </div>
                <div className="rounded bg-neutral-100 p-2">
                    {!eventData ? (
                        <Loader />
                    ) : (
                        <>
                            <div>
                                <Heading>{eventData?.name}</Heading>
                                <Paragraph size="sm">
                                    {eventData?.week && (
                                        <>Week {eventData?.week}</>
                                    )}
                                </Paragraph>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}
