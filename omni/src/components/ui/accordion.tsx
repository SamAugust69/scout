import { createContext, useContext, useEffect, useState } from "react"

type ItemType = {
    id: string
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
            {items.length}
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
    const [item, setItem] = useState<ItemType | undefined>(undefined)

    const newItem = { id: crypto.randomUUID(), open: false }
    useEffect(() => {
        if (!item === undefined && items.find((item) => item.id !== newItem.id))
            return

        setItem(newItem)
        addItem(newItem)

        console.log(items)
    }, [])

    return <div>{item?.id}</div>
}

const AccordionItemContent = ({}) => {
    return
}

export { Accordion, AccordionItem, AccordionItemContent }
