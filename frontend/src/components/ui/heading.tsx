import { cn } from "@/lib/utils"
import { GetVariantProps, vs } from "@vtechguys/vs"
import clsx from "clsx"

import { HTMLAttributes } from "react"

export const headingVariants = vs({
    base: "",
    variants: {
        variant: {
            primary: "",
        },
        size: {
            sm: "font-semibold",
            default: "text-lg font-semibold",
            lg: "text-xl font-bold",
            xl: "text-2xl font-bold",
        },
    },
    defaultVariants: {
        size: "default",
        variant: "primary",
    },
})

export interface HeadingInterface
    extends GetVariantProps<typeof headingVariants>,
        HTMLAttributes<HTMLHeadingElement> {}

export const Heading = ({
    variant,
    size,
    className,
    children,
    ...props
}: HeadingInterface) => {
    return (
        <h1
            className={cn(clsx(headingVariants({ variant, size })), className)}
            {...props}
        >
            {children}
        </h1>
    )
}
