import { ScheduleMatchView } from "@/components/ScheduleMatchView"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addNotification } from "@/components/ui/notifications"
import { db } from "@/lib/db"
import { MatchInfo } from "@/lib/types/eventType"
import { useLiveQuery } from "dexie-react-hooks"
import { createRef, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export const EventSchedule = () => {
    const { id } = useParams()
    if (!id) throw new Error("ID doesn't exist")

    const events = useLiveQuery(() =>
        db.events.where("id").equalsIgnoreCase(id).toArray()
    )
    const eventData = events !== undefined ? events[0] : null

    const [matchToSubmit, setMatchToSubmit] = useState<Partial<MatchInfo>>({})
    const [schedule, setSchedule] = useState<MatchInfo[]>([])

    const updateSchedule = (
        key: "red" | "blue",
        teamNumber: number,
        teamValue: number
    ) => {
        setMatchToSubmit((prev) => {
            var matchInfo = {
                ...prev,
                [key]: [...(prev[key] || [])],
            } as Partial<MatchInfo>

            if (matchInfo[key]) matchInfo[key][teamNumber] = String(teamValue)
            if (teamValue === 0 && matchInfo[key]) {
                const index = matchInfo[key].indexOf(String(teamNumber))

                if (index) matchInfo[key].splice(index, 1)
            }
            return matchInfo
        })
    }

    const submitMatchToSchedule = () => {
        if (
            !matchToSubmit.blue ||
            !matchToSubmit.red ||
            !([...matchToSubmit.blue, ...matchToSubmit.red].length === 6)
        ) {
            addNotification(
                "error",
                "Fill out all teams to submit",
                "Did Not Submit"
            )
            return
        }
        console.log("Submitting")
        const match: MatchInfo = {
            red: matchToSubmit.red,
            blue: matchToSubmit.blue,
            match_number: schedule.length + 1,
        }

        setSchedule((prev) => [...prev, match])

        console.log(match)
    }

    // swap stuff
    const [swapTarget, setSwapTarget] = useState<number>()
    const [swapTo, setSwapTo] = useState<number>()

    const handleDragStart = (index: number) => {
        setSwapTarget(index)
    }

    const handleDragOver = (index: number) => {
        setSwapTo(index)
    }

    useEffect(() => {
        eventData?.schedule && setSchedule(eventData.schedule)
    }, [eventData])

    const matchRef = createRef<HTMLInputElement>()
    return (
        <section className="mx-auto flex w-full max-w-2xl flex-col gap-2 p-4">
            <div className="grid grid-cols-2 justify-center gap-1 rounded bg-neutral-100 px-4 py-3 dark:bg-[#302E2E]">
                <div className="row-start-2 flex flex-col gap-1">
                    <Input
                        type="number"
                        className="box-border border-2 valid:border-transparent invalid:border-red-400 invalid:focus:ring-0 dark:bg-[#9A6364] dark:text-neutral-200 dark:placeholder:text-neutral-300"
                        placeholder="Team 1"
                        onChange={(e) =>
                            updateSchedule(
                                "red",
                                0,
                                Number(e.currentTarget.value)
                            )
                        }
                    />
                    <Input
                        onChange={(e) =>
                            updateSchedule(
                                "red",
                                1,
                                Number(e.currentTarget.value)
                            )
                        }
                        type="number"
                        className="box-border border-2 valid:border-transparent invalid:border-red-400 invalid:focus:ring-0 dark:bg-[#9A6364] dark:text-neutral-200 dark:placeholder:text-neutral-300"
                        placeholder="Team 1"
                    />
                    <Input
                        onChange={(e) =>
                            updateSchedule(
                                "red",
                                2,
                                Number(e.currentTarget.value)
                            )
                        }
                        type="number"
                        className="box-border border-2 valid:border-transparent invalid:border-red-400 invalid:focus:ring-0 dark:bg-[#9A6364] dark:text-neutral-200 dark:placeholder:text-neutral-300"
                        placeholder="Team 1"
                    />
                </div>
                <div className="row-start-2 flex flex-col gap-1">
                    <Input
                        onChange={(e) =>
                            updateSchedule(
                                "blue",
                                0,
                                Number(e.currentTarget.value)
                            )
                        }
                        type="number"
                        className="box-border border-2 valid:border-transparent invalid:border-red-400 invalid:focus:ring-0 dark:bg-[#63769A] dark:text-neutral-200 dark:placeholder:text-neutral-300"
                        placeholder="Team 1"
                    />
                    <Input
                        onChange={(e) =>
                            updateSchedule(
                                "blue",
                                1,
                                Number(e.currentTarget.value)
                            )
                        }
                        type="number"
                        className="box-border border-2 valid:border-transparent invalid:border-red-400 invalid:focus:ring-0 dark:bg-[#63769A] dark:text-neutral-200 dark:placeholder:text-neutral-300"
                        placeholder="Team 2"
                    />
                    <Input
                        onChange={(e) =>
                            updateSchedule(
                                "blue",
                                2,
                                Number(e.currentTarget.value)
                            )
                        }
                        type="number"
                        className="box-border border-2 valid:border-transparent invalid:border-red-400 invalid:focus:ring-0 dark:bg-[#63769A] dark:text-neutral-200 dark:placeholder:text-neutral-300"
                        placeholder="Team 3"
                    />
                </div>
                <Button className="col-span-2" onClick={submitMatchToSchedule}>
                    Submit
                </Button>
            </div>
            <div
                className={
                    "border-cool-green w-full rounded border-2 bg-neutral-200 dark:bg-[#302E2E]"
                }
            >
                <div className="rounded-t border-b-2 border-neutral-400 px-3 py-2 dark:border-neutral-900/50 dark:bg-[#272424]">
                    Qualifier {schedule.length + 1}
                </div>

                <div className="grid h-12 grid-cols-3 border-b-2 border-[#a37979] bg-[#be8d8e] px-3 py-2 dark:border-[#774B4C] dark:bg-[#9A6364]">
                    <Input
                        placeholder="Team 1"
                        type="number"
                        onChange={(e) =>
                            updateSchedule(
                                "red",
                                0,
                                Number(e.currentTarget.value)
                            )
                        }
                        className="no-spinner h-6 max-w-14 rounded-none border-b-2 bg-transparent p-0 invalid:border-red-400 valid:focus:ring-0 dark:border-neutral-200 dark:bg-transparent dark:text-neutral-200 dark:placeholder:text-neutral-400"
                    />
                    <Input
                        onChange={(e) =>
                            updateSchedule(
                                "red",
                                1,
                                Number(e.currentTarget.value)
                            )
                        }
                        placeholder="Team 2"
                        type="number"
                        className="no-spinner mx-auto h-6 max-w-14 rounded-none border-b-2 bg-transparent p-0 invalid:border-red-400 valid:focus:ring-0 dark:border-neutral-200 dark:bg-transparent dark:text-neutral-200 dark:placeholder:text-neutral-400"
                    />
                    <Input
                        onChange={(e) =>
                            updateSchedule(
                                "red",
                                2,
                                Number(e.currentTarget.value)
                            )
                        }
                        placeholder="Team 3"
                        type="number"
                        className="no-spinner ml-auto h-6 max-w-14 rounded-none border-b-2 bg-transparent p-0 invalid:border-red-400 valid:focus:ring-0 dark:border-neutral-200 dark:bg-transparent dark:text-neutral-200 dark:placeholder:text-neutral-400"
                    />
                </div>
                <div className="grid h-12 auto-cols-fr grid-flow-col justify-center gap-8 rounded-b bg-[#8898b8] px-3 py-2 dark:bg-[#63769A]">
                    <Input
                        placeholder="Team 1"
                        type="number"
                        onChange={(e) =>
                            updateSchedule(
                                "blue",
                                0,
                                Number(e.currentTarget.value)
                            )
                        }
                        className="no-spinner h-6 max-w-14 rounded-none border-b-2 bg-transparent p-0 invalid:border-red-400 valid:focus:ring-0 dark:border-neutral-200 dark:bg-transparent dark:text-neutral-200 dark:placeholder:text-neutral-400"
                    />
                    <Input
                        onChange={(e) =>
                            updateSchedule(
                                "blue",
                                1,
                                Number(e.currentTarget.value)
                            )
                        }
                        placeholder="Team 2"
                        type="number"
                        className="no-spinner mx-auto h-6 max-w-14 rounded-none border-b-2 bg-transparent p-0 invalid:border-red-400 valid:focus:ring-0 dark:border-neutral-200 dark:bg-transparent dark:text-neutral-200 dark:placeholder:text-neutral-400"
                    />
                    <Input
                        onChange={(e) =>
                            updateSchedule(
                                "blue",
                                2,
                                Number(e.currentTarget.value)
                            )
                        }
                        placeholder="Team 3"
                        type="number"
                        className="no-spinner ml-auto h-6 max-w-14 rounded-none border-b-2 bg-transparent p-0 invalid:border-red-400 valid:focus:ring-0 dark:border-neutral-200 dark:bg-transparent dark:text-neutral-200 dark:placeholder:text-neutral-400"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2 overflow-y-scroll rounded bg-neutral-100 px-4 py-3 dark:bg-[#302E2E]">
                {schedule.map((match, i) => {
                    return (
                        <ScheduleMatchView
                            draggable
                            match={match}
                            key={i}
                            className="cursor-grab"
                            onDragOver={() => handleDragOver(i)}
                            onDragStart={() => handleDragStart(i)}
                        />
                    )
                })}
            </div>
        </section>
    )
}
