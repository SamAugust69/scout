"use client"
import { cn } from "../../lib/utils"

import { motion } from "framer-motion"
import React, {
    cloneElement,
    createContext,
    HTMLAttributes,
    useContext,
    useState,
} from "react"

const DialogContext = createContext<
    | {
          isOpen: boolean
          open: () => void
          close: () => void
      }
    | undefined
>(undefined)

interface DialogProps {
    children: React.ReactNode
    onClose?: () => void
    onOpen?: () => void
}

const Dialog = ({ children, onClose, onOpen }: DialogProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const body = document.querySelector("body")

    const open = () => {
        setIsOpen(true)

        if (body) body.style.overflow = "hidden"
        if (onOpen) onOpen()
    }
    const close = () => {
        setIsOpen(false)

        if (body) body.style.overflow = ""
        if (onClose) onClose()
    }

    return (
        <DialogContext.Provider value={{ isOpen, open, close }}>
            {children}
        </DialogContext.Provider>
    )
}

interface DialogOverlayProps extends HTMLAttributes<HTMLDivElement> {}

const DialogOverlay = ({ children, ...props }: DialogOverlayProps) => {
    const dialogContext = useContext(DialogContext)

    if (!dialogContext) return "Use DialogTrigger within a Dialog comp."

    const { close } = dialogContext

    return (
        <div
            onClick={close}
            className="fixed top-0 left-0 z-20 flex h-full w-full items-center justify-center overflow-hidden bg-neutral-950/50"
            {...props}
        >
            {children}
        </div>
    )
}

interface DialogTriggerProps {
    children: React.ReactElement
}

const DialogTrigger = ({ children }: DialogTriggerProps) => {
    const dialogContext = useContext(DialogContext)

    if (!dialogContext) return "Use DialogTrigger within a Dialog comp."

    const { open } = dialogContext

    return cloneElement(children, {
        onClick: open,
    })
}

interface DialogCloseProps {
    children: React.ReactElement
}

const DialogClose = ({ children }: DialogCloseProps) => {
    const dialogContext = useContext(DialogContext)

    if (!dialogContext) return "Use DialogTrigger within a Dialog comp."

    const { close } = dialogContext

    return cloneElement(children, {
        onClick: () => {
            close()
            if (children.props.onClick) children.props.onClick()
        },
    })
}

interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {}

const DialogContent = ({
    children,
    className,
    onKeyUp,
}: DialogContentProps) => {
    const dialogContext = useContext(DialogContext)

    if (!dialogContext) return "Use DialogContent within a Dialog comp."

    const { isOpen } = dialogContext

    if (isOpen) {
        return (
            <DialogOverlay onKeyUp={onKeyUp}>
                <motion.div
                    initial={{ scale: 0.975, opacity: 0.9 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.05 }}
                    onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                        e.stopPropagation()
                    }
                    className={cn`w-full max-w-[26rem] rounded-md bg-neutral-300 p-4 text-neutral-800 shadow-md shadow-neutral-500 dark:bg-neutral-800 dark:shadow-neutral-900 ${className}`}
                >
                    {children}
                </motion.div>
            </DialogOverlay>
        )
    }
    return null
}

interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const DialogHeader = ({ children, className, ...props }: DialogHeaderProps) => {
    return (
        <div className={cn(`mb-6`, className)} {...props}>
            {children}
        </div>
    )
}

interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {}

const DialogFooter = ({ children, className }: DialogFooterProps) => {
    return <div className={cn(`mt-6`, className)}>{children}</div>
}

interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const DialogTitle = ({ children, className, ...props }: DialogTitleProps) => {
    return (
        <h2
            className={cn`mb-0.5 text-lg font-semibold text-neutral-900 dark:text-neutral-300 ${className}`}
            {...props}
        >
            {children}
        </h2>
    )
}

interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const DialogDescription = ({ children }: DialogDescriptionProps) => {
    return <p className="font-medium dark:text-neutral-400">{children}</p>
}

export {
    Dialog,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}
