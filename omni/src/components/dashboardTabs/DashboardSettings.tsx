import { Event } from "@/lib/types/eventType"
import { Heading } from "../ui/heading"
import { Input } from "../ui/input"
import { Paragraph } from "../ui/paragraph"
import { Button } from "../ui/button"
import fetchTBA from "@/lib/fetchTBA"
import { addNotification } from "../ui/notifications"
import { useEffect, useState } from "react"

type Schedule = {
    red: string[]
    blue: string[]
}

const pullSchedules = async (key: string): Promise<Schedule[] | null> => {
    const data: any[] | null = await fetchTBA({
        url: `https://www.thebluealliance.com/api/v3/event/${key}/matches/simple`,
    }).catch(() => addNotification("error", "SAMUEL"))

    if (!data) return null

    const formatted: Schedule[] = data.reduce((result, match) => {
        return [
            ...result,
            {
                red: match.alliances.red.team_keys,
                blue: match.alliances.blue.team_keys,
            },
        ]
    }, [])
    return formatted
}

export const DashboardSettings = ({
    eventData,
}: {
    eventData: Event | null
}) => {
    if (!eventData) return

    const [schedule, setSchedule] = useState<Schedule[] | null>(null)

    useEffect(() => {
        getScheduleFromAPI()
    }, [])

    const getScheduleFromAPI = async () => {
        setSchedule(
            await pullSchedules(`${eventData?.year}${eventData?.event_code}`)
        )
    }
    return (
        <>
            <div className="rounded bg-neutral-100 px-4 py-3 dark:bg-[#302E2E]">
                <Heading>User Settings</Heading>
                <div className="py-2">
                    <Paragraph size="sm">Tablet Number</Paragraph>
                    <Input className="bg-neutral-300"></Input>
                </div>
                <span className="bg-cool-green my-2 block h-0.5 w-full rounded"></span>
                <Heading className="mb-2">Event Settings</Heading>
                <div className="rounded border border-red-400 px-3 py-4">
                    no schedule
                </div>
                <Button
                    onClick={() =>
                        pullSchedules(
                            `${eventData?.year}${eventData?.event_code}`
                        )
                    }
                >
                    Search
                </Button>
            </div>
            <div className="flex flex-col gap-2 overflow-y-scroll rounded bg-neutral-100 px-4 py-3 dark:bg-[#302E2E]">
                {schedule?.map((match, i) => {
                    return (
                        <div className="rounded dark:bg-[#272424]">
                            <div className="border-b-2 border-neutral-900/50 px-3 py-2">
                                Qualifier {i + 1}
                            </div>
                            <div className="grid h-12 grid-cols-3 border-b-2 px-3 py-2 dark:border-[#774B4C] dark:bg-[#9A6364]">
                                <p>1</p>
                                <p className="text-center">2</p>
                                <p className="text-right">3</p>
                            </div>
                            <div className="grid h-12 grid-cols-3 rounded-b px-3 py-2 dark:bg-[#63769A]">
                                <p>1</p>
                                <p className="text-center">2</p>
                                <p className="text-right">3</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
