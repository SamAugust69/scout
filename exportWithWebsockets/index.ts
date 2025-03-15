import express, { Response } from "express"

const PORT = 155
const INACTIVITYTIME = 10 // seconds

type Message = {}

type Client = {
    lastSeen: number
    messages: Message[]
    response?: Response
}

function generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 9)
}

const app = express()
const clients = new Map<string, Client>()

// Sync stuff
const clientsToSync = new Set<string>()
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
    const client = findClientId(req.headers["x-client-id"] as string)

    if (client) {
        console.log("Last seen updated")
        client.lastSeen = Date.now()
    }

    next()
})

// Register clientID
app.get("/register", (req, res) => {
    const id = generateUniqueId()

    if (clients.has(id)) {
        res.status(500)
        console.log(`id ${id} already present in clients, not registering`)
        return
    }
    clients.set(id, { lastSeen: Date.now(), messages: [] })
    console.log(`Registered client ${id}`)

    res.json({ clientId: id })
})

app.put("/deregister", (req, res) => {
    const clientId = req.headers["x-client-id"] as string

    const client = findClientId(clientId)

    if (!client) return

    disconnectClient(clientId)
})

app.get("/toggleSync", (req, res) => {
    res.status(200).send(Array.from(clientsToSync))
})

app.put("/toggleSync", (req, res) => {
    const clientId = req.headers["x-client-id"] as string
    const client = findClientId(clientId)
    console.log(`Client toggle sync: ${clientId}`)

    if (!client) {
        console.log(`No client with id ${clientId} found!`)
        res.status(404).send({ error: `Client with id ${clientId} not found` })
        return
    }

    // Remove client from sync list
    if (clientsToSync.has(clientId)) {
        clientsToSync.delete(clientId)
        console.log(`Removed client ${clientId} to clientsToSync`)
        res.status(200).send()
        return
    }

    // Add client to sync list
    clientsToSync.add(clientId)
    console.log(`Added client ${clientId} to clientsToSync`)
    res.status(201).send()
})

app.post("/startSync", (req, res) => {
    const clientId = req.headers["x-client-id"] as string
    const client = findClientId(clientId)

    if (!client) {
        res.status(404).send({ error: `Client with id ${clientId} not found` })
        return
    }

    syncTarget = clientId
    res.status(200).send({ message: "Started syncing" })

    for (const [id] of clientsToSync.entries()) {
        console.log(`Attempting to pull from ${id} to ${clientId}`)
        const client = findClientId(id)

        client?.messages.push()
    }
})

app.get("/sse/:clientId", (req, res) => {
    const { clientId } = req.params

    if (!clients.has(clientId)) {
        res.status(404).json({ error: "Client not found" })
        return
    }

    // Set up SSE headers
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")

    // Store the response object for the sync target
    const client = clients.get(clientId)
    if (client) {
        client.response = res
    }

    // Send a heartbeat to keep the connection alive
    const heartbeatInterval = setInterval(() => {
        res.write(": heartbeat\n\n")
    }, 30000)

    // Clean up when the client disconnects
    req.on("close", () => {
        clearInterval(heartbeatInterval)
        if (client) {
            client.response = undefined // Clear the response object
        }
    })
})

app.get("/heartbeat", (req, res) => {
    const clientId = req.headers["x-client-id"] as string
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
    console.log(`Client ${clientId} removed`)
}

// Every 10 seconds, check if each client has been inactive for INACTIVITYTIMEs, if so, remove
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
