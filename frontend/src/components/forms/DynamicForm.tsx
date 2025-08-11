import { cn } from "@/lib/utils"
import { vs } from "@vtechguys/vs"
import { HTMLAttributes } from "react"

export const DynamicForm = ({
    className,
    ...props
}: HTMLAttributes<HTMLFormElement>) => {
    // const dyamicFormVariants = vs({
    //     variants: {
    //         size: {

    //         }
    //     },
    //     defaultVariants: {
    //         size:
    //     }
    // })

    return (
        <form
            className={cn(
                "grid w-full max-w-2xl grid-cols-1 grid-rows-[1fr_7fr] gap-2 rounded bg-neutral-200 p-2 dark:bg-[#272424]",
                className
            )}
            {...props}
        >
            {/* Form navigation */}
            <nav className="col-span-1 rounded md:col-span-1 dark:bg-neutral-900/75">
                nav
            </nav>
            {/* Form Content */}
            <section className="col-span-1 rounded dark:bg-neutral-900/75">
                content
            </section>
        </form>
    )
}
