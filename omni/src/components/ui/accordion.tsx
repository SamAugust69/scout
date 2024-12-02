import { createContext, useContext, useEffect, useState } from "react"

type ItemType = {
    index: number
    open: boolean
}

type AccordionContextType = {
    items: ItemType[]
    addItem: (item: ItemType) => void
}

const AccordionContext = createContext<AccordionContextType | undefined>(
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

interface AccordionInterface {
    children?: React.ReactNode
}

const Accordion = ({ children }: AccordionInterface) => {
    const [items, setItems] = useState<ItemType[]>([])

    const addItem = (item: ItemType) => {
        return setItems((prev) => {
            return [...prev, item]
        })
    }

    return (
        <AccordionContext.Provider value={{ items, addItem }}>
            {children}
        </AccordionContext.Provider>
    )
}

interface AccordionItemInterface {
    index: number
    label?: string
    children?: React.ReactNode
}

const AccordionItem = ({}: AccordionItemInterface) => {
    const { items, addItem } = useAccordionContext()
    const [index, setIndex] = useState<number | undefined>(undefined)

    useEffect(() => {
        // Set the index when the component is mounted
        const newIndex = items.length
        setIndex(newIndex)

        // Add the item to the accordion context once index is determined
        if (
            newIndex !== undefined &&
            !items.find((item) => item.index === newIndex)
        ) {
            addItem({ index: newIndex, open: false })
        }
    }, [items, addItem])

    // Ensure index is valid before rendering
    if (index === undefined) return null

    // Find the current item state based on index
    const item = items.find((item) => item.index === index)

    return <div>test</div>
}

const AccordionItemContent = ({}) => {
    return
}

export { Accordion, AccordionItem, AccordionItemContent }
