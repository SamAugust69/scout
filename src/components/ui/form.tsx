"use client"

import {
    createContext,
    HTMLAttributes,
    InputHTMLAttributes,
    LabelHTMLAttributes,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { useAppContext } from "@/lib/context/appContext"
import { Check } from "lucide-react"

interface FormInterface extends HTMLAttributes<HTMLFormElement> {}

const Form = ({ children, onSubmit, ...props }: FormInterface) => {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                if (onSubmit) onSubmit(e)
            }}
            className="flex flex-col gap-4"
            {...props}
        >
            {children}
        </form>
    )
}

// FIELD START //

interface FormFieldContextInterface {
    showChildren: boolean
    setShowChildren: (value: boolean) => void
    incrementButtons: boolean
    setIncrementButtons: (value: boolean) => void
}

const FormFieldContext = createContext<FormFieldContextInterface | undefined>(
    undefined
)

interface FormFieldInterface extends HTMLAttributes<HTMLDivElement> {}

const FormField = ({ children, ...props }: FormFieldInterface) => {
    const [showChildren, setShowChildren] = useState(false)
    const [incrementButtons, setIncrementButtons] = useState(false)

    return (
        <FormFieldContext.Provider
            value={{
                showChildren,
                setShowChildren,
                incrementButtons,
                setIncrementButtons,
            }}
        >
            <div className="relative flex flex-col" {...props}>
                {children}
            </div>
        </FormFieldContext.Provider>
    )
}

interface FormInputInterface extends InputHTMLAttributes<HTMLInputElement> {}

// TEXT START //

const FormInputText = ({ ...props }: FormInputInterface) => {
    return (
        <input
            placeholder=""
            type="text"
            className="peer relative flex h-10 w-full rounded border border-neutral-600 bg-neutral-700 px-2 text-neutral-300 placeholder-neutral-400 outline-none placeholder:text-sm invalid:border-r-600 disabled:pointer-events-none"
            {...props}
        />
    )
}

interface InputLabelInterface extends LabelHTMLAttributes<HTMLLabelElement> {}

const InputLabel = ({ children, ...props }: InputLabelInterface) => {
    const context = useContext(FormFieldContext)

    if (!context) return null

    const { incrementButtons } = context

    const { settings } = useAppContext()
    console.log(settings.animationsDisabled)

    return (
        <label
            className={`pointer-events-none text-xs ${settings.animationsDisabled ? "transition-none" : "transition-all"} duration-75 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm ${
                incrementButtons ? "top-0 left-20" : "top-0 left-2"
            } absolute z-20 -translate-y-1/2 transform text-neutral-300/75`}
            {...props}
        >
            {children}
        </label>
    )
}

// NUMBER START //

interface FormInputNumberInterface
    extends InputHTMLAttributes<HTMLInputElement> {
    incrementButton?: boolean
}

const FormInputNumber = ({
    children,
    incrementButton,
    ...props
}: FormInputNumberInterface) => {
    const context = useContext(FormFieldContext)
    const inputRef = useRef<HTMLInputElement>(null)

    if (!context) return null

    const { incrementButtons, setIncrementButtons } = context

    useEffect(() => {
        if (incrementButton) setIncrementButtons(true)
    }, [])

    const increment = (amount: number) => {
        if (!inputRef.current) return

        var originalValue = parseInt(inputRef.current.value) ?? 0

        if (Number.isNaN(originalValue)) originalValue = 0

        const newValue = Math.max(0, originalValue + amount).toString()

        inputRef.current.value = newValue
        // manual onchange event
        if (props.onChange) {
            props.onChange({
                currentTarget: {
                    value: newValue.toString(),
                    type: inputRef.current?.type || "number",
                    checked: inputRef.current?.checked || false,
                },
            } as React.ChangeEvent<HTMLInputElement>)
        }
    }

    return (
        <div className="flex">
            {incrementButtons ? (
                <Button
                    className="rounded-r-none px-8"
                    onClick={() => increment(-1)}
                >
                    -
                </Button>
            ) : null}
            <input
                placeholder=""
                pattern="[0-9]+"
                type="number"
                ref={inputRef}
                className={`peer flex h-10 w-full px-2 outline-none placeholder:text-sm invalid:border-red-400 disabled:pointer-events-none ${
                    !incrementButtons ? "rounded" : null
                } relative border border-neutral-600 bg-neutral-700 text-neutral-300 placeholder-neutral-400`}
                defaultValue={props.defaultValue || 0}
                {...props}
            />
            {incrementButtons ? (
                <Button
                    className="rounded-l-none px-8"
                    onClick={() => increment(1)}
                >
                    +
                </Button>
            ) : null}
        </div>
    )
}

// TOGGLE START //

interface FormToggleInterface extends InputHTMLAttributes<HTMLInputElement> {}

const FormInputToggle = ({
    children,
    className,
    defaultChecked,
    ...props
}: FormToggleInterface) => {
    const [toggled, setToggled] = useState(defaultChecked || false)
    const inputRef = useRef<HTMLInputElement>(null)

    const fieldContext = useContext(FormFieldContext)

    if (!fieldContext)
        throw new Error("FormInputToggle must be used within a FormField")

    const { setShowChildren } = fieldContext

    useEffect(() => {
        setShowChildren(toggled)
    })

    const onClick = () => {
        if (!inputRef.current) return
        inputRef.current.click()
        const newValue = inputRef.current.checked
        setToggled(newValue)
        setShowChildren(newValue)
    }

    return (
        <Button
            className={cn(
                `flex w-full items-center justify-between border ${
                    toggled
                        ? `border-great-green-600 bg-great-green-600/50 hover:bg-great-green-600/35 text-neutral-200`
                        : "border-neutral-600"
                } cursor-pointer rounded p-2 transition-all ${className}`
            )}
            onClick={onClick}
        >
            <div className="flex flex-col items-start">{children}</div>
            {toggled ? <Check className="mr-4" /> : null}
            <input
                ref={inputRef}
                className="hidden"
                type="checkbox"
                defaultChecked={toggled}
                {...props}
            />
        </Button>
    )
}

interface FormInputTitleInterface extends HTMLAttributes<HTMLHeadingElement> {}

const FormInputTitle = ({
    children,
    className,
    ...props
}: FormInputTitleInterface) => {
    return (
        <p className={cn`font-bold text-neutral-300 ${className}`} {...props}>
            {children}
        </p>
    )
}

interface FormInputDescriptionInterface
    extends HTMLAttributes<HTMLParagraphElement> {}

const FormInputDescription = ({
    children,
    className,
    ...props
}: FormInputDescriptionInterface) => {
    return (
        <p className={cn`text-neutral-400 ${className}`} {...props}>
            {children}
        </p>
    )
}

// CHILDREN START //

interface FieldChildrenInterface extends HTMLAttributes<HTMLDivElement> {}

const FieldChildren = ({ children, ...props }: FieldChildrenInterface) => {
    const context = useContext(FormFieldContext)

    if (!context) return null

    const { showChildren } = context

    return showChildren ? (
        <div className="mt-2 flex gap-2" {...props}>
            <span className="w-1 rounded-sm bg-neutral-600" />
            <div className="flex w-full flex-col gap-2">{children}</div>
        </div>
    ) : null
}

// SUBMIT START //

interface FormSubmitInterface extends HTMLAttributes<HTMLButtonElement> {}

const FormSubmit = ({ children, ...props }: FormSubmitInterface) => {
    return (
        <button type="submit" className="bg-red-400" {...props}>
            {children}
        </button>
    )
}

interface FormHeadInterface extends HTMLAttributes<HTMLDivElement> {}

const FormHeader = ({ children, ...props }: FormHeadInterface) => {
    return (
        <div className="" {...props}>
            {children}
        </div>
    )
}

interface FormHeadingInterface extends HTMLAttributes<HTMLHeadingElement> {}

const FormHeading = ({ children, ...props }: FormHeadingInterface) => {
    return (
        <h2 className="text-lg font-semibold text-neutral-300" {...props}>
            {children}
        </h2>
    )
}

interface FormParagraphInterface extends HTMLAttributes<HTMLParagraphElement> {}

const FormParagraph = ({ children, ...props }: FormParagraphInterface) => {
    return (
        <h2 className="font-semibold text-neutral-400" {...props}>
            {children}
        </h2>
    )
}

interface FormFieldTextAreaInterface
    extends HTMLAttributes<HTMLTextAreaElement> {}

const FormFieldTextArea = ({}: FormFieldTextAreaInterface) => {
    return <textarea />
}

export {
    Form,
    FormField,
    FormInputText,
    FormInputToggle,
    FormSubmit,
    InputLabel,
    FormInputDescription,
    FormInputTitle,
    FieldChildren,
    FormInputNumber,
    FormHeading,
    FormParagraph,
    FormHeader,
    FormFieldTextArea,
}
