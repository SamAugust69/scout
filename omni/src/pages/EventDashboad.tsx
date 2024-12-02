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
import { Paragraph } from "@/components/ui/paragraph"
import { db } from "@/lib/db"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { ChevronLeft } from "lucide-react"
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

        console.log(eventData[0])

        // setEventData(eventData[0])
    }

    useEffect(() => {
        getEventData()
    }, [])

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
            <div className="mx-auto flex w-full flex-col justify-center gap-8"></div>
        </section>
    )
}
