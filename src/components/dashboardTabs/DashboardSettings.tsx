import { Event, MatchInfo, MatchLog } from "@/lib/types/eventType"
import { Heading } from "../ui/heading"
import { Input } from "../ui/input"
import { Paragraph } from "../ui/paragraph"
import { Button } from "../ui/button"
import fetchTBA from "@/lib/fetchTBA"
import { addNotification } from "../ui/notifications"
import { createRef, useEffect, useState } from "react"
import { Download, Import, Search, View } from "lucide-react"
import { useAppContext } from "@/lib/context/appContext"
import { db } from "@/lib/db"
import { Divider } from "../ui/divider"
import { StyledLink } from "../StyledLink"
import { EventSettings } from "@/lib/types/eventSettings"
import { getLogs } from "@/lib/getLogs"
import { Log, logConfig } from "../forms/formConfig"
import { ExportLogs } from "../ExportLogs"
import { ExportLogsWebsocket } from "../ExportLogsWebsocket"
import {
    Accordion,
    AccordionItem,
    AccordionItemContent,
    AccordionLabel,
} from "../ui/accordion"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { Navigate } from "react-router-dom"

const pullSchedules = async (key: string): Promise<MatchInfo[] | null> => {
    const data: any[] | null = await fetchTBA({
        url: `https://www.thebluealliance.com/api/v3/event/${key}/matches/simple`,
    }).catch(() => addNotification("error", "SAMUEL"))

    console.log(data)
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
    eventUserSettings,
    editEventUserSettings,
}: {
    eventData: Event | null
    eventUserSettings: { [key: string]: EventSettings }
    editEventUserSettings: (key: string, value: Partial<EventSettings>) => void
}) => {
    if (!eventData) return

    // Schedule stuff

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

    // user settings stuff

    const [eventUserChanges, setEventUserChanges] = useState<
        Partial<EventSettings>
    >({})

    useEffect(() => {
        console.log("changes", eventUserChanges)
    }, [eventUserChanges])

    const onChange = <T extends keyof EventSettings>(
        key: keyof Partial<EventSettings>,
        value: EventSettings[T]
    ) => {
        // const target = e.target as HTMLInputElement;

        setEventUserChanges((prev) => ({ ...prev, [key]: value }))
    }

    const saveEventUserSettings = () => {
        setEventUserChanges({})
        editEventUserSettings(eventData.id, eventUserChanges)
    }

    const exportEvent = () => {
        const blob = new Blob([JSON.stringify(eventData, null, 2)], {
            type: "application/json",
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.download = eventData.id
        a.href = url
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    const deleteDuplicateData = () => {
        const allLogs = getLogs(eventData.match_logs)
        const filteredLogs: Log<keyof typeof logConfig>[] = []

        const seenIds = new Set<string>()

        allLogs.map((log) => {
            if (seenIds.has(log.id)) return
            filteredLogs.push(log)
            seenIds.add(log.id)
        })

        // Find the match in eventData
        var logsAsMatchLogs: MatchLog[] = []

        filteredLogs.map((log) => {
            const matchInfo = logsAsMatchLogs.find(
                (match) => match.matchNumber === log.match
            )

            const newMatch: MatchLog = {
                matchNumber: log.match,
                logs: [log],
                statistics: { autoAverage: 0, teleopAverage: 0 },
            }

            if (!matchInfo) {
                console.log("No match data found, creating new match")
                logsAsMatchLogs = [...logsAsMatchLogs, newMatch]
            } else {
                console.log("Match data found, updating existing match")
                const updatedMatchInfo = {
                    ...matchInfo,
                    logs: [...matchInfo.logs, log],
                }

                logsAsMatchLogs = [
                    ...logsAsMatchLogs.filter(
                        (match) => match.matchNumber !== log.match
                    ),
                    updatedMatchInfo,
                ]
            }
        })

        // Update the database

        db.events.update(eventData.id, {
            ...eventData,
            match_logs: logsAsMatchLogs,
        })
        return filteredLogs
    }

    const importScheduleRef = createRef<HTMLInputElement>()

    const uploadSchedule = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const fileReader = new FileReader()

        if (!fileReader) return

        fileReader.readAsText(files[0])

        fileReader.onload = (e) => {
            db.events.update(eventData, {
                ...eventData,
                schedule: JSON.parse(e.target?.result as string),
            })
        }
    }

    const exportSchedule = () => {
        const blob = new Blob([JSON.stringify(eventData.schedule, null, 2)], {
            type: "application/json",
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.download = `${eventData.id}Schedule`
        a.href = url
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }
    const deleteEvent = () => {
        db.events.delete(eventData.id)
        Navigate({ to: "/" })
        addNotification("default", "Deleted event")
    }

    return (
        <>
            <div className="rounded bg-neutral-100 p-4 dark:bg-[#302E2E]">
                <div className="flex flex-col">
                    <Heading>Schedule</Heading>
                    <div
                        className={`flex items-center justify-between rounded ${schedule?.length <= 0 ? "border-2" : ""} border-red-400 bg-neutral-300 px-3 py-2 dark:bg-neutral-800`}
                    >
                        {schedule?.length} Matches
                        <div className="flex gap-4">
                            <input
                                onChange={uploadSchedule}
                                className="hidden"
                                type="file"
                                ref={importScheduleRef}
                            />
                            <Button
                                onClick={exportSchedule}
                                className="py-2"
                                disabled={schedule?.length <= 0}
                            >
                                <Download className="w-5" />
                            </Button>
                            <Button
                                onClick={() =>
                                    importScheduleRef.current?.click()
                                }
                            >
                                <Import className="w-5" />
                            </Button>
                            <Button
                                onClick={() => getScheduleFromAPI()}
                                disabled={!connectionState}
                            >
                                <Search className="w-5" />
                            </Button>
                            <StyledLink to={"./schedule"}>
                                <View className="w-5" />
                            </StyledLink>
                        </div>
                    </div>
                </div>
                <Divider className="my-4" />
                <div className="flex flex-col gap-2">
                    <Heading>User Settings</Heading>
                    <div>
                        <Paragraph size="sm">Tablet Number</Paragraph>
                        <Input
                            className="bg-neutral-300"
                            type="number"
                            defaultValue={
                                eventUserSettings[eventData.id].tabletNumber
                            }
                            onChange={(e) =>
                                onChange(
                                    "tabletNumber",
                                    parseInt(e.target.value)
                                )
                            }
                        ></Input>
                    </div>
                    <div>
                        <Paragraph size="sm">Current Match</Paragraph>
                        <Input
                            className="bg-neutral-300"
                            type="number"
                            defaultValue={
                                eventUserSettings[eventData.id].currentMatch
                            }
                            onChange={(e) =>
                                onChange(
                                    "currentMatch",
                                    parseInt(e.target.value)
                                )
                            }
                        ></Input>
                    </div>
                    <div>{/* <Toggle>Test</Toggle> */}</div>
                    {Object.keys(eventUserChanges).length > 0 ? (
                        <Button onClick={saveEventUserSettings}>Save</Button>
                    ) : null}
                </div>
                <Divider className="my-4" />
                <div className="flex flex-col gap-2">
                    <Heading>Event Settings</Heading>

                    <div className="">
                        <Paragraph size="sm">Name</Paragraph>
                        <Input
                            className="bg-neutral-300"
                            placeholder={eventData.name}
                        />
                    </div>
                    <div className="">
                        <Paragraph size="sm">Code</Paragraph>
                        <Input
                            className="bg-neutral-300"
                            placeholder={eventData.event_code}
                        />
                    </div>
                    <div className="flex justify-center gap-2">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="relative flex flex-col items-center justify-center"
                            onClick={() =>
                                db.events.update(eventData, {
                                    ...eventData,
                                    match_logs: [],
                                })
                            }
                        >
                            Delete All Logs{" "}
                            <span className="absolute bottom-0.5 text-xs font-bold dark:text-neutral-400">
                                {eventData.match_logs.length} Logs
                            </span>
                        </Button>
                        <Button onClick={deleteDuplicateData}>
                            Delete Duplicates
                        </Button>
                        {/* <Button size="lg" variant="secondary">
                            Delete All Logs{" "}
                            <span>{eventData.match_logs.length}</span>
                        </Button> */}
                        <Dialog>
                            <DialogTrigger>
                                <Button>Delete Event</Button>
                            </DialogTrigger>
                            <DialogContent className="">
                                <DialogTitle>Delete Event?</DialogTitle>
                                <DialogDescription>
                                    Are you really sure you wanna delete this
                                    event?
                                </DialogDescription>
                                <DialogFooter className="flex justify-between">
                                    <Button onClick={() => deleteEvent()}>
                                        Delete
                                    </Button>
                                    <DialogClose>
                                        <Button>Close</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 rounded bg-neutral-100 px-4 py-3 dark:bg-[#302E2E]">
                <Heading className="">Export Event Logs</Heading>
                <div className="flex flex-col gap-2">
                    <Button onClick={exportEvent}>Export To .json</Button>
                    <Button
                        onClick={() =>
                            addNotification(
                                "error",
                                "Havent added this feature yet, try exporting to .json",
                                "Sorry!"
                            )
                        }
                    >
                        Export With QR
                    </Button>
                </div>
                <Accordion className="border-neutral-600">
                    <AccordionItem isOpen>
                        <AccordionLabel className="bg-neutral-700">
                            Experimental Export (RESTful)
                        </AccordionLabel>
                        <AccordionItemContent>
                            <ExportLogs
                                eventData={eventData}
                                eventUserSettings={eventUserSettings}
                                editEventUserSettings={editEventUserSettings}
                            />
                        </AccordionItemContent>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionLabel className="bg-neutral-700">
                            Legacy Export (wss)
                        </AccordionLabel>
                        <AccordionItemContent>
                            <ExportLogsWebsocket eventData={eventData} />
                        </AccordionItemContent>
                    </AccordionItem>
                </Accordion>
            </div>
            {/* <img src={confetti} /> */}
        </>
    )
}
