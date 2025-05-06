import express, { Response } from "express"
import cors from "cors"
import bodyParser from "body-parser"

const PORT = 155
const INACTIVITYTIME = 31 // seconds

type Client = {
    lastSeen: number
    tabletNumber?: string
    response?: Response
}

function generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 9)
}

const app = express()
app.use(cors())
app.use(bodyParser.json())
const clients = new Map<string, Client>()

// Sync stuff
const clientsToSync = new Map<string, Response>()
let syncTarget: string | null = null

const findClientId = (clientId: string): Client | null => {
    if (clientId && clients.has(clientId)) {
        const client = clients.get(clientId)
        if (client) return client
    }
    return null
}

// Every request updates lastseen
app.use((req, res, next) => {
    const id = req.headers["x-clientid"] as string
    const client = findClientId(id || "")
    // console.log(req.headers)

    if (client) {
        console.log(`Last seen updated for ${id}`)
        client.lastSeen = Date.now()
    }

    next()
})

app.get("/", (req, res) => {
    res.status(200).send()
})

// Register clientID
app.get("/register", (req, res) => {
    const id = generateUniqueId()
    const tabletNumber = req.headers["x-tablet-number"] as string

    if (clients.has(id)) {
        res.status(500)
        console.log(`id ${id} already present in clients, not registering`)
        return
    }

    clients.forEach((client) => {
        console.log(client)
        if (client.response)
            sseWrite(client.response, {
                type: "getClients",
            })
    })

    clients.set(id, { lastSeen: Date.now(), tabletNumber })
    console.log(`Registered client ${id} ${tabletNumber}`)

    res.json({ clientId: id })
})

// Degister clientID
app.put("/deregister/:clientId", (req, res) => {
    const { clientId } = req.params

    const client = findClientId(clientId)

    if (!client) {
        res.status(400).send({ error: `No client with id ${clientId}` })
        return
    }

    res.status(200)

    disconnectClient(clientId)
})

// Send over synchronization list
app.get("/clientList", (req, res) => {
    console.log("Getting client list")
    const clientTablet: { id: string; tabletNumber?: string }[] = []
    clients.forEach(({ tabletNumber }, key) => {
        clientTablet.push({ id: key, tabletNumber })
    })
    res.status(200).send(clientTablet)
})

app.post("/recieveLogs", (req, res) => {
    const fromId = req.headers["x-clientid"]
    if (!syncTarget) {
        res.status(400).send({ error: "No sync target set" })
        return
    }

    const { logs, sendTo } = req.body

    console.log(req.headers)

    const clientToSync = clients.get(sendTo)

    if (!clientToSync) {
        res.status(404).json({ error: "Client to sync not found" })
        return
    }

    if (!clientToSync.response) return

    console.log(fromId)

    sseWrite(clientToSync.response, {
        type: "recievedLogs",
        data: logs,
        from: fromId,
    })

    res.status(200).send({ message: "Successfully sent data" })
})

app.put("/beginSync/:targetId", (req, res) => {
    const { targetId } = req.params

    if (!targetId) {
        res.status(404).send({ error: `No target ID provided` })
        return
    }

    const client = findClientId(targetId)

    if (!client) {
        res.status(400).send({ error: `No client with id ${targetId}` })
        return
    }
    const toRequest = req.body as string[]

    toRequest.map((id) => {
        const clientToSync = findClientId(id)

        if (!clientToSync || !clientToSync.response) return

        sseWrite(clientToSync.response, {
            type: "requestData",
            targetId: targetId,
        })
    })
})

// ---- SSE ----

app.get("/sse/synchronize/:clientId", (req, res) => {
    const { clientId } = req.params
    const client = clients.get(clientId)

    if (!client) {
        console.error("Client not found")
        res.status(404).json({ error: "Client not found" })
        return
    }

    // Set up SSE headers
    res.setTimeout(0)
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.flushHeaders()

    // Set response and syncId
    client.response = res
    syncTarget = clientId

    // for (const [id, res] of clientsToSync.entries()) {
    //     console.log(`Requesting data from ${id}`)
    //     res.write(`data: ${JSON.stringify({ type: "requestData" })}\n\n`)
    // }

    // Send a heartbeat to keep the connection alive- not working?
    const heartbeatInterval = setInterval(() => {
        client.response?.write(": keep-alive\n\n")
    }, 29000)

    sseWrite(res, {
        type: "hello",
        message: `Connected to SSE, hi`,
    })

    req.on("close", () => {
        console.log("Sync target closed")

        disconnectClient(clientId)

        client.response = undefined
        clearInterval(heartbeatInterval)
    })
})

const sseWrite = (res: Response, data: Object) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
}

app.get("/heartbeat/:clientId", (req, res) => {
    const { clientId } = req.params
    const client = findClientId(clientId)

    if (!client) {
        res.status(404).send({ error: `Client with id ${clientId} not found` })
        return
    }

    res.status(200).send({ message: "Alive" })
})

const disconnectClient = (clientId: string) => {
    clients.delete(clientId)
    clientsToSync.has(clientId) && clientsToSync.delete(clientId)

    // force all other clients to re-request other clients
    // for tablet list
    clients.forEach(({ response }) => {
        if (response)
            sseWrite(response, {
                type: "getClients",
            })
    })

    console.log(`Client ${clientId} removed`)
}

// every 10 seconds, check if each client has been inactive for INACTIVITYTIMEs, if so, remove
setInterval(() => {
    const now = Date.now()
    const disconnetionTime = INACTIVITYTIME * 1000
    for (const [clientId, client] of clients.entries()) {
        if (now - client.lastSeen > disconnetionTime) {
            console.log(`Removing ${clientId} for inactivity`)
            disconnectClient(clientId)
        }
    }
}, 10000)

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
