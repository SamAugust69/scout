import { useEffect, useState } from "react"
import useMultiForm from "@/lib/useMultiForm"

import { Modal, ModalContent } from "@/components/ui/modal"
import { formConfig, Log, logConfig } from "./formConfig"
import { Event, MatchLog } from "@/lib/types/eventType"
import { addNotification } from "../ui/notifications"
import { LogStatistics } from "@/lib/types/logTypes"
import { db } from "@/lib/db"
import { scoreLog } from "@/lib/types/logCommonType"
import { Paragraph } from "../ui/paragraph"
import { Button } from "../ui/button"
import { ChevronUp, Dot } from "lucide-react"
import { Divider } from "../ui/divider"
import { Heading } from "../ui/heading"
import { Dialog, DialogContent } from "../ui/dialog"
import { EventSettings } from "@/lib/types/eventSettings"

interface LogFormInterface {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    eventData: Event
    // loadData?: Partial<Log<keyof typeof logConfig>>
    eventUserSettings: { [key: string]: EventSettings }
    setEventUserSettings: React.Dispatch<
        React.SetStateAction<{ [key: string]: EventSettings }>
    >
    // setLoadData: React.Dispatch<
    //     React.SetStateAction<Partial<Log<keyof typeof logConfig>>>
    // >
}

type FormStatus = "Incomplete" | "New"

const LogForm = ({
    isOpen,
    setIsOpen,
    eventData,
    eventUserSettings,
    setEventUserSettings,
}: LogFormInterface) => {
    const year = eventData.year as keyof typeof logConfig
    const [notesOpen, setNotesOpen] = useState(false)
    const [formChanges, setFormChanges] = useState<Partial<Log<typeof year>>>(
        {}
    )
    const [formStatus, setFormStatus] = useState<FormStatus>("New")

    const currentMatch = eventUserSettings[eventData.id].currentMatch
    const fart = () => {
        const tabletNumber = eventUserSettings[eventData.id].tabletNumber || 0

        if (tabletNumber <= 3)
            return eventData.schedule[currentMatch].red[tabletNumber - 1]
        return eventData.schedule[currentMatch].blue[tabletNumber - 4]
    }

    console.log(Number(fart()))

    const handleChange = (key: string, value: any) => {
        if (formStatus === "New") setFormStatus("Incomplete")
        setFormChanges((prev) => {
            const keys = key.split(".") as [keyof Log<typeof year>, never]
            if (keys.length === 2) {
                // for nested
                const [parentKey, childKey] = keys
                const parentValue = prev[parentKey] || {} // ensures that the parent value is always an object, and it spreadable

                return {
                    ...prev,
                    [parentKey]: {
                        ...parentValue,
                        [childKey]: value,
                    },
                }
            } else {
                // for non-nested, direct assignment
                return {
                    ...prev,
                    [key]: value,
                }
            }
        })
        console.log(formChanges)
    }
    const { scoringMap, steps } = formConfig[year]

    useEffect(() => {
        console.log("Opened, Status: ", formStatus)

        if (formStatus === "New") {
            // propigate form
            handleChange("match", currentMatch + 1)
            handleChange("team", fart())
        }
    }, [isOpen])

    const submitForm = () => {
        // submission logic
        // db.events.update(eventData, { ...eventData })

        if (!formChanges.match || !formChanges.team) {
            addNotification(
                "error",
                `Missing match and/or team`,
                "Form Invalid"
            )
            goToStep(0)
            return
        }

        // update stats and id
        const logStats: LogStatistics = scoreLog(formChanges, scoringMap)
        const logToSubmit: Partial<Log<typeof year>> = {
            ...formChanges,
            id: crypto.randomUUID(),
            score: logStats,
        }

        setFormChanges({})
        setFormStatus("New")
        setEventUserSettings((prev) => {
            return {
                ...prev,
                [eventData.id]: {
                    ...prev[eventData.id],
                    currentMatch: currentMatch + 1,
                },
            }
        })
        setIsOpen(false)

        goToStep(0)

        const newMatch: MatchLog = {
            matchNumber: formChanges.match,
            logs: [logToSubmit],
            statistics: { autoAverage: 0, teleopAverage: 0 },
            // statistics: statistics,
        }

        // goal: filter current eventData.match_logs for current match to be submitted, add log, update statistics
        const matchInfo: MatchLog = eventData.match_logs.filter(
            (match) => match.matchNumber === formChanges.match
        )[0]

        if (matchInfo === undefined) {
            // there is no match present, create a new match
            console.log("No match data found")
            return db.events.update(eventData, {
                ...eventData,
                match_logs: [...eventData.match_logs, newMatch],
            })
        }
        console.log("Match data found")

        matchInfo.logs.push(logToSubmit)

        // generate new stats

        // const newStats: MatchStatistics = { autoAverage: 0, teleopAverage: 0 }
        // matchInfo.logs.map((match) => {
        //     const stats = scoreLog(match, scoringMap)

        //     newStats.autoAverage = +stats.autoAverage
        //     newStats.teleopAverage = +stats.teleopAverage
        // })
        // newStats.autoAverage = newStats.autoAverage / matchInfo.logs.length
        // newStats.teleopAverage = newStats.teleopAverage / matchInfo.logs.length

        // matchInfo.statistics = newStats
        // matchInfo.logs.push(newMatch)
        db.events.update(eventData, {
            ...eventData,
            match_logs: [
                ...eventData.match_logs.filter(
                    (match) => match.matchNumber !== formChanges.match
                ),
                matchInfo,
            ],
        })
    }

    const components: React.ComponentType<any>[] = []
    const titles: string[] = []

    steps.map((step) => {
        components.push(step.component)
        titles.push(step.title)
    })

    const {
        CurrentComponent,
        currentStepNumber,
        goToStep,
        forwards,
        backwards,
        isLastStep,
        isFirstStep,
    } = useMultiForm(components) // handles multipageform. {currentStep} renders current page

    const formNav = (e: KeyboardEvent) => {
        // handles keyboard input navigation. arrow keys and allat

        // if (typeof e.target)

        const target = e.target as Object

        var isField = false
        const filter = ["input", "textarea"]

        for (const x in filter) {
            if (isField) return

            isField = target.toString().toLocaleLowerCase().includes(filter[x])
        }

        if (isField) return

        switch (e.key) {
            case "ArrowRight":
            case "ArrowDown":
            case "d":
                forwards()
                break
            case "ArrowLeft":
            case "ArrowUp":
            case "a":
                backwards()
                break
        }
    }

    // you shouldn't need to modify anything below, but if you want, go ahead
    return (
        <Modal
            onOpen={() => window.addEventListener("keyup", formNav)}
            onClose={() => window.removeEventListener("keyup", formNav)}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <ModalContent className="m-4 grid h-full max-h-screen w-full max-w-[900px] grid-cols-1 grid-rows-[auto_auto_1fr_auto] gap-2 bg-neutral-200 md:grid-cols-6 md:grid-rows-[1fr_auto] dark:bg-[#272424] dark:text-white">
                <div className="relative row-span-1 flex items-center justify-center gap-4 overflow-y-scroll rounded bg-neutral-300 p-4 md:col-span-2 md:row-span-2 md:flex-col md:justify-between md:p-2 md:pt-8 dark:bg-neutral-900/75">
                    {titles.map((title, i) => {
                        return (
                            <button
                                className="group flex justify-center gap-4 md:mx-auto md:w-36 md:items-center md:justify-start"
                                onClick={() => goToStep(i)}
                                key={i}
                            >
                                <div
                                    className={`${
                                        currentStepNumber === i
                                            ? "bg-neutral-600"
                                            : "bg-neutral-500 text-neutral-900"
                                    } flex h-10 w-10 items-center justify-center rounded-full border border-neutral-400 font-semibold transition-colors duration-100 group-hover:bg-neutral-600`}
                                >
                                    {i + 1}
                                </div>
                                <div className="hidden md:block">
                                    <h3 className="text-left text-xs font-bold text-neutral-400 sm:text-sm">
                                        Step {i + 1}
                                    </h3>
                                    <p className="text-left text-sm font-medium text-neutral-300 sm:text-base">
                                        {title}
                                    </p>
                                </div>
                            </button>
                        )
                    })}
                    <textarea
                        className="text-md mt-auto hidden h-40 w-full resize-none rounded border-neutral-700 bg-neutral-800/25 p-2 outline-0 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 md:block"
                        placeholder="Notes"
                        value={formChanges.notes}
                        onChange={(e) =>
                            handleChange("notes", e.currentTarget.value)
                        }
                    />
                    {/* dark:bg-[#1b1a1a]/75 */}
                    <Dialog isOpen={notesOpen} setIsOpen={setNotesOpen}>
                        <DialogContent
                            overlayInvisible
                            className={`absolute top-22 m-1 flex h-48 max-w-[89%] flex-col rounded border border-neutral-500 bg-neutral-200 md:hidden dark:border-neutral-700 dark:bg-neutral-900`}
                        >
                            <textarea
                                className="text-md mx-2 mt-2 h-full resize-none rounded border-neutral-700 bg-neutral-800/25 p-2 outline-0 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-neutral-200 dark:placeholder:text-neutral-500"
                                placeholder="Notes"
                                value={formChanges.notes}
                                onChange={(e) =>
                                    handleChange("notes", e.currentTarget.value)
                                }
                            />
                            <Button
                                onClick={() => setNotesOpen(!notesOpen)}
                                size="lg"
                                className="m-2 flex items-center justify-center gap-2 text-sm dark:bg-neutral-800"
                            >
                                Close Notes <ChevronUp className="w-4" />
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>
                <Button
                    onClick={() => setNotesOpen(!notesOpen)}
                    size="lg"
                    className="md:hidden dark:bg-neutral-900/75 dark:hover:bg-neutral-900/70"
                >
                    Open Notes
                </Button>
                <div className="row-span-1 flex flex-col gap-1 overflow-y-auto rounded bg-neutral-300 p-4 md:col-span-4 md:row-span-1 dark:bg-neutral-900/75">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                            <Paragraph className="flex gap-2">
                                Match{" "}
                                <span className="flex min-w-6 justify-center font-bold">
                                    {formChanges.match || " "}
                                </span>
                            </Paragraph>
                            <Dot />
                            <Paragraph className="flex gap-2">
                                Team{" "}
                                <span className="flex min-w-6 justify-center font-bold">
                                    {formChanges.team || " "}
                                </span>
                            </Paragraph>
                        </div>
                        <Paragraph className="flex gap-2">
                            Scouted by
                            <span className="flex min-w-6 justify-center font-bold">
                                {formChanges.scout}
                            </span>
                        </Paragraph>
                    </div>
                    <Divider className="mb-2" />
                    <Heading className="mb-2">
                        {titles[currentStepNumber]}
                    </Heading>
                    <div className="flex flex-col gap-2">
                        {CurrentComponent ? (
                            <CurrentComponent
                                handleChange={handleChange}
                                formChanges={formChanges}
                            />
                        ) : null}
                    </div>
                </div>
                <div className="row-span-1 flex justify-between rounded bg-neutral-300 p-2 md:col-span-4 md:col-start-3 md:row-span-1 dark:bg-neutral-900/75">
                    <Button
                        onClick={backwards}
                        variant={"link"}
                        size="lg"
                        className={`${isFirstStep ? "invisible" : null} pr-8`}
                    >
                        Back
                    </Button>
                    {isLastStep ? (
                        <Button onClick={submitForm} size="lg" className="px-8">
                            Submit
                        </Button>
                    ) : (
                        <Button onClick={forwards} size="lg" className="px-8">
                            Next
                        </Button>
                    )}
                </div>
            </ModalContent>
        </Modal>
    )
}

export { LogForm }
