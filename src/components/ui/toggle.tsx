import { GetVariantProps, vs } from "@vtechguys/vs"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { Check, X } from "lucide-react"
import { ButtonHTMLAttributes } from "react"

export const toggleVariants = vs({
    base: "rounded dark:text-neutral-300 text-left flex justify-between",
    variants: {
        variant: {
            default: "",
        },
        size: {
            default: "w-full px-3 py-2",
        },
    },
    defaultVariants: {
        size: "default",
        variant: "default",
    },
})

interface ToggleInterface extends ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: any
    toggleValue: boolean
    setToggleValue?: (value: boolean) => void
}

export const Toggle = ({
    children,
    toggleValue,
    variant,
    size,
    onClick,
    className,

    ...props
}: ToggleInterface & GetVariantProps<typeof toggleVariants>) => {
    return (
        <button
            onClick={() => {
                onClick && onClick()
            }}
            className={cn(
                clsx(toggleVariants({ variant, size })),
                `${toggleValue ? "dark:bg-cool-green/25 dark:hover:bg-cool-green/35" : "dark:bg-neutral-900 dark:hover:bg-neutral-900/50"}`,
                className
            )}
            {...props}
        >
            <div>{children}</div>
            {toggleValue ? <Check /> : <X />}
        </button>
    )
}
