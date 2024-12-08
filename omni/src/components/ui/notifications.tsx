import { vs } from "@vtechguys/vs"
import clsx from "clsx"
import { AnimatePresence, motion } from "motion/react"
import { createContext, useContext, useState } from "react"
import { useInterval } from "usehooks-ts"
import { Button } from "./button"
import { Heading } from "./heading"
import { Paragraph } from "./paragraph"
import { X } from "lucide-react"

type NotificationVariants = "warning" | "error" | "default"

type Notification = {
    variant: NotificationVariants
    message?: string
    title?: string
    id: string
}

type NotificationsContext = {
    notifications: Notification[]
    removeNotification: (id: string) => void
}

const NotificationsContext = createContext<NotificationsContext | undefined>(
    undefined
)

const useNotificationContext = () => {
    const context = useContext(NotificationsContext)

    if (!context) {
        throw new Error(
            "useNotificationContext must be used in a Notifications wrapper!"
        )
    }

    return context
}

let addNotification: (
    variant: NotificationVariants,
    message?: string,
    title?: string
) => void
let removeNotifications: (id: string) => void

const Notifications = ({}) => {
    const [notifications, setNotifications] = useState<Notification[]>([])

    const add = (
        variant: NotificationVariants,
        message?: string,
        title?: string
    ) => {
        const newNotification = {
            variant,
            message,
            title,
            id: crypto.randomUUID(),
        }

        setNotifications((prev) => [...prev, newNotification])
    }

    const remove = (id: string) => {
        setNotifications((prev) =>
            prev.filter((notification) => notification.id !== id)
        )
    }

    // this lets the thingy work.
    addNotification = add
    removeNotifications = remove

    return (
        <div className="absolute bottom-2 left-2 flex max-w-96 flex-col gap-2">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <Notification key={notification.id} {...notification} />
                ))}
            </AnimatePresence>
        </div>
    )
}

const notificationVariants = vs({
    base: "bg-neutral-100 border-2 rounded p-2",
    variants: {
        variant: {
            default: "border-neutral-400",
            warning: "border-amber-400",
            error: "border-red-400",
        },
    },
    defaultVariants: {
        variant: "default",
    },
})

const Notification = ({ variant, id, message, title }: Notification) => {
    useInterval(() => {
        removeNotifications(id)
    }, 5000)

    return (
        <motion.div
            key={id}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50, transition: { duration: 0.1 } }}
            layout
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.3,
            }}
            className={clsx(
                notificationVariants({ variant }),
                "relative flex w-72 flex-col justify-between"
            )}
        >
            <Heading>
                {title ?? variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Heading>
            <Paragraph>{message}</Paragraph>
            <Button
                onClick={() => {
                    removeNotifications(id)
                }}
                variant="secondary"
                size="none"
                className="absolute top-2 right-2 ml-2 flex h-6 w-6 items-center justify-center bg-neutral-300"
            >
                <X className="w-4" />
            </Button>
        </motion.div>
    )
}

export { Notifications, addNotification }
