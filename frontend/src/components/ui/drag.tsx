import React, { createContext, useContext, useState } from "react"

type DragContextType = {
    elementToDrag: number | undefined
    setElementToDrag: React.Dispatch<React.SetStateAction<number | undefined>>
    draggingTo: number | undefined
    setDraggingTo: React.Dispatch<React.SetStateAction<number | undefined>>
    onDragEnd: (elementToDrag: number, draggingTo: number) => void
}

const DragContext = createContext<DragContextType | undefined>(undefined)

const useDragContext = () => {
    const context = useContext(DragContext)
    if (!context)
        throw new Error("useDragContext must be used inside Droppable")
    return context
}

const DropIndicator = ({ index }: { index: number }) => {
    const { draggingTo, elementToDrag } = useDragContext()
    const isActive =
        draggingTo !== undefined &&
        elementToDrag !== undefined &&
        draggingTo === index &&
        draggingTo !== elementToDrag

    return (
        <span
            className={`block h-0.5 w-full transition-colors ${
                isActive ? "bg-blue-200/50" : ""
            }`}
        />
    )
}

export const Droppable = ({
    children,
    onDragEnd,
}: {
    children: React.ReactNode
    onDragEnd: (elementToDrag: number, draggingTo: number) => void
}) => {
    const [elementToDrag, setElementToDrag] = useState<number | undefined>()
    const [draggingTo, setDraggingTo] = useState<number | undefined>()

    return (
        <DragContext.Provider
            value={{
                elementToDrag,
                setElementToDrag,
                draggingTo,
                setDraggingTo,
                onDragEnd,
            }}
        >
            <DropIndicator index={0} />
            <ul>{children}</ul>
        </DragContext.Provider>
    )
}

export const Draggable = ({
    children,
    index,
}: {
    children: React.ReactElement
    index: number
}) => {
    const {
        setDraggingTo,
        setElementToDrag,
        elementToDrag,
        draggingTo,
        onDragEnd,
    } = useDragContext()

    const handleDragStart = () => {
        setElementToDrag(index)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        if (elementToDrag === undefined) return

        const { top, height } = e.currentTarget.getBoundingClientRect()
        const offset = e.clientY - top
        setDraggingTo(offset < height / 2 ? index : index + 1)
    }

    const handleDragEnd = () => {
        if (
            elementToDrag !== undefined &&
            draggingTo !== undefined &&
            elementToDrag !== draggingTo
        ) {
            onDragEnd(elementToDrag, draggingTo)
        }
        setDraggingTo(undefined)
        setElementToDrag(undefined)
    }

    const cloned = React.cloneElement(children, {
        draggable: true,
        onDragStart: handleDragStart,
        onDragOver: handleDragOver,
        onDragEnd: handleDragEnd,
        style: {
            WebkitTransform: "translateZ(0)",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            perspective: 1000,
        },
    })

    return (
        <>
            {cloned}
            <DropIndicator index={index + 1} />
        </>
    )
}
