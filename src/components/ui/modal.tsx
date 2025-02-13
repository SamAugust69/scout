"use client"
import { cn } from "../../lib/utils"

import { motion } from "framer-motion"
import React, {
    cloneElement,
    createContext,
    HTMLAttributes,
    useContext,
} from "react"

const ModalContext = createContext<
    | {
          isOpen: boolean
          open: () => void
          close: () => void
      }
    | undefined
>(undefined)

interface ModalProps {
    children: React.ReactNode
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    onClose?: () => void
    onOpen?: () => void
}

const Modal = ({
    children,
    onClose,
    onOpen,
    setIsOpen,
    isOpen,
}: ModalProps) => {
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
        <ModalContext.Provider value={{ isOpen, open, close }}>
            {children}
        </ModalContext.Provider>
    )
}

interface ModalOverlayProps extends HTMLAttributes<HTMLDivElement> {}

const ModalOverlay = ({ children, ...props }: ModalOverlayProps) => {
    const context = useContext(ModalContext)

    if (!context) return "Use ModalTrigger within a Modal comp."

    const { close } = context

    return (
        <div
            onClick={(e) => {
                e.stopPropagation()
                if (e.type === "click") close()
            }}
            className="fixed top-0 left-0 z-10 flex h-full w-full items-center justify-center overflow-hidden bg-neutral-950/50"
            {...props}
        >
            {children}
        </div>
    )
}

interface ModalTriggerProps {
    children: React.ReactElement
}

const ModalTrigger = ({ children }: ModalTriggerProps) => {
    const context = useContext(ModalContext)

    if (!context) return "Use ModalTrigger within a Modal comp."

    const { open } = context

    return cloneElement(children, {
        onClick: open,
    })
}

interface ModalCloseProps {
    children: React.ReactElement
}

const ModalClose = ({ children }: ModalCloseProps) => {
    const context = useContext(ModalContext)

    if (!context) return "Use ModalTrigger within a Modal comp."

    const { close } = context

    return cloneElement(children, {
        onClick: () => {
            close()
            if (children.props.onClick) children.props.onClick()
        },
    })
}

interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {}

const ModalContent = ({ children, className, onKeyUp }: ModalContentProps) => {
    const context = useContext(ModalContext)

    if (!context) return "Use ModalContent within a Modal comp."

    const { isOpen } = context

    if (isOpen) {
        return (
            <ModalOverlay onKeyUp={onKeyUp}>
                <motion.div
                    initial={{ scale: 0.975, opacity: 0.9 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.05 }}
                    onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                        e.stopPropagation()
                    }
                    className={cn`w-full max-w-[26rem] rounded-md bg-neutral-300 p-4 text-neutral-800 shadow-md shadow-neutral-500 dark:bg-neutral-800 dark:shadow-neutral-900 ${className} cursor-auto`}
                >
                    {children}
                </motion.div>
            </ModalOverlay>
        )
    }
    return null
}

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const ModalHeader = ({ children, className, ...props }: ModalHeaderProps) => {
    return (
        <div className={cn(`mb-6`, className)} {...props}>
            {children}
        </div>
    )
}

interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {}

const ModalFooter = ({ children, className }: ModalFooterProps) => {
    return <div className={cn(`mt-6`, className)}>{children}</div>
}

interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const ModalTitle = ({ children, className, ...props }: ModalTitleProps) => {
    return (
        <h2
            className={cn`mb-0.5 text-lg font-semibold text-neutral-900 dark:text-neutral-300 ${className}`}
            {...props}
        >
            {children}
        </h2>
    )
}

interface ModalDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const ModalDescription = ({ children }: ModalDescriptionProps) => {
    return <p className="font-medium dark:text-neutral-400">{children}</p>
}

export {
    Modal,
    ModalClose,
    ModalTrigger,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalTitle,
    ModalDescription,
}
