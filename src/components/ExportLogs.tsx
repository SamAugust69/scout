import { Input } from "./ui/input"
import { EventSettings } from "@/lib/types/eventSettings"
import { Event } from "@/lib/types/eventType"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { addNotification } from "./ui/notifications"
import axios from "axios"

const startSyncing = async (address: string, clientId: string) => {
    const response = await fetch(`${address}/startSync`, {
        method: "POST",
        headers: { "x-client-id": clientId },
    })
    const result = await response.json()
    console.log(result)
}

const setupSSE = (address: string, clientId: string) => {
    const eventSource = new EventSource(`${address}/sse/${clientId}`)

    eventSource.onmessage = (event) => {
        const logs = JSON.parse(event.data)
        console.log("Received logs:", logs)
    }

    eventSource.onerror = () => {
        console.error("SSE connection error")
        eventSource.close()
    }
}

interface ExportLogsInterface {
    eventData: Event
    eventUserSettings: { [key: string]: EventSettings }
    editEventUserSettings: (key: string, value: Partial<EventSettings>) => void
}
export const ExportLogs = ({
    eventUserSettings,
    eventData,
    editEventUserSettings,
}: ExportLogsInterface) => {
    const [clientId, setClientId] = useState<string | undefined>(undefined)

    const registerClient = async () => {
        const address = eventUserSettings[eventData.id].exportAddress

        // disconnect client before reconnecting

        if (!address) return

        if (clientId) {
            axios.put("")
        }

        const url = new URL(`${address}/register`)

        axios({
            method: "GET",
            url: url.href,
        })
            .then((res) => {
                if (res.status === 200) {
                    setClientId(res.data.clientId)
                    setInterval(heartbeat, 1000)
                }
            })
            .catch((e: Error) => {
                console.log(e.message)
                addNotification("error", e.message, url.href)
            })
    }

    const heartbeat = (address: string, clientId: string) => {
        axios
            .get(`${address}/hearbeat`, {
                headers: {
                    "x-client-id": clientId,
                },
            })
            .then((res) => {
                if (res.status !== 200) {
                    console.log("Heartbeat bad")
                    return
                }
                console.log("heartbeat good")
            })
    }

    const disconnect = (clientId: string) => {
        const address = eventUserSettings[eventData.id].exportAddress

        axios
            .put(`${address}/deregister`, {
                headers: {
                    "x-client-id": clientId,
                },
            })
            .then(() => {
                console.log("Disconnected")
                setClientId(undefined)
            })
    }

    const syncLogs = () => {
        const address = eventUserSettings[eventData.id].exportAddress

        if (!address) return
        registerClient().then(() => {
            // startSyncing(address, clientId).then(() => {
            //     setupSSE(address, clientId)
            // })
        })
    }

    return (
        <div className="flex w-full flex-col gap-1">
            <div className="flex gap-1">
                <Input
                    placeholder="localhost:155"
                    defaultValue={eventUserSettings[eventData.id].exportAddress}
                    onChange={(e) =>
                        editEventUserSettings(eventData.id, {
                            ...eventUserSettings[eventData.id],
                            exportAddress: e.target.value,
                        })
                    }
                    className="col-span-3 row-start-2"
                />
                <Button
                    className="px-8"
                    onClick={() =>
                        clientId ? disconnect(clientId) : registerClient()
                    }
                >
                    Connect
                </Button>
            </div>
            {clientId}
            <Button onClick={syncLogs}>Sync</Button>
        </div>
    )
}
{
    /* <div className="flex w-full flex-col gap-1">
    <Paragraph
        size="sm"
        className="relative top-1 row-span-1 flex h-5 justify-between"
    >
        Address{" "}
        <span className="flex items-center text-xs">
            {connectionStatus}
            {connectionStatus === "Connected" ? (
                <>
                    <Dot /> {clientID}
                </>
            ) : null}
        </span>
    </Paragraph>
    <div className="flex gap-2">
        <Input
            placeholder="localhost:155"
            className="col-span-3 row-start-2"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAddress(e.target.value)
            }
        />
        <Button
            onClick={() =>
                socket === null ? createConnection() : disconnectSocket()
            }
            className="flex w-full max-w-34 items-center justify-center gap-2"
            variant="secondary"
        >
            {socket !== null && connectionStatus !== "Connecting"
                ? "Disconnect"
                : "Connect"}{" "}
            {showConnectionIcon != false ? (
                connectionStatus === "Connecting" ? (
                    <LoaderCircleIcon className="w-4 animate-spin" />
                ) : connectionStatus === "Connected" ? (
                    <Check className="w-4 text-green-600" />
                ) : (
                    <X className="w-4 text-red-400" />
                )
            ) : null}
        </Button>
    </div>
    <Button
        variant="secondary"
        disabled={socket === null}
        onClick={getOtherLogs}
        size="lg"
        className={`enabled:bg-cool-green/85 enabled:hover:bg-cool-green/75 mt-3`}
    >
        Sync
    </Button>
    <Toggle
        disabled={socket === null}
        toggleValue={sendLogs}
        onClick={toggleSendLogs}
    >
        Sync Logs
    </Toggle>
</div> */
}
