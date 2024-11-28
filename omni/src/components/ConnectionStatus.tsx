import { useAppContext } from "@/lib/context/appContext"
import { Paragraph } from "./ui/paragraph"

interface ConnectionStatusInterface {
    open: boolean
}

export const ConnectionStatus = ({ open }: ConnectionStatusInterface) => {
    const { connectionState } = useAppContext()
    return (
        <div
            className={`mx-auto flex h-8 items-center justify-center gap-2 rounded-sm bg-neutral-200 p-2 px-8 dark:bg-[#272424]`}
        >
            <div
                className={`h-3 w-3 rounded-full ${connectionState ? "bg-[#7C8C77]" : "bg-red-600"}`}
            ></div>
            <Paragraph className={`text-sm ${!open ? "hidden" : ""}`}>
                {connectionState ? "connected" : "disconnected"}
            </Paragraph>
        </div>
    )
}
