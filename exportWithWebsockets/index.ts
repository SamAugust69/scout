import https from "https"
import fs, { stat } from "fs"
import WebSocket, { MessageEvent } from "ws"

const PORT = 155

// Load SSL/TLS certificates

// Create a WebSocket server attached to the HTTPS server
const wss = new WebSocket.Server({port: PORT})

const clients = new Map<string, WebSocket>()

function generateUniqueId() {
    return Math.random().toString(36).substring(2, 9) // Simple unique ID generator
}

wss.on("listening", () => {
    console.log(`WebSocket server listening on ws://localhost:${PORT}`)
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

    const logsToSync: any[] = []
    var logsRecieved = 0
    const clientsToSync = new Map<string, WebSocket>()

    ws.on("message", (message: MessageEvent) => {
        try {
            const parsedMessage = JSON.parse(message.toString()) as {
                type: string
                targetId?: string // Optional target client ID
                data?: any // Data to be synced
            }

            switch (parsedMessage.type) {
                case "syncLogsRequest":
                    // Client requests logs
                    console.log(
                        `syncLogsRequest from ${parsedMessage.targetId}`
                    )

                    console.log(clientsToSync.size)

                    clientsToSync.forEach((socket, id) => {
                            console.log(`getLogs request sent to ${id}`)
                            socket.send(
                                JSON.stringify({
                                    type: "getLogs",
                                    targetId: parsedMessage.targetId,
                                })
                            )
                    })
                    break

                case "listClients":

                    if (!parsedMessage.targetId) {
                        console.log("No targetID")
                        return
                    }
                    clients.get(parsedMessage.targetId)
                    break
                case "toggleSendLogs":
                    const value = parsedMessage.data
                    const clientId = parsedMessage.targetId
                    console.log("toggleSendLogs")
                    console.log("Setting to ", value)

                    if (!clientId) {
                        console.log("No clientId recieved")
                        return
                    }

                    if (value === false) {
                        // found client ID within toSync
                        console.log("Found client, toggling off")
                        clientsToSync.delete(clientId)
                        return
                    }
                    console.log("Adding client to list")

                    const id = clients.get(clientId)

                    if (!id) {
                        console.log("Couldn't get clientId?")
                        return
                    }

                    clientsToSync.set(clientId, id)
                    break

                case "syncLogs":
                    if (parsedMessage.targetId === undefined) {
                        console.log("No targetID")
                        return
                    }

                    console.log(`${parsedMessage.targetId} Requesting Log Sync`)

                    const logs = parsedMessage.data as any[]

                    logsToSync.push(...logs)
                    logsRecieved++

                    console.log("Recieved: ", logsRecieved)
                    console.log("Total clients to sync: ", clientsToSync.size)

                    if (logsRecieved >= clientsToSync.size) {
                        console.log(`Syncing ${logsToSync.length} logs`)
                        clients.get(parsedMessage.targetId)?.send(
                            JSON.stringify({
                                type: "syncData",
                                data: parsedMessage.data,
                            })
                        )


                        logsRecieved = 0
                        logsToSync.splice(0, logsToSync.length);

                    }


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
