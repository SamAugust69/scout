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
                "grid w-full max-w-xl grid-cols-1 grid-rows-[1fr_6fr] bg-red-200 md:grid-cols-[1fr_4fr] md:grid-rows-1",
                className
            )}
            {...props}
        >
            {/* Form navigation */}
            <nav className="col-span-1 bg-blue-300 md:col-span-1">nav</nav>
            {/* Form Content */}
            <section className="col-span-1 bg-blue-500">content</section>
        </form>
    )
}
