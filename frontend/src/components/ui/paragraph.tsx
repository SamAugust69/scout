import { cn } from "@/lib/utils"
import { GetVariantProps, vs } from "@vtechguys/vs"
import { HTMLAttributes } from "react"

export const paragraphVariants = vs({
    base: "text-neutral-800 dark:text-neutral-300 break-all",
    variants: {
        size: {
            lg: "text-",
            default: "",
            sm: "text-sm",
            xs: "text-xs",
        },
    },
    defaultVariants: {
        size: "default",
    },
})

export const Paragraph = ({
    children,
    className,
    size,
    ...props
}: HTMLAttributes<HTMLParagraphElement> &
    GetVariantProps<typeof paragraphVariants>) => {
    return (
        <p
            className={cn(paragraphVariants({ size: size }), className)}
            {...props}
        >
            {children}
        </p>
    )
}
