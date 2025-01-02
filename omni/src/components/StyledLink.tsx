import { cn } from "@/lib/utils"
import clsx from "clsx"
import { buttonVariants } from "./ui/button"
import { Link, LinkProps } from "react-router-dom"
import { GetVariantProps } from "@vtechguys/vs"

interface StyledLinkInterface
    extends LinkProps,
        GetVariantProps<typeof buttonVariants> {}

export const StyledLink = ({
    children,
    variant,
    size,
    to,
    className,
    ...props
}: StyledLinkInterface) => {
    return (
        <Link
            to={to}
            className={cn(
                clsx(
                    buttonVariants({
                        variant,
                        size,
                    }),
                    "flex items-center gap-2",
                    className
                )
            )}
            {...props}
        >
            {children}
        </Link>
    )
}
