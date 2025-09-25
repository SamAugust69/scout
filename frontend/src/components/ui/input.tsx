import { cn } from "@/lib/utils"
import React, { InputHTMLAttributes } from "react"

export interface InputInterface {
    numbersOnly?: boolean
}

export const Input = React.forwardRef<
    HTMLInputElement,
    InputHTMLAttributes<HTMLInputElement> & InputInterface
>(({ className, numbersOnly, ...props }, ref) => {
    const numberProps = numbersOnly
        ? {
              type: "number",
              inputMode: "numeric" as const,
              pattern: "[0-9]*",
          }
        : {}
    return (
        <input
            {...props}
            {...numberProps}
            ref={ref}
            className={cn(
                "w-full rounded-sm border-neutral-200 bg-neutral-300 px-4 py-2 placeholder-neutral-500 outline-hidden invalid:border-red-500 focus:ring-2 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder-neutral-400",
                className
            )}
        />
    )
})
