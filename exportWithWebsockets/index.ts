import WebSocket, { MessageEvent } from "ws"

const PORT = 155

const wss = new WebSocket.Server({ port: PORT })

const clients = new Map<string, WebSocket>()

function generateUniqueId() {
    return Math.random().toString(36).substring(2, 9) // Simple unique ID generator
}

wss.on("listening", (ws: WebSocket) => {
    console.log(`Websocket listening on port ${PORT}`)
})

// Request Types

// syncLogsRequest
// getLogsFromClient
// giveLogsToClient

// (toSyncId) syncLogsRequest -> server
// server getLogs -> (all clients excl. toSyncId) -> (id) syncLogs -> server

wss.on("connection", (ws: WebSocket) => {
    console.log("Connection!")

    const id = generateUniqueId()
    clients.set(id, ws)

    ws.send(JSON.stringify({ type: "hello", targetId: id }))

    ws.on("message", (message: MessageEvent) => {
        try {
            const parsedMessage = JSON.parse(message.toString()) as {
                type: string
                targetId?: string // Optional target client ID
                data?: any // Data to be synced
            }

            switch (parsedMessage.type) {
                case "syncLogsRequest":
                    // client requests logs

                    console.log(
                        `syncLogsRequest from ${parsedMessage.targetId}`
                    )

                    clients.forEach((socket, id) => {
                        if (parsedMessage.targetId !== id) {
                            console.log(`getLogs request sent to ${id}`)
                            socket.send(
                                JSON.stringify({
                                    type: "getLogs",
                                    targetId: parsedMessage.targetId,
                                })
                            )
                        }
                    })
                    break

                case "syncLogs":
                    if (parsedMessage.targetId === undefined) {
                        console.log("No targetID")
                        return
                    }

                    console.log(`${parsedMessage.targetId} Requesting Log Sync`)

                    clients.get(parsedMessage.targetId)?.send(
                        JSON.stringify({
                            type: "syncData",
                            data: parsedMessage.data,
                        })
                    )

                    break
                default:
                    console.log(
                        `Received unknown request "${parsedMessage.type}"`
                    )
                    break
            }
        } catch (error) {
            console.log(error)
        }
    })

    ws.on("close", () => {
        clients.delete(id)
        console.log("disconnect")
    })
})
