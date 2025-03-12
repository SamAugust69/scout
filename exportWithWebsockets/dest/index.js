"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PORT = 155;
const INACTIVITYTIME = 180; // seconds
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 9);
}
const app = (0, express_1.default)();
const clients = new Map();
const clientsToSync = new Set();
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
    const client = findClientId(req.headers["x-client-id"]);
    if (client) {
        console.log("Last seen updated");
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
    clients.set(id, { lastSeen: Date.now(), messages: [] });
    console.log(`Registered client ${id}`);
    res.json({ clientId: id });
});
app.get("/toggleSync", (req, res) => {
    res.status(200).send(Array.from(clientsToSync));
});
app.put("/toggleSync", (req, res) => {
    const clientId = req.headers["x-client-id"];
    const client = findClientId(clientId);
    console.log(`Client toggle sync: ${clientId}`);
    if (!client) {
        console.log(`No client with id ${clientId} found!`);
        res.status(404).send();
        return;
    }
    // remove client
    if (clientsToSync.has(clientId)) {
        clientsToSync.delete(clientId);
        console.log(`Removed client ${clientId} to clientsToSync`);
        res.status(200).send();
        return;
    }
    // add client
    clientsToSync.add(clientId);
    console.log(`Added client ${clientId} to clientsToSync`);
    res.status(201).send();
});
const onDisconnect = (clientId) => {
    clients.delete(clientId);
    console.log(`Client ${clientId} removed due to inactivity`);
};
// Every 10 seconds, check if each client has been inactive for 30s, if so, remove
setInterval(() => {
    const now = Date.now();
    const disconnetionTime = INACTIVITYTIME * 1000;
    for (const [clientId, client] of clients.entries()) {
        if (now - client.lastSeen > disconnetionTime) {
            onDisconnect(clientId);
        }
    }
}, 10000);
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map