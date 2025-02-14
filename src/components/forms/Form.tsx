import { useState } from "react"
import useMultiForm from "@/lib/useMultiForm"

import { Modal, ModalContent } from "@/components/ui/modal"
import { formConfig } from "./formConfig"
import { Event, MatchLog, MatchStatistics } from "@/lib/types/eventType"
import { addNotification } from "../ui/notifications"
import { Log, logConfig } from "@/lib/types/logTypes"
import { db } from "@/lib/db"
import { scoreLog } from "@/lib/types/logCommonType"
import { Paragraph } from "../ui/paragraph"
import { Button } from "../ui/button"

interface LogFormInterface {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    eventData: Event
}

const LogForm = ({ isOpen, setIsOpen, eventData }: LogFormInterface) => {
    const Year = eventData.year as keyof typeof logConfig
    const [formChanges, setFormChanges] = useState<Log<typeof Year>>(
        {} as Log<typeof Year>
    )

    const getYearInfo = (year: number) => {
        const titles: string[] = []
        const components: any = []
        const filtered = formConfig.filter((info) => info.year === year)[0]

        filtered.steps.map((step) => {
            titles.push(step.title)
            components.push(step.component)
        })

        return { titles, components, scoringMap: filtered.scoringMap }
    }

    const handleChange = (key: string, value: any) => {
        setFormChanges((prev) => {
            const keys = key.split(".") as [keyof Log<typeof Year>, never]
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
    }
    const { components, scoringMap, titles } = getYearInfo(eventData.year)

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
        const statistics: MatchStatistics = scoreLog(formChanges, scoringMap)

        const newMatch: MatchLog = {
            matchNumber: formChanges.match,
            logs: [formChanges],
            statistics: statistics,
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

        matchInfo.logs.push(formChanges)

        // generate new stats

        const newStats: MatchStatistics = { autoAverage: 0, teleopAverage: 0 }
        matchInfo.logs.map((match) => {
            const stats = scoreLog(match, scoringMap)

            newStats.autoAverage = +stats.autoAverage
            newStats.teleopAverage = +stats.teleopAverage
        })
        newStats.autoAverage = newStats.autoAverage / matchInfo.logs.length
        newStats.teleopAverage = newStats.teleopAverage / matchInfo.logs.length

        matchInfo.statistics = newStats
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

        console.log(matchInfo)
    }

    // form pages, create those yourselfs

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
            <ModalContent className="m-4 grid h-full max-h-screen w-full max-w-[900px] grid-cols-1 grid-rows-[auto_1fr_auto] gap-2 bg-neutral-200 md:grid-cols-6 md:grid-rows-[1fr_auto] dark:bg-[#272424] dark:text-white">
                <div className="row-span-1 flex justify-center gap-4 rounded bg-neutral-900/75 p-4 md:col-span-2 md:row-span-2 md:flex-col md:justify-start md:py-8">
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
                </div>
                <div className="row-span-1 flex flex-col gap-2 overflow-y-auto rounded bg-neutral-900/75 p-4 md:col-span-4 md:row-span-1">
                    <div className="flex gap-3">
                        <Paragraph>
                            Team{" "}
                            <span className="px-1">
                                {formChanges.team || "_ "}
                            </span>
                        </Paragraph>
                        <Paragraph>
                            Match{" "}
                            <span className="px-1">
                                {formChanges.match || "_ "}
                            </span>
                        </Paragraph>
                    </div>
                    {CurrentComponent ? (
                        <CurrentComponent
                            handleChange={handleChange}
                            formChanges={formChanges}
                        />
                    ) : null}
                </div>
                <div className="row-span-1 flex justify-between rounded bg-neutral-900/75 p-4 md:col-span-4 md:col-start-3 md:row-span-1">
                    <Button
                        onClick={backwards}
                        variant={"link"}
                        className={`${isFirstStep ? "invisible" : null}`}
                    >
                        Back
                    </Button>
                    {isLastStep ? (
                        <Button onClick={submitForm}>Submit</Button>
                    ) : (
                        <Button onClick={forwards}>Next</Button>
                    )}
                </div>
            </ModalContent>
            {/* <ModalContent className="m-2 grid h-full max-h-[52rem] w-full max-w-[900px] grid-cols-9 grid-rows-6 gap-4 bg-neutral-900/75">
                <div className="hidden-small col-span-9 row-span-1 flex items-center gap-4 rounded-md border border-neutral-600 bg-neutral-800 py-8 md:col-span-3 md:row-span-6">
                    {titles.map((title, i) => {
                        return (
                            <button
                                className="group flex w-44 items-center gap-3"
                                onClick={() => goToStep(i)}
                                key={i}
                            >
                                <div
                                    className={`${
                                        currentStepNumber === i
                                            ? "bg-neutral-600"
                                            : "bg-neutral-500"
                                    } flex h-10 w-10 items-center justify-center rounded-full border border-neutral-400 transition-colors duration-100 group-hover:bg-neutral-600`}
                                >
                                    {i + 1}
                                </div>
                                <div className="hidden md:visible">
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
                </div>
                <div className="col-span-9 row-span-6 flex flex-col gap-4 sm:row-span-5 md:col-span-6 md:row-span-6">
                    <div className="relative flex h-full flex-col justify-between overflow-scroll rounded-md border border-neutral-600 bg-neutral-800 p-2">
                        <Form
                            onSubmit={(form) =>
                                console.log(form.currentTarget.checkValidity())
                            }
                        >
                            <div className="absolute left-0 flex w-full justify-end px-4">
                                {formChanges.match}
                            </div>
                            <FormHeader>
                                <FormHeading>Test Form</FormHeading>
                                <FormParagraph>ELLO </FormParagraph>
                            </FormHeader>

                            {CurrentComponent ? (
                                <CurrentComponent
                                    handleChange={handleChange}
                                    formChanges={formChanges}
                                />
                            ) : null}
                            <FormSubmit>test</FormSubmit>
                        </Form>

                        <div className="md:hidden">nav 2</div>
                    </div>
                    <div className="hidden justify-between rounded-md border border-neutral-600 bg-neutral-800 p-2 md:flex">
                        <Button
                            onClick={backwards}
                            variant={"link"}
                            className={`${isFirstStep ? "invisible" : null}`}
                        >
                            Back
                        </Button>
                        {isLastStep ? (
                            <Button onClick={submitForm}>Submit</Button>
                        ) : (
                            <Button onClick={forwards}>Next</Button>
                        )}
                    </div>
                </div>
            </ModalContent> */}
        </Modal>
    )
}

export { LogForm }
