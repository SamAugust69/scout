"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PORT = 155;
const INACTIVITYTIME = 100; // seconds
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 9);
}
const app = (0, express_1.default)();
const clients = new Map();
// Sync stuff
const clientsToSync = new Map();
let syncTarget = null;
const findClientId = (clientId) => {
    if (clientId && clients.has(clientId)) {
        const client = clients.get(clientId);
        if (client)
            return client;
    }
    return null;
};
// Every request updates lastseen
app.use((req, res, next) => {
    const id = req.headers["x-clientid"];
    const client = findClientId(id || "");
    // console.log(req.headers)
    if (client) {
        console.log(`Last seen updated for ${id}`);
        client.lastSeen = Date.now();
    }
    next();
});
// Register clientID
app.get("/register", (req, res) => {
    const id = generateUniqueId();
    if (clients.has(id)) {
        res.status(500);
        console.log(`id ${id} already present in clients, not registering`);
        return;
    }
    clients.set(id, { lastSeen: Date.now() });
    console.log(`Registered client ${id}`);
    res.json({ clientId: id });
});
// Degister clientID
app.put("/deregister/:clientId", (req, res) => {
    const { clientId } = req.params;
    const client = findClientId(clientId);
    if (!client) {
        res.status(400).send({ error: `No client with id ${clientId}` });
        return;
    }
    disconnectClient(clientId);
});
// Send over synchronization list
app.get("/synchronizationList", (req, res) => {
    console.log("Getting sync list");
    res.status(200).send(Array.from(clientsToSync.keys()));
});
app.post("/sendLogs", (req, res) => {
    var _a;
    if (!syncTarget) {
        res.status(400).send({ error: "No sync target set" });
        return;
    }
    const clientToSync = clients.get(syncTarget);
    if (!clientToSync) {
        res.status(404).json({ error: "Client to sync not found" });
        return;
    }
    const data = { data: "hi" };
    (_a = clientToSync.response) === null || _a === void 0 ? void 0 : _a.write(JSON.stringify({ type: "data", data }));
    res.status(200).send({ message: "Successfully sent data" });
});
// ---- SSE ----
app.get("/sse/enableSynchronization/:clientId", (req, res) => {
    const { clientId } = req.params;
    const client = clients.get(clientId);
    if (!client) {
        console.error("Client not found");
        res.status(404).json({ error: "Client not found" });
        return;
    }
    // Set up SSE headers
    res.setTimeout(0);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    // Add client to syncList
    clientsToSync.set(clientId, res);
    console.log(`Added client ${clientId} to clientsToSync`);
    res.write(`data: ${JSON.stringify({ type: "hello", message: "Connected to SSE, waiting for synchronization request" })}\n\n`);
    const heartbeatInterval = setInterval(() => {
        var _a;
        (_a = client.response) === null || _a === void 0 ? void 0 : _a.write(": keep-alive\n\n");
    }, 29000);
    req.on("close", () => {
        console.log("Sync closed");
        clientsToSync.delete(clientId);
        clearInterval(heartbeatInterval);
    });
});
app.get("/sse/synchronize/:clientId", (req, res) => {
    const { clientId } = req.params;
    const client = clients.get(clientId);
    if (!client) {
        console.error("Client not found");
        res.status(404).json({ error: "Client not found" });
        return;
    }
    // Set up SSE headers
    res.setTimeout(0);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    // Set response and syncId
    client.response = res;
    syncTarget = clientId;
    for (const [id, res] of clientsToSync.entries()) {
        console.log(`Requesting data from ${id}`);
        res.write(`data: ${JSON.stringify({ type: "requestData" })}\n\n`);
    }
    // Send a heartbeat to keep the connection alive- not working?
    const heartbeatInterval = setInterval(() => {
        var _a;
        (_a = client.response) === null || _a === void 0 ? void 0 : _a.write(": keep-alive\n\n");
    }, 29000);
    res.write(JSON.stringify({
        type: "hello",
        message: `Connected to SSE, sending requests to ${clientsToSync.size} clients`,
    }));
    req.on("close", () => {
        console.log("Sync target closed");
        syncTarget = null;
        client.response = undefined;
        clearInterval(heartbeatInterval);
    });
});
app.get("/heartbeat/:clientId", (req, res) => {
    const { clientId } = req.params;
    const client = findClientId(clientId);
    if (!client) {
        res.status(404).send({ error: `Client with id ${clientId} not found` });
        return;
    }
    res.status(200).send({ message: "Alive" });
});
const disconnectClient = (clientId) => {
    clients.delete(clientId);
    clientsToSync.has(clientId) && clientsToSync.delete(clientId);
    console.log(`Client ${clientId} removed`);
};
// Every 10 seconds, check if each client has been inactive for INACTIVITYTIMEs, if so, remove
setInterval(() => {
    const now = Date.now();
    const disconnetionTime = INACTIVITYTIME * 1000;
    for (const [clientId, client] of clients.entries()) {
        if (now - client.lastSeen > disconnetionTime) {
            console.log(`Removing ${clientId} for inactivity`);
            disconnectClient(clientId);
        }
    }
}, 10000);
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map