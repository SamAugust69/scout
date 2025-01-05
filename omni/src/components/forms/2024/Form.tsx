import { Auto, Finishing, StartLogInfo, Teleop } from "./FormPages2024"
import { useState } from "react"
import { Button } from "../../ui/button"
import { Log2024 } from "@/lib/types/log2024Type"
import useMultiForm from "@/lib/useMultiForm"
import {
    Form,
    FormHeader,
    FormHeading,
    FormParagraph,
    FormSubmit,
} from "@/components/ui/form"
import { Modal, ModalContent } from "@/components/ui/modal"

const yearInfo = [
    {
        year: 2024,
        steps: [
            { title: "Info", component: StartLogInfo },
            { title: "Auto", component: Auto },
            { title: "Teleop", component: Teleop },
            { title: "Notes", component: Finishing },
        ],
    },
    {
        year: 2025,
        steps: [
            { title: "Info", component: StartLogInfo },
            { title: "Auto", component: Auto },
            { title: "Teleop", component: Teleop },
        ],
    },
]

const LogForm = ({
    isOpen,
    setIsOpen,
    year,
}: {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    year: number
}) => {
    const [formChanges, setFormChanges] = useState<Partial<Log2024>>({}) // form keeps track of changes, updates input values occordingly

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        const fieldValue = type === "checkbox" ? checked : value

        const keys = name.split(".") as [keyof Log2024, string]

        if (keys.length === 2) {
            // nested, only 2 depth unfortunately
            const [parent, child] = keys

            setFormChanges((prevState) => ({
                ...prevState,
                [parent]: {
                    ...(prevState[parent] as any),
                    [child]: fieldValue,
                },
            }))
        } else {
            // non-nested
            const key = keys[0] as keyof Log2024

            setFormChanges((prevState) => ({
                ...prevState,
                [key]: fieldValue,
            }))
        }
    }

    const submitForm = () => {
        // submission logic
        console.log(formChanges)
    }

    const getYearInfo = (year: number) => {
        const titles: string[] = []
        const components: any = []
        yearInfo
            .filter((info) => info.year === year)[0]
            .steps.map((step) => {
                titles.push(step.title)
                components.push(step.component)
            })

        return { titles, components }
    }

    // form pages, create those yourselfs
    const { titles, components } = getYearInfo(year)

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
            // onOpen={() => window.addEventListener("keyup", formNav)}
            // onClose={() => window.removeEventListener("keyup", formNav)}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <ModalContent className="m-2 grid h-full max-h-[52rem] w-full max-w-[900px] grid-cols-9 grid-rows-6 gap-4 bg-neutral-900/75">
                <div className="hidden-small col-span-9 row-span-1 flex flex-col items-center gap-4 rounded-md border border-neutral-600 bg-neutral-800 py-8 md:col-span-3 md:row-span-6">
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
                                <div>
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
            </ModalContent>
        </Modal>
    )
}

export { LogForm }
