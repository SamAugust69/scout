import { cn } from "@/lib/utils"
import { GetVariantProps, vs } from "@vtechguys/vs"
import React, { HTMLAttributes, InputHTMLAttributes } from "react"

interface InputInterface {
    numbersOnly?: boolean
}

const InputVariants = vs({
    base: "w-full rounded-sm border-neutral-200 bg-neutral-300 placeholder-neutral-500 outline-hidden invalid:border-red-500 focus:ring-2 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder-neutral-400",
    variants: {
        size: {
            default: "px-4 py-2",
            sm: "px-2 py-1",
        },
    },
    defaultVariants: {
        size: "default",
    },
})

export const Input = React.forwardRef<
    HTMLInputElement,
    Omit<
        InputHTMLAttributes<HTMLInputElement>,
        keyof GetVariantProps<typeof InputVariants>
    > &
        InputInterface &
        GetVariantProps<typeof InputVariants>
>(({ numbersOnly, className, size, ...props }, ref) => {
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
            className={cn(InputVariants({ size }), className)}
        />
    )
})
