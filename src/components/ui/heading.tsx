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
            lg: "text-xl font-bold",
            default: "text-lg font-semibold",
        },
    },
    defaultVariants: {
        size: "default",
        variant: "primary",
    },
})

interface HeadingInterface
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
