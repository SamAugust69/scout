import { useEffect, useRef, useState } from "react"
import axios, { AxiosError } from "axios"
import { Check, Dot, LoaderCircle } from "lucide-react"
import { Button } from "./ui/button"
import { Paragraph } from "./ui/paragraph"
import { Toggle } from "./ui/toggle"
import { addNotification } from "./ui/notifications"
import { useAppContext } from "@/lib/context/appContext"
import { db } from "@/lib/db"
import { getLogs } from "@/lib/getLogs"
import { submitLog } from "@/lib/submitLog"
import { Event, MatchLog } from "@/lib/types/eventType"
import { EventSettings } from "@/lib/types/eventSettings"
import { Log, logConfig } from "./forms/formConfig"

// Types
interface ClientListItem {
    id: string
    tabletNumber?: string
}

type SSEMessage = {
    type: string
    message?: string
    data?: any
    toSend?: number
    targetId?: string
    from?: string
}

interface ExportLogsProps {
    eventData: Event
    eventUserSettings: Record<string, EventSettings>
    editEventUserSettings: (key: string, value: Partial<EventSettings>) => void
}

function useServerConnection(
    serverAddr: string | undefined,
    tabletNumber: string | undefined,
    onGetClientList: (clients: ClientListItem[]) => void,
    eventData: Event
) {
    const [state, setState] = useState({
        clientId: undefined as string | undefined,
        connecting: false,
        connected: false,
        otherClients: [] as ClientListItem[],
    })

    const heartbeatIntervalRef = useRef<NodeJS.Timeout>()
    const eventSourceRef = useRef<EventSource>()
    const clientIdRef = useRef<string>()

    const registerClient = async () => {
        try {
            const res = await axios({
                method: "GET",
                url: `${serverAddr}/register`,
                headers: { "X-Tablet-Number": tabletNumber },
            })

            if (res.status === 200) {
                const id = res.data.clientId
                setState((prev) => ({ ...prev, clientId: id, connected: true }))
                clientIdRef.current = id
                startHeartbeat(id)
                startSynchronizationSSE(id)
                getOtherClients()
            }
        } catch (error) {
            console.error("Registration failed:", error)
            addNotification("error", "Failed to connect to server", serverAddr)
        }
        setState((prev) => ({ ...prev, connecting: false }))
    }

    const startHeartbeat = (clientId: string) => {
        clearInterval(heartbeatIntervalRef.current)

        heartbeatIntervalRef.current = setInterval(async () => {
            if (!clientIdRef.current) return

            try {
                await axios.get(`${serverAddr}/heartbeat/${clientId}`, {
                    headers: { "x-clientId": clientId },
                })
            } catch (error) {
                console.error("Heartbeat failed:", error)
                disconnect()
            }
        }, 19000)
    }

    const startSynchronizationSSE = (clientId: string) => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close()
        }

        const eventSource = new EventSource(
            `${serverAddr}/sse/synchronize/${clientId}`
        )
        eventSourceRef.current = eventSource

        eventSource.onopen = () => {
            console.log("SSE connection opened")
            getOtherClients()
        }

        eventSource.addEventListener("message", (event) => {
            const message: SSEMessage = JSON.parse(event.data)
            handleSSEMessage(message)
        })
    }

    const handleSSEMessage = (message: SSEMessage) => {
        switch (message.type) {
            case "getClients":
                getOtherClients()
                break
            case "data":
                console.log("Received data:", message.data)
                break
            case "requestData":
                axios.post(
                    `${serverAddr}/recieveLogs`,
                    {
                        logs: getLogs(eventData.match_logs),
                        sendTo: message.targetId,
                    },
                    { headers: { "x-clientid": clientIdRef.current } }
                )
                addNotification(
                    "default",
                    `${message.targetId} requesting data`,
                    "Sending Data"
                )
                break
            case "recievedLogs":
                console.log(message.data)
                addNotification(
                    "success",
                    `Got ${message.data.length} logs from ${message.from}`
                )

                db.transaction("rw", db.events, async (trans) => {
                    for (const log of message.data) {
                        await submitLog(trans, eventData.id, log)
                    }
                })
                break
        }
    }

    const getOtherClients = async () => {
        try {
            const res = await axios.get(`${serverAddr}/clientList`)
            const clients = res.data as ClientListItem[]
            const otherClients = clients.filter(
                ({ id }) => id !== clientIdRef.current
            )
            onGetClientList(otherClients)
            setState((prev) => ({
                ...prev,
                otherClients,
            }))
        } catch (error) {
            console.error("Failed to get client list:", error)
        }
    }

    const disconnect = async () => {
        if (!clientIdRef.current) return

        try {
            await axios
                .put(`${serverAddr}/deregister/${clientIdRef.current}`)
                .then(() => {
                    cleanup()
                })

            console.log("Successfully disconnected")
        } catch (error) {
            const err = error as AxiosError
            console.log("error")

            if (err.status === 400) cleanup()
        } finally {
            cleanup()
        }
    }

    const cleanup = () => {
        console.log("clean")
        clearInterval(heartbeatIntervalRef.current)
        eventSourceRef.current?.close()
        clientIdRef.current = undefined
        setState({
            clientId: undefined,
            connecting: false,
            connected: false,
            otherClients: [],
        })
    }

    const connect = async () => {
        if (state.connected || !serverAddr) return

        setState((prev) => ({ ...prev, connecting: true }))

        try {
            axios.get(serverAddr).then(() => {
                registerClient()
            })
        } catch (error) {
            console.error("Connection failed:", error)
            setState((prev) => ({ ...prev, connecting: false }))
        }
    }

    useEffect(() => {
        return () => {
            cleanup()
        }
    }, [])

    return {
        ...state,
        connect,
        disconnect,
    }
}

export const ExportLogs = ({
    eventData,
    eventUserSettings,
}: ExportLogsProps) => {
    const { settings, internetConnected } = useAppContext()
    const [reconnect, setReconnect] = useState(true)
    const [toSync, setToSync] = useState<string[]>([])
    const tabletNumber =
        eventUserSettings[eventData.id]?.tabletNumber?.toString()

    const onGetClientList = (clients: ClientListItem[]) => {
        const currentClientIds = new Set(clients.map((client) => client.id))

        setToSync((prev) => prev.filter((id) => currentClientIds.has(id)))
    }

    const {
        clientId,
        connecting,
        connected,
        otherClients,
        connect,
        disconnect,
    } = useServerConnection(
        settings.serverAddr,
        tabletNumber,
        onGetClientList,
        eventData
    )

    const toggleSync = (id: string) => {
        setToSync((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        )
    }

    const handleSync = async () => {
        if (!clientId || toSync.length === 0) return

        axios.put(`${settings.serverAddr}/beginSync/${clientId}`, toSync)
    }

    useEffect(() => {
        if (!reconnect || !internetConnected) return

        const interval = setInterval(() => {
            if (!connected) {
                connect()
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [reconnect, connected, internetConnected, connect])

    return (
        <div className="flex w-full flex-col gap-2 px-3 py-2">
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                <Paragraph size="sm" className="flex items-center gap-2">
                    {connected
                        ? "Connected"
                        : connecting
                          ? "Connecting"
                          : "Not Connected"}
                    {connecting ? (
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                    ) : (
                        connected && <Check className="h-5 w-5" />
                    )}
                </Paragraph>

                <div className="flex items-center gap-1">
                    <Button
                        variant="link"
                        className="overflow-hidden text-xs text-ellipsis"
                        size="none"
                        onClick={connected ? disconnect : connect}
                        disabled={connecting}
                    >
                        {connected ? "Disconnect" : "Connect"}
                    </Button>

                    <Dot />

                    <Paragraph size="xs" className="overflow-hidden">
                        {clientId || "No ID"}
                    </Paragraph>

                    <Dot />

                    <Toggle
                        size="md"
                        toggleValue={reconnect}
                        onClick={() => setReconnect(!reconnect)}
                    >
                        Reconnect
                    </Toggle>
                </div>
            </div>

            <ul className="relative flex max-h-40 flex-col overflow-y-scroll">
                {connected ? (
                    <>
                        <div className="sticky top-0 flex justify-end rounded-t p-2 px-4 dark:bg-neutral-900">
                            <Button
                                className="text-xs"
                                variant="link"
                                size="none"
                                onClick={() => setToSync([])}
                            >
                                Clear
                            </Button>
                        </div>
                        {otherClients.map(({ id, tabletNumber }) => (
                            <li
                                key={id}
                                className="mb-0.5 flex items-center justify-between bg-neutral-900/50 p-2 last:mb-0 even:bg-neutral-900/25"
                            >
                                <Paragraph className="text-xs">
                                    Tablet {tabletNumber}
                                </Paragraph>
                                <div className="flex items-center gap-4">
                                    <Paragraph size="xs">{id}</Paragraph>
                                    <Toggle
                                        toggleValue={toSync.includes(id)}
                                        onClick={() => toggleSync(id)}
                                        variant="box"
                                        size="sm"
                                    />
                                </div>
                            </li>
                        ))}
                        {otherClients.length === 0 && (
                            <Paragraph className="mx-auto my-2 rounded bg-neutral-900/50 px-4 py-1.5 text-xs">
                                Nobody else connected
                            </Paragraph>
                        )}
                        <div className="rounded-b p-2 px-4 dark:bg-neutral-900"></div>
                    </>
                ) : (
                    <Paragraph className="mx-auto rounded bg-neutral-900/50 px-4 py-1.5 text-sm">
                        Connect to sync
                    </Paragraph>
                )}
            </ul>
            <Button
                className="w-fu mt-1.5"
                size="lg"
                onClick={handleSync}
                disabled={!connected || toSync.length === 0}
            >
                Sync
            </Button>
        </div>
    )
}
