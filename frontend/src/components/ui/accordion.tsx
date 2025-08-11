import { cn } from "@/lib/utils"
import {
    createContext,
    HTMLAttributes,
    ReactNode,
    useContext,
    useState,
} from "react"
import { Button } from "./button"
import { ChevronDown } from "lucide-react"

type AccordionItemContextType = {
    open: boolean
    toggleOpen: () => void
}

// <Accordion> <- handles state for each accordion

//      <AccordionItem>

//      </AccordionItem>

// </Accordion>

const AccordionContext = createContext<AccordionItemContextType | undefined>(
    undefined
)

const useAccordionContext = () => {
    const context = useContext(AccordionContext)

    if (!context) {
        throw new Error(
            "useAccordionContext must be used within an Accordion component. " +
                "Make sure your AccordionItems are inside the Accordion wrapper."
        )
    }

    return context
}

const Accordion = ({
    className,
    children,
}: HTMLAttributes<HTMLUListElement>) => {
    return <ul className={cn("flex w-full flex-col", className)}>{children}</ul>
}

interface AccordionItemInterface extends HTMLAttributes<HTMLLIElement> {
    isOpen?: boolean
    children?: React.ReactNode
}

const AccordionItem = ({
    children,
    className,
    isOpen,
}: AccordionItemInterface) => {
    const [open, setOpen] = useState(isOpen || false)

    const toggleOpen = () => setOpen(!open)

    return (
        <AccordionContext.Provider value={{ open, toggleOpen }}>
            <li
                className={cn(
                    `flex flex-col border-b border-neutral-600 first:rounded-t last:rounded-b last:border-b-0 ${open ? "last:border-b" : null}`,
                    className
                )}
            >
                {children}
            </li>
        </AccordionContext.Provider>
    )
}

const AccordionLabel = ({
    children,
    className,
}: HTMLAttributes<HTMLButtonElement>) => {
    const { open, toggleOpen } = useAccordionContext()
    return (
        <Button
            onClick={toggleOpen}
            variant="none"
            className={cn(
                "flex items-center justify-between rounded-none p-2 font-semibold select-none",
                className
            )}
        >
            {children}
            <ChevronDown className={`h-5 w-5 ${open ? "rotate-180" : null}`} />
        </Button>
    )
}

const AccordionContent = ({
    children,
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    const { open } = useAccordionContext()

    return open ? (
        <div
            className={cn(
                "border-t border-neutral-600 bg-neutral-800 p-2",
                className
            )}
            {...props}
        >
            {children}
        </div>
    ) : (
        <></>
    )
}

export { Accordion, AccordionItem, AccordionLabel, AccordionContent }
