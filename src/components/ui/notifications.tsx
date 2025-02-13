import { vs } from "@vtechguys/vs"
import clsx from "clsx"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { useInterval } from "usehooks-ts"
import { Button } from "./button"
import { Heading } from "./heading"
import { Paragraph } from "./paragraph"
import { X } from "lucide-react"

type NotificationVariants = "warning" | "error" | "default" | "success"

type Notification = {
    variant: NotificationVariants
    message?: string
    title?: string
    id: string
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
    base: "bg-neutral-100 border-2 rounded px-4 py-3",
    variants: {
        variant: {
            default: "border-neutral-400",
            warning: "border-amber-400 dark:border-amber-400",
            error: "border-red-600 dark:border-red-400",
            success: "border-cool-green",
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
                "relative z-50 flex w-72 flex-col justify-between dark:border-neutral-700 dark:bg-neutral-800"
            )}
        >
            <Heading>
                {title ?? variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Heading>
            <Paragraph size="sm">{message}</Paragraph>
            <Button
                onClick={() => {
                    removeNotifications(id)
                }}
                variant="secondary"
                size="none"
                className="absolute top-3 right-4 ml-2 flex h-6 w-6 items-center justify-center bg-neutral-300"
            >
                <X className="w-4" />
            </Button>
        </motion.div>
    )
}

export { Notifications, addNotification }
