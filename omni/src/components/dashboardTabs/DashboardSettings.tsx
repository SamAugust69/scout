import { Event, MatchInfo } from "@/lib/types/eventType"
import { Heading } from "../ui/heading"
import { Input } from "../ui/input"
import { Paragraph } from "../ui/paragraph"
import { Button } from "../ui/button"
import fetchTBA from "@/lib/fetchTBA"
import { addNotification } from "../ui/notifications"
import { useEffect, useState } from "react"
import { Search, View } from "lucide-react"
import { useAppContext } from "@/lib/context/appContext"
import { db } from "@/lib/db"

const pullSchedules = async (key: string): Promise<MatchInfo[] | null> => {
    const data: any[] | null = await fetchTBA({
        url: `https://www.thebluealliance.com/api/v3/event/${key}/matches/simple`,
    }).catch(() => addNotification("error", "SAMUEL"))

    if (!data) return null
    addNotification("success", "Search complete")

    const formatted: MatchInfo[] = data.reduce((result, match) => {
        if (match.comp_level !== "qm") return result
        return [
            ...result,
            {
                match_number: match.match_number,
                red: match.alliances.red.team_keys.map((team: string) =>
                    team.replace("frc", "")
                ),
                blue: match.alliances.blue.team_keys.map((team: string) =>
                    team.replace("frc", "")
                ),
            },
        ]
    }, [])
    return formatted.sort((a, b) => {
        if (a.match_number < b.match_number) return -1
        if (a.match_number > b.match_number) return 1
        return 0
    })
}

export const DashboardSettings = ({
    eventData,
}: {
    eventData: Event | null
}) => {
    if (!eventData) return

    const [schedule, setSchedule] = useState<MatchInfo[]>(eventData.schedule)
    const { connectionState } = useAppContext()

    const getScheduleFromAPI = async () => {
        const key = `${eventData?.year}${eventData?.event_code}`
        const schedule = await pullSchedules(key)
        if (schedule) {
            db.events.update(eventData, { ...eventData, schedule: schedule })
            setSchedule(schedule)
        }
    }

    useEffect(() => {
        console.log(eventData.schedule)
    }, [])

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
                <Paragraph size="sm">Schedule</Paragraph>
                <div
                    className={`flex items-center justify-between rounded ${schedule?.length <= 0 ? "border-2" : ""} border-red-400 bg-neutral-300 px-3 py-2 dark:bg-neutral-800`}
                >
                    {schedule?.length} Matches
                    <div className="flex gap-4">
                        <Button onClick={() => getScheduleFromAPI()}>
                            <Search className="w-5" />
                        </Button>
                        <Button>
                            <View className="w-5" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 overflow-y-scroll rounded bg-neutral-100 px-4 py-3 dark:bg-[#302E2E]">
                {schedule?.map((match, i) => {
                    return (
                        <div
                            className="rounded bg-neutral-200 dark:bg-[#272424]"
                            key={i}
                        >
                            <div className="border-b-2 border-neutral-400 px-3 py-2 dark:border-neutral-900/50">
                                Qualifier {match.match_number}
                            </div>
                            <div className="grid h-12 grid-cols-3 border-b-2 border-[#774B4C] bg-[#9A6364] px-3 py-2">
                                <p>{match.red[0]}</p>
                                <p className="text-center">{match.red[1]}</p>
                                <p className="text-right">{match.red[2]}</p>
                            </div>
                            <div className="grid h-12 grid-cols-3 rounded-b bg-[#63769A] px-3 py-2">
                                <p>{match.blue[0]}</p>
                                <p className="text-center">{match.blue[1]}</p>
                                <p className="text-right">{match.blue[2]}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
