import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"
import { FormPage } from "../pages/FormBuilder"

interface DynamicFormInterface {
    config: FormPage[]
    activePage: number
    setActivePage: React.Dispatch<React.SetStateAction<number>>
}

export const DynamicForm = ({
    className,
    config,
    activePage,
    setActivePage,
    ...props
}: HTMLAttributes<HTMLFormElement> & DynamicFormInterface) => {
    return (
        <form
            className={cn(
                "grid w-full max-w-3xl grid-cols-1 grid-rows-[1fr_7fr] gap-2 rounded bg-neutral-200 p-2 dark:bg-[#272424]",
                className
            )}
            {...props}
        >
            {/* Form navigation */}
            <nav className="col-span-1 flex justify-center gap-8 rounded p-4 md:col-span-1 md:gap-16 dark:bg-neutral-900/75">
                {config.map((page, i) => {
                    return (
                        <button
                            className={`group flex gap-4 rounded border border-transparent px-4 py-2`}
                            onClick={() => setActivePage(i)}
                            key={page.name}
                            type="button"
                        >
                            <div
                                className={`${
                                    activePage === i
                                        ? "border-neutral-400 bg-neutral-600 text-neutral-200"
                                        : "border-0 bg-neutral-500 text-neutral-300"
                                } flex h-10 w-10 items-center justify-center rounded-full border font-semibold transition-colors duration-100 group-hover:bg-neutral-600`}
                            >
                                {i + 1}
                            </div>
                            <div className="hidden md:block">
                                <h3 className="text-left text-xs font-bold text-neutral-400 sm:text-sm">
                                    Step {i + 1}
                                </h3>
                                <p className="text-left text-sm font-medium text-neutral-300 sm:text-base">
                                    {page.name}
                                </p>
                            </div>
                        </button>
                    )
                })}
            </nav>
            {/* Form Content */}
            <section className="col-span-1 rounded dark:bg-neutral-900/75">
                {JSON.stringify(config[activePage].form)}
            </section>
        </form>
    )
}
