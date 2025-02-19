import { cn } from "@/lib/utils"
import { InputHTMLAttributes } from "react"

interface InputInterface {}

export const Input = ({
    className,
    ...props
}: InputHTMLAttributes<HTMLInputElement> & InputInterface) => {
    return (
        <input
            {...props}
            className={cn(
                "w-full rounded-sm border-neutral-200 bg-neutral-300 px-4 py-2 placeholder-neutral-500 outline-hidden invalid:border-red-500 focus:ring-2 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder-neutral-400",
                className
            )}
        />
    )
}
