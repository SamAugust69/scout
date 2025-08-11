import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"
import { Paragraph } from "./paragraph"
import { Divider } from "./divider"
import { GetVariantProps, vs } from "@vtechguys/vs"

export const pageVariants = vs({
    variants: {
        size: {
            full: "",
            desktop: "max-w-5xl",
            mobile: "max-w-xl",
        },
    },
    defaultVariants: {
        size: "mobile",
    },
})

const Page = ({
    className,
    children,
    size,
    ...props
}: HTMLAttributes<HTMLDivElement> & GetVariantProps<typeof pageVariants>) => {
    return (
        <main
            {...props}
            className={cn(
                pageVariants({ size }),
                "mx-auto grid w-full grid-rows-[20px_1px_auto] gap-2 p-4",
                className
            )}
        >
            {children}
        </main>
    )
}

interface PageHeaderInterface {
    title?: string
}

const PageHeader = ({
    className,
    children,
    title = "Undefined",
    ...props
}: HTMLAttributes<HTMLDivElement> & PageHeaderInterface) => {
    return (
        <>
            <header {...props} className={cn("flex", className)}>
                {children}
                <Paragraph className="ml-auto text-end font-bold">
                    {title}
                </Paragraph>
            </header>
            <Divider />
        </>
    )
}

const PageContent = ({
    className,
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <section {...props} className={cn("mt-2 overflow-auto", className)}>
            {children}
        </section>
    )
}

export { Page, PageContent, PageHeader }
