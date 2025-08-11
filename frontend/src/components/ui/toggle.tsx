import { GetVariantProps, vs } from "@vtechguys/vs"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { Check, X } from "lucide-react"
import { ButtonHTMLAttributes } from "react"

export const toggleVariants = vs({
    base: "rounded dark:text-neutral-300 text-left flex justify-between items-center gap-1 hover:cursor-pointer",
    variants: {
        variant: {
            default: "dark:bg-neutral-900 dark:hover:bg-neutral-900/50",
            box: "borde dark:border-neutral-900 dark:bg-neutral-500/25 dark:text-neutral-500",
        },
        size: {
            default: "w-full px-3 py-2",
            sm: "p-1.5",
            md: "py-1 px-2 text-xs",
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
                `${toggleValue ? "dark:bg-cool-green/25 dark:hover:bg-cool-green/35" : null}`,
                className
            )}
            {...props}
        >
            {children && <div>{children}</div>}
            {toggleValue ? (
                <Check className="h-4 w-4" />
            ) : (
                <X className="h-4 w-4" />
            )}
        </button>
    )
}
