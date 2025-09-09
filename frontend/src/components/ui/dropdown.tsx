import React, {
    cloneElement,
    createContext,
    HTMLAttributes,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"
import { Button, ButtonInterface } from "./button"
import { Paragraph } from "./paragraph"
import { ChevronDown } from "lucide-react"
import { GetVariantProps, vs } from "@vtechguys/vs"

// design/naming scheme heavily inspired by shad/cn
// https://ui.shadcn.com/docs/components/dropdown-menu

// code original to this project

const DropdownContext = createContext<
    | {
          isOpen: boolean
          toggleOpen: () => void
      }
    | undefined
>(undefined)

interface DropdownInterface {
    children: React.ReactNode
    onOpen?: () => void
    onClose?: () => void
    className?: string
    isOpen?: boolean
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
    disabled?: boolean
}

const Dropdown = ({
    children,
    onOpen,
    onClose,
    className,
    isOpen: propIsOpen,
    setIsOpen: propSetIsOpen,
    disabled = false,
}: DropdownInterface) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false)

    const isOpen = propIsOpen ? propIsOpen : internalIsOpen
    const setIsOpen = propSetIsOpen ? propSetIsOpen : setInternalIsOpen

    const toggleOpen = () => {
        if (disabled) return
        !isOpen ? onOpen && onOpen() : onClose && onClose()
        setIsOpen(!isOpen)
    }

    return (
        <div className={cn("relative", className)}>
            <DropdownContext.Provider value={{ isOpen, toggleOpen }}>
                {children}
            </DropdownContext.Provider>
        </div>
    )
}

interface DropdownButtonInterface {
    children: React.ReactElement
}

const DropdownButton = ({ children }: DropdownButtonInterface) => {
    const context = useContext(DropdownContext)

    if (context === undefined)
        throw new Error("Context issue, dropdown context")
    const { toggleOpen } = context

    return cloneElement(children, {
        onClick: () => {
            children.props.onClick && children.props.onClick()
            toggleOpen()
        },
        className: `${children.props.className} relative`,
    })
}

interface DropdownOverlayInterface {
    children?: React.ReactNode
}

const DropdownOverlay = ({ children }: DropdownOverlayInterface) => {
    const context = useContext(DropdownContext)

    if (context === undefined)
        throw new Error("Context issue, dropdown context")
    const { toggleOpen } = context

    return (
        <div
            onClick={toggleOpen}
            className="fixed top-0 left-0 z-20 h-full w-full"
        >
            {children}
        </div>
    )
}

export const DropdownContentVariants = vs({
    base: "flex flex-col absolute border-neutral-200 bg-neutral-100 p-2 shadow-md dark:border-neutral-600 dark:bg-neutral-900 z-30 mt-1 rounded-sm border",
    variants: {
        position: {
            left: "left-0",
            right: "right-0",
            center: "left-1/2 -translate-x-1/2",
        },
        size: {
            lg: "w-lg",
            md: "w-96",
            default: "w-52",
        },
    },
    defaultVariants: {
        position: "center",
        size: "default",
    },
})

interface DropdownContentInterface
    extends HTMLAttributes<HTMLDivElement>,
        GetVariantProps<typeof DropdownContentVariants> {}

const DropdownContent = ({
    children,
    className,
    position,
    size,
}: DropdownContentInterface) => {
    const context = useContext(DropdownContext)

    if (context === undefined)
        throw new Error("Context issue, dropdown context")

    const { isOpen } = context

    const contentRef = useRef<HTMLDivElement>(null)
    const [style, setStyle] = useState({})

    const updatePos = () => {
        const boundingBox = contentRef.current?.getBoundingClientRect()

        if (boundingBox === undefined) return

        var newStyle = {}

        console.log(boundingBox)

        // bottom Y bounds
        if (boundingBox?.top + boundingBox?.height > window.innerHeight)
            newStyle = { ...newStyle, bottom: "100%" }

        if (boundingBox.x < 0)
            newStyle = { ...newStyle, left: `${0 + boundingBox.width / 2}px` }

        setStyle(newStyle)
    }

    useEffect(() => {
        setStyle({})
        if (isOpen) updatePos()
    }, [isOpen])

    if (isOpen)
        return (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className={cn(
                        DropdownContentVariants({ position, size }),
                        className
                    )}
                    style={style}
                    ref={contentRef}
                >
                    {children}
                </motion.div>
                <DropdownOverlay />
            </>
        )
}

interface DropdownTitleInterface extends HTMLAttributes<HTMLHeadingElement> {}

const DropdownTitle = ({ children }: DropdownTitleInterface) => {
    return (
        <h2 className="py-1 text-sm font-semibold text-neutral-900">
            {children}
        </h2>
    )
}

interface DropdownDividerInterface extends HTMLAttributes<HTMLSpanElement> {}

const DropdownDivider = ({ className, ...props }: DropdownDividerInterface) => {
    return (
        <span
            className={`-mx-2 my-1 h-px bg-neutral-300 dark:bg-neutral-600 ${className}`}
            {...props}
        />
    )
}

const RadioGroupContext = createContext<
    | {
          state: any
          setState: (value: React.SetStateAction<any>) => void
      }
    | undefined
>(undefined)

interface DropdownRadioGroupInterface {
    value: any
    setValue: React.SetStateAction<any>
    children: React.ReactNode
}

const DropdownRadioGroup = ({
    children,
    value,
    setValue,
}: DropdownRadioGroupInterface) => {
    return (
        <RadioGroupContext.Provider
            value={{ state: value, setState: setValue }}
        >
            {" "}
            <div className="flex flex-col gap-2">{children}</div>
        </RadioGroupContext.Provider>
    )
}

interface DropdownRadioButtonInterface
    extends HTMLAttributes<HTMLButtonElement> {
    value: any
}

const DropdownRadioButton = ({
    children,
    value,
    ...props
}: DropdownRadioButtonInterface) => {
    const context = useContext(RadioGroupContext)

    if (context === undefined)
        throw new Error("Context issue, dropdown context")

    const { setState, state } = context

    return (
        <button
            className="flex h-8 items-center rounded-sm text-left text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-200 disabled:text-neutral-600"
            onClick={() => setState(value)}
            {...props}
        >
            <div
                className={`${
                    value === state ? "visible" : "invisible"
                } mx-4 h-[3.5px] w-[3.5px] rounded-full bg-neutral-800`}
            ></div>
            {children}
        </button>
    )
}

const DropdownItemIcon = ({
    children,
    className,
}: {
    children: React.ReactElement
    className?: string
}) => {
    return cloneElement(children, {
        className: cn(
            `absolute right-4 w-5 h-5 text-neutral-600 dark:text-neutral-300`,
            className
        ),
    })
}

interface DropdownItemInterface extends ButtonInterface {}

const DropdownItem = ({
    children,
    className,
    onClick,
    ...props
}: DropdownItemInterface) => {
    const context = useContext(DropdownContext)

    if (context === undefined)
        throw new Error("Context issue, dropdown context")
    const { toggleOpen } = context

    return (
        <Button
            {...props}
            variant="none"
            onClick={(e) => {
                onClick && onClick(e)
                toggleOpen()
            }}
            className={cn(
                "flex h-8 items-center rounded-sm px-2 text-left text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800/50",
                className
            )}
        >
            {children}
        </Button>
    )
}

interface DropdownTextInterface extends HTMLAttributes<HTMLParagraphElement> {}

const DropdownText = ({ children, ...props }: DropdownTextInterface) => {
    return (
        <Paragraph
            {...props}
            className="flex h-8 items-center rounded-sm px-2 text-left text-sm font-medium dark:text-neutral-800"
        >
            {children}
        </Paragraph>
    )
}

const DropdownChevron = () => {
    const context = useContext(DropdownContext)

    if (context === undefined)
        throw new Error("Context issue, dropdown context")
    const { isOpen } = context
    return <ChevronDown className={`${isOpen ? "rotate-180" : ""}`} />
}

export {
    Dropdown,
    DropdownButton,
    DropdownContent,
    DropdownDivider,
    DropdownTitle,
    DropdownRadioGroup,
    DropdownRadioButton,
    DropdownItem,
    DropdownItemIcon,
    DropdownText,
    DropdownChevron,
}
