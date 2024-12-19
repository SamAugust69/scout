import { Dashboard } from "@/components/dashboardTabs/Dashboard"
import { DashboardLogs } from "@/components/dashboardTabs/DashboardLogs"
import { DashboardSettings } from "@/components/dashboardTabs/DashboardSettings"
import { Button, buttonVariants } from "@/components/ui/button"

import { Heading } from "@/components/ui/heading"
import { Loader } from "@/components/ui/loader"
import { addNotification } from "@/components/ui/notifications"
import { Paragraph } from "@/components/ui/paragraph"
import { db } from "@/lib/db"
import { Event } from "@/lib/types/eventType"

import useMultiForm from "@/lib/useMultiForm"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { ChevronLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

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
        if (eventData.length <= 0) addNotification("error", "No Log Found")
        setEventData(eventData[0])
    }

    useEffect(() => {
        getEventData()
    }, [])

    const tabs = ["Dashboard", "Logs", "Settings"]
    const { currentStep, currentStepNumber, goToStep } = useMultiForm([
        <Dashboard eventData={eventData} />,
        <DashboardLogs eventData={eventData} />,
        <DashboardSettings eventData={eventData} />,
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
            <span className="mb-4 h-0.5 w-full rounded-sm bg-[#7C8C77]"></span>
            {/* content */}
            <div className="mx-auto flex w-full flex-col justify-center gap-4 overflow-hidden">
                {!eventData ? (
                    <Loader />
                ) : (
                    <>
                        {/* <Link
                            to={"./scout"}
                            className={cn(
                                clsx(
                                    buttonVariants({
                                        variant: "primary",
                                        size: "default",
                                    }),
                                    "flex items-center gap-2"
                                )
                            )}
                        >
                            Scout
                        </Link> */}
                        <div className="">
                            <div className="flex gap-1 rounded bg-neutral-300 p-1 dark:bg-[#302E2E]">
                                {tabs.map((tab, i) => {
                                    return (
                                        <Button
                                            className={`w-full font-bold ${currentStepNumber === i ? "bg-neutral-100" : "bg-neutral-300 hover:bg-neutral-200 dark:bg-[#302E2E] dark:hover:bg-[#353434]"}`}
                                            key={i}
                                            onClick={() => goToStep(i)}
                                        >
                                            {tab}
                                        </Button>
                                    )
                                })}
                            </div>
                            <div className="flex items-center justify-between">
                                <Heading>{eventData?.name}</Heading>
                                <Paragraph size="sm">
                                    {eventData?.week && (
                                        <>Week {eventData?.week}</>
                                    )}
                                </Paragraph>
                            </div>
                        </div>
                        {currentStep}
                    </>
                )}
            </div>
        </section>
    )
}
