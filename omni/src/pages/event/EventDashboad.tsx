import { Dashboard } from "@/components/dashboardTabs/Dashboard"
import { DashboardLogs } from "@/components/dashboardTabs/DashboardLogs"
import { DashboardSettings } from "@/components/dashboardTabs/DashboardSettings"
import { Button, buttonVariants } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"

import { Heading } from "@/components/ui/heading"
import { Loader } from "@/components/ui/loader"
import { Paragraph } from "@/components/ui/paragraph"
import { db } from "@/lib/db"
import { useLocalStorage } from "@/lib/useLocalStorage"

import useMultiForm from "@/lib/useMultiForm"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { useLiveQuery } from "dexie-react-hooks"
import { ChevronLeft } from "lucide-react"
import { Link, useParams } from "react-router-dom"

export const EventDashboard = () => {
    const { id } = useParams()
    if (!id) throw new Error("ID doesn't exist")

    const events = useLiveQuery(() =>
        db.events.where("id").equalsIgnoreCase(id).toArray()
    )

    const eventData = events !== undefined ? events[0] : null
    const [match, setMatch] = useLocalStorage<{ [key: string]: any }>(
        {},
        "eventsCurrentMatch"
    )

    const editMatch = (key: string, value: number) => {
        setMatch({ ...match, [key]: value })
    }

    const tabs = ["Dashboard", "Logs", "Settings"]
    const { CurrentComponent, currentStepNumber, goToStep } = useMultiForm([
        Dashboard,
        DashboardLogs,
        DashboardSettings,
    ])

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
            <Divider className="mb-4" />

            {/* Main content */}
            <div className="mx-auto flex w-full flex-col justify-center gap-4 overflow-hidden">
                {events === undefined ? (
                    <Loader />
                ) : (
                    <>
                        <div>
                            {/* Tab navigation */}
                            <div className="flex gap-1 rounded bg-neutral-300 p-1 dark:bg-[#302E2E]">
                                {tabs.map((tab, i) => (
                                    <Button
                                        className={`w-full font-bold ${
                                            currentStepNumber === i
                                                ? "bg-neutral-100"
                                                : "bg-neutral-300 hover:bg-neutral-200 dark:bg-[#302E2E] dark:hover:bg-[#353434]"
                                        }`}
                                        key={i}
                                        onClick={() => goToStep(i)}
                                    >
                                        {tab}
                                    </Button>
                                ))}
                            </div>

                            {/* Event Info */}
                            <div className="flex items-center justify-between">
                                <Heading>{eventData?.name}</Heading>
                                <Paragraph size="sm">
                                    {eventData?.week && (
                                        <>Week {eventData?.week}</>
                                    )}
                                </Paragraph>
                            </div>
                        </div>

                        {/* Render current step */}
                        <CurrentComponent
                            eventData={eventData}
                            currentMatch={match}
                            editCurrentMatch={editMatch}
                        />
                    </>
                )}
            </div>
        </section>
    )
}
