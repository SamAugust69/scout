import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

export interface FormInputInterface {
    numbersOnly?: boolean
    label: string
    showStepper?: boolean
    placeholder?: string
    jsonKey: string
}
export const FormInput = ({
    numbersOnly,
    showStepper,
    label,
    className,
    placeholder,
    ...props
}: HTMLAttributes<HTMLInputElement> & FormInputInterface) => {
    const numberProps = numbersOnly
        ? {
              type: "number",
              inputMode: "numeric" as const,
              pattern: "[0-9]*",
          }
        : {}

    return (
        <>
            <label>{label}</label>
            <input
                {...props}
                {...numberProps}
                placeholder={placeholder}
                className={cn(
                    "w-full rounded-sm border-neutral-200 bg-neutral-300 px-4 py-2 placeholder-neutral-500 outline-hidden invalid:border-red-500 focus:ring-2 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder-neutral-400",
                    className
                )}
            />
        </>
    )
}
