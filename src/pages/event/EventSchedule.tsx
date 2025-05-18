import { ScheduleMatchView } from "@/components/ScheduleMatchView"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addNotification } from "@/components/ui/notifications"
import { db } from "@/lib/db"
import { MatchInfo } from "@/lib/types/eventType"
import { useLiveQuery } from "dexie-react-hooks"
import { GripVertical, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export const EventSchedule = () => {
    const { id } = useParams()
    if (!id) throw new Error("ID doesn't exist")

    const events = useLiveQuery(() =>
        db.events.where("id").equalsIgnoreCase(id).toArray()
    )
    const eventData = events?.[0] ?? null

    const [matchToSubmit, setMatchToSubmit] = useState<Partial<MatchInfo>>({})
    const [schedule, setSchedule] = useState<MatchInfo[]>([])

    useEffect(() => {
        if (eventData?.schedule) {
            setSchedule(eventData.schedule)
        }
    }, [eventData])

    const updateSchedule = (
        key: "red" | "blue",
        index: number,
        value: number
    ) => {
        setMatchToSubmit((prev) => {
            const updated = {
                ...prev,
                [key]: [...(prev[key] || [])],
            } as MatchInfo
            if (value > 0) {
                updated[key][index] = String(value)
            } else {
                updated[key][index] = ""
            }
            return updated
        })
    }

    const submitMatchToSchedule = async () => {
        const red = matchToSubmit.red ?? []
        const blue = matchToSubmit.blue ?? []

        if ([...red, ...blue].filter((n) => !!n).length !== 6) {
            addNotification(
                "error",
                "Fill out all teams to submit",
                "Did Not Submit"
            )
            return
        }

        const match: MatchInfo = {
            red: red.map((n) => String(n)),
            blue: blue.map((n) => String(n)),
            match_number: matchToSubmit.match_number || schedule.length + 1,
        }

        const newSchedule = [...schedule, match]

        await db.events.update(id, {
            ...eventData,
            schedule: newSchedule,
        })

        setSchedule(newSchedule)
        setMatchToSubmit({})
    }

    // Drag and drop logic
    const [swapTarget, setSwapTarget] = useState<number | null>(null)
    const [swapTo, setSwapTo] = useState<number | null>(null)

    const handleDragStart = (index: number) => setSwapTarget(index)
    const handleDragOver = (index: number, e: React.DragEvent) => {
        e.preventDefault()
        setSwapTo(index)
    }

    const handleDrop = () => {
        if (swapTarget === null || swapTo === null || swapTarget === swapTo)
            return

        setSchedule((prev) => {
            const updated = [...prev]
            const [moved] = updated.splice(swapTarget, 1)
            updated.splice(swapTo, 0, moved)
            return updated
        })

        setSwapTarget(null)
        setSwapTo(null)
    }

    //const matchRef = createRef<HTMLInputElement>()

    return (
        <section className="mx-auto flex w-full max-w-2xl flex-col gap-2 p-4">
            {/* Match Entry Card */}
            <div className="w-full rounded border-2 border-neutral-500 bg-neutral-200 p-2 dark:bg-[#302E2E]">
                <div className="flex gap-1 rounded-t border-b-2 border-neutral-400 px-3 py-2 dark:border-neutral-900/50 dark:bg-[#272424]">
                    Qualifier
                    <Input
                        type="number"
                        defaultValue={schedule.length + 1}
                        onChange={(e) =>
                            setMatchToSubmit((prev) => ({
                                ...prev,
                                match_number:
                                    parseInt(e.target.value) ||
                                    schedule.length + 1,
                            }))
                        }
                        className="no-spinner h-7 max-w-8 rounded-none border-b-2 bg-transparent p-0 dark:border-neutral-200 dark:bg-transparent dark:text-neutral-100"
                    />
                </div>

                {/* Red Team Inputs */}
                <div className="grid h-12 grid-cols-3 border-b-2 border-[#a37979] bg-[#be8d8e] px-3 py-2 dark:border-[#774B4C] dark:bg-[#9A6364]">
                    {[0, 1, 2].map((i) => (
                        <Input
                            key={i}
                            placeholder={`Red ${i + 1}`}
                            type="number"
                            value={matchToSubmit.red?.[i] || ""}
                            onChange={(e) =>
                                updateSchedule(
                                    "red",
                                    i,
                                    parseInt(e.target.value)
                                )
                            }
                            className={`no-spinner h-7 max-w-14 rounded-none border-b-2 bg-transparent p-0 ring-offset-0 dark:border-neutral-200 dark:bg-transparent dark:text-neutral-100 ${i === 1 ? "mx-auto" : i === 2 ? "ml-auto" : ""}`}
                        />
                    ))}
                </div>

                {/* Blue Team Inputs */}
                <div className="grid h-12 grid-cols-3 gap-8 rounded-b bg-[#8898b8] px-3 py-2 dark:bg-[#63769A]">
                    {[0, 1, 2].map((i) => (
                        <Input
                            key={i}
                            placeholder={`Blue ${i + 1}`}
                            type="number"
                            value={matchToSubmit.blue?.[i] || ""}
                            onChange={(e) =>
                                updateSchedule(
                                    "blue",
                                    i,
                                    parseInt(e.target.value)
                                )
                            }
                            className={`no-spinner h-7 max-w-14 rounded-none border-b-2 bg-transparent p-0 dark:border-neutral-200 dark:bg-transparent dark:text-neutral-100 ${i === 1 ? "mx-auto" : i === 2 ? "ml-auto" : ""}`}
                        />
                    ))}
                </div>

                <Button
                    className="mt-2 w-full"
                    size="lg"
                    onClick={submitMatchToSchedule}
                >
                    Add Match
                </Button>
            </div>

            {/* Schedule List */}
            <div
                className="flex flex-col gap-2 overflow-x-visible overflow-y-scroll rounded px-4"
                style={{ overflowX: "visible" }}
            >
                <span
                    className={`relative block h-1.5 w-full rounded bg-neutral-300 ${swapTo ? "" : "hidden"}`}
                    style={{
                        order: swapTo || 0 * 2,
                    }}
                ></span>
                {schedule.map((match, i) => (
                    <div
                        key={i}
                        onDragOver={(e) => handleDragOver(i, e)}
                        onDrop={handleDrop}
                        draggable
                        onDragStart={() => handleDragStart(i)}
                        onDragEnd={() => handleDrop()}
                        className="relative cursor-grab"
                        style={{ order: i - 1 }}
                    >
                        <div className="absolute -left-12 z-90 flex items-end">
                            <X className="dark:text-red-300" />
                            <GripVertical className="" />
                        </div>
                        <ScheduleMatchView match={match} />
                    </div>
                ))}
            </div>
        </section>
    )
}
