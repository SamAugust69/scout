import { ChangeEvent, useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Paragraph } from "./ui/paragraph"
import { ConnectToWebsocket } from "@/lib/webSocket"
import { Check, Dot, LoaderCircleIcon, X } from "lucide-react"
import { addNotification } from "./ui/notifications"
import { ClientMessage } from "@/lib/types/syncTypes"
import { getLogs } from "@/lib/getLogs"
import { Event } from "@/lib/types/eventType"

type WebsocketMessage = {
    type: string
    targetId?: string
}

type WebsocketMessageData = {
    type: string
    data?: string
}

enum ConnectionStates {
    notConnected = "Not Connected",
    connecting = "Connecting",
    connected = "Connected",
    error = "Error",
}

export const ExportLogsWebsocket = ({
    eventData,
}: {
    eventData: Event | null
}) => {
    const [address, setAddress] = useState<string>("")

    const [connectionStatus, setConnectionStatus] = useState(
        ConnectionStates.notConnected
    )
    const [socket, setSocket] = useState<WebSocket | null>(null)

    const [showConnectionIcon, setShowConnectionIcon] = useState<boolean>(false)
    const [clientID, setClientID] = useState<string | null>("")

    const createConnection = () => {
        setShowConnectionIcon(true)

        if (address.length < 3) {
            addNotification("error", "Address is less than 3 characters long")
            setConnectionStatus(ConnectionStates.error)
            setShowConnectionIcon(true)
            setClientID(null)
            setTimeout(() => setShowConnectionIcon(false), 1000)
            setTimeout(
                () => setConnectionStatus(ConnectionStates.notConnected),
                3000
            )
        }

        const onConnection = () => {
            setConnectionStatus(ConnectionStates.connected)
            addNotification("success", "Connected")
            setTimeout(() => setShowConnectionIcon(false), 1000)
        }

        const onError = () => {
            setConnectionStatus(ConnectionStates.error)
            setShowConnectionIcon(true)
            setClientID(null)
            setTimeout(() => setShowConnectionIcon(false), 1000)
            setTimeout(
                () => setConnectionStatus(ConnectionStates.notConnected),
                3000
            )
        }

        const onMessage = (socket: WebSocket, e: MessageEvent<any>) => {
            const data: WebsocketMessage = JSON.parse(e.data)
            console.log(data)

            // console.log(data);

            switch (data.type) {
                case "hello":
                    if (data.targetId) setClientID(data.targetId)
                    break
                case "getLogs":
                    console.log("Give me ur data. ", data)

                    const response: ClientMessage = {
                        type: "syncLogs",
                        targetId: data.targetId,
                        data: getLogs(eventData?.match_logs || []),
                    }

                    socket.send(JSON.stringify(response))

                    break
                case "syncData":
                    const recievedData = data as WebsocketMessageData
                    console.log("I got some data!", recievedData.data)
            }
        }
        if (socket) socket.close()

        const newSocket = ConnectToWebsocket(
            address,
            onConnection,
            (e) => onMessage(newSocket, e),
            onError
        )

        setSocket(newSocket)
    }

    useEffect(() => {
        if (socket === null) {
            setConnectionStatus(ConnectionStates.notConnected)
        } else setConnectionStatus(ConnectionStates.connected)

        // cleanup function
        return () => {
            if (socket) {
                socket.close()
            }
        }
    }, [socket])

    const getOtherLogs = () => {
        if (!clientID) return
        const request: ClientMessage = {
            type: "syncLogsRequest",
            targetId: clientID,
        }
        socket?.send(JSON.stringify(request))
    }

    const disconnectSocket = () => {
        socket?.close()
        setSocket(null)
    }

    return (
        <div className="flex w-full flex-col gap-1">
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
                        socket === null
                            ? createConnection()
                            : disconnectSocket()
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
        </div>
    )
}
