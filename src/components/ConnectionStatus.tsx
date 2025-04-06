import { useAppContext } from "@/lib/context/appContext"
import { Paragraph } from "./ui/paragraph"

interface ConnectionStatusInterface {
    open: boolean
}

export const ConnectionStatus = ({ open }: ConnectionStatusInterface) => {
    const { internetConnected } = useAppContext()
    return (
        <div
            className={`mx-auto flex h-8 items-center justify-center gap-2 rounded-sm bg-neutral-200 p-2 px-8 dark:bg-[#272424]`}
        >
            <div
                className={`h-3 w-3 rounded-full ${internetConnected ? "bg-[#7C8C77]" : "bg-red-600"}`}
            ></div>
            <Paragraph className={`text-sm ${!open ? "hidden" : ""}`}>
                {internetConnected ? "connected" : "disconnected"}
            </Paragraph>
        </div>
    )
}
