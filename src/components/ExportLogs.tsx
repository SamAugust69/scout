import { Input } from "./ui/input"
import { EventSettings } from "@/lib/types/eventSettings"
import { Event } from "@/lib/types/eventType"
import { useEffect, useRef, useState } from "react"
import { Button } from "./ui/button"
import { addNotification } from "./ui/notifications"
import axios from "axios"
import { Toggle } from "./ui/toggle"
import { Paragraph } from "./ui/paragraph"
import { Log, logConfig } from "./forms/formConfig"
import { getLogs } from "@/lib/getLogs"

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

        const url = new URL(`${address}/register`)

        try {
            axios({
                method: "GET",
                url: url.href,
            })
                .then((res) => {
                    if (res.status === 200) {
                        setClientId(res.data.clientId)
                        heartbeat(address, res.data.clientId)
                        addNotification(
                            "success",
                            "Connected to the REST api successfully",
                            "Success!"
                        )
                    }
                })
                .catch((e: Error) => {
                    console.log(e.message)
                    addNotification("error", e.message, url.href)
                })
        } catch (err) {
            console.log(err)
            addNotification("error")
        }
    }

    let heartbeatIntervalId: NodeJS.Timeout | null = null
    const clientIdRef = useRef<string | undefined>(clientId)
    const heartbeat = (address: string, clientId: string) => {
        clientIdRef.current = clientId

        heartbeatIntervalId = setInterval(() => {
            if (!clientId) {
                heartbeatIntervalId && clearInterval(heartbeatIntervalId)
                return
            }
            axios
                .get(`${address}/heartbeat/${clientId}`, {
                    headers: {
                        "x-clientId": clientId,
                    },
                })
                .then(() => {
                    console.log("Heartbeat good")
                })
                .catch((res) => {
                    if (clientIdRef.current === clientId) {
                        console.log("Hearbeat bad")
                        setClientId(undefined)
                        addNotification(
                            "error",
                            res.response.data.error,
                            "Heartbeat Failed"
                        )
                    }
                    heartbeatIntervalId && clearInterval(heartbeatIntervalId)
                })
        }, 30000)
    }

    const disconnect = (clientId: string) => {
        const address = eventUserSettings[eventData.id].exportAddress
        console.log("Disconnected")

        axios.put(`${address}/deregister/${clientId}`)
        setClientId(undefined)
        heartbeatIntervalId && clearInterval(heartbeatIntervalId)
    }

    var toSync: number | undefined = undefined
    var logsRecievedAmount = 0
    const logsRecieved: Log<keyof typeof logConfig>[] = []

    const sse = (value: MessageEvent<any>, eventSource?: EventSource) => {
        const parsedMessage: {
            type: string
            message?: string
            data?: any
            toSend?: number
        } = JSON.parse(value.data)
        console.log(parsedMessage)

        switch (parsedMessage.type) {
            case "hello":
                addNotification("default", parsedMessage.message)
                toSync = parsedMessage.toSend
                break
            case "requestData":
                // sends data to the sync host
                const logs = getLogs(eventData?.match_logs || [])
                const address = eventUserSettings[eventData.id].exportAddress
                console.log("tryna send data")
                axios
                    .post(`${address}/sendLogs`, {
                        logs,
                    })
                    .then(() => {
                        console.log("I sent my data!")
                    })
                break
            case "data":
                // got data!
                console.log("Got data!", parsedMessage.data)
                logsRecieved.push(parsedMessage.data)
                logsRecievedAmount++

                console.log(logsRecievedAmount, toSync)

                if (logsRecievedAmount === toSync) {
                    toSync = undefined
                    logsRecievedAmount = 0
                    console.log(logsRecieved)
                    eventSource && eventSource.close()
                }
        }
    }
    const [eventSource, setEventSource] = useState<EventSource | undefined>(
        undefined
    )

    const openSynchronization = () => {
        const address = eventUserSettings[eventData.id].exportAddress

        const url = `${address}/sse/enableSynchronization/${clientId}`

        const eventSource = new EventSource(url)

        eventSource.onopen = () => {
            addNotification("success", "Syncing logs!", "Opened SSE")
            setEventSource(eventSource)
        }

        eventSource.addEventListener("message", (message) => {
            sse(message)
        })
    }

    const closeSynchronization = () => {
        addNotification("default", "Stopped syncing logs", "Closed SSE")
        setEventSource(undefined)
        eventSource?.close()
    }

    const synchronize = () => {
        const address = eventUserSettings[eventData.id].exportAddress

        const url = `${address}/sse/synchronize/${clientId}`

        const eventSource = new EventSource(url)

        eventSource.addEventListener("message", (message) => {
            sse(message, eventSource)
        })
    }

    useEffect(() => {
        return () => (clientId ? disconnect(clientId) : console.log("opoioopp"))
    }, [])

    return (
        <div className="flex w-full flex-col gap-1 px-3 py-2">
            <Paragraph size="sm">Server Address</Paragraph>
            <div className="grid grid-cols-6 grid-rows-2 gap-2 md:grid-rows-1">
                <Input
                    placeholder="http://localhost:155"
                    defaultValue={eventUserSettings[eventData.id].exportAddress}
                    onChange={(e) =>
                        editEventUserSettings(eventData.id, {
                            ...eventUserSettings[eventData.id],
                            exportAddress: e.target.value,
                        })
                    }
                    className="col-span-6 md:col-span-4 dark:placeholder:text-neutral-600"
                />
                <Toggle
                    className="col-span-3"
                    disabled={clientId === undefined}
                    toggleValue={eventSource !== undefined}
                    onClick={() =>
                        eventSource !== undefined
                            ? closeSynchronization()
                            : openSynchronization()
                    }
                >
                    Send Logs
                </Toggle>
                <Button
                    className="col-span-3 md:col-span-2 md:col-start-5 md:row-start-1"
                    onClick={() =>
                        clientId !== undefined
                            ? disconnect(clientId)
                            : registerClient()
                    }
                >
                    {clientId !== undefined ? "Disconnect" : "Connect"}
                </Button>
            </div>
            {clientId}
            <Button onClick={synchronize}>Sync</Button>
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
