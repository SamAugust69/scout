import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"
import { FormPage, useFormBuilderContext } from "../pages/FormBuilder"
import { formComponentRegistry } from "./formComponentRegisry"

interface DynamicFormInterface {
    config: FormPage[]
    setActivePage: React.Dispatch<React.SetStateAction<number>>
}

export const DynamicForm = ({
    className,
    config,
    setActivePage,
    ...props
}: HTMLAttributes<HTMLFormElement> & DynamicFormInterface) => {
    const { activePageNumber, activePage } = useFormBuilderContext()
    return (
        <form
            className={cn(
                "grid h-full w-full max-w-3xl grid-cols-1 grid-rows-[80px_1fr] gap-2 rounded bg-neutral-200 p-2 dark:bg-[#272424]",
                className
            )}
            {...props}
        >
            {/* Form navigation */}
            <div className="flex w-full overflow-x-scroll rounded dark:bg-neutral-900/75">
                <nav className="col-span-1 mx-auto flex items-center justify-center gap-2 px-4 md:col-span-1 md:gap-10">
                    {config.map((page, i) => {
                        return (
                            <button
                                className={`group flex gap-4 rounded border border-transparent`}
                                onClick={() => setActivePage(i)}
                                key={page.name}
                                type="button"
                            >
                                <div
                                    className={`${
                                        activePageNumber === i
                                            ? "border-neutral-400 bg-neutral-600 text-neutral-200"
                                            : "border-0 bg-neutral-500 text-neutral-300"
                                    } flex h-10 w-10 items-center justify-center rounded-full border font-semibold transition-colors duration-100 group-hover:bg-neutral-600`}
                                >
                                    {i + 1}
                                </div>
                                <div className="hidden md:block">
                                    <h3 className="truncate text-left text-xs font-bold text-neutral-400 sm:text-sm">
                                        Step {i + 1}
                                    </h3>
                                    <p className="truncate text-left text-sm font-medium text-neutral-300 sm:text-base">
                                        {page.name}
                                    </p>
                                </div>
                            </button>
                        )
                    })}
                </nav>
            </div>
            {/* Form Content */}
            <section className="col-span-1 flex flex-col gap-2 rounded p-2 dark:bg-neutral-900/75">
                {activePage &&
                    activePage.form.map(({ type, props }, i) => {
                        const compInfo = formComponentRegistry[type]
                        const Component = compInfo.component

                        return <Component {...props} key={i} />
                    })}
            </section>
        </form>
    )
}
