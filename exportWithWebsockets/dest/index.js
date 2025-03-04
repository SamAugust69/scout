"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const ws_1 = __importDefault(require("ws"));
const PORT = 155;
// Load SSL/TLS certificates
const server = https_1.default.createServer({
    cert: fs_1.default.readFileSync("./cert.pem"), // Path to your certificate
    key: fs_1.default.readFileSync("./key.pem"), // Path to your private key
});
// Create a WebSocket server attached to the HTTPS server
const wss = new ws_1.default.Server({ server });
const clients = new Map();
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 9); // Simple unique ID generator
}
server.listen(PORT, () => {
    console.log(`WebSocket server listening on wss://localhost:${PORT}`);
});
// Request Types
// syncLogsRequest
// getLogsFromClient
// giveLogsToClient
// (toSyncId) syncLogsRequest -> server
// server getLogs -> (all clients excl. toSyncId) -> (id) syncLogs -> server
wss.on("connection", (ws) => {
    console.log("Connection!");
    const id = generateUniqueId();
    clients.set(id, ws);
    ws.send(JSON.stringify({ type: "hello", targetId: id }));
    ws.on("message", (message) => {
        var _a;
        try {
            const parsedMessage = JSON.parse(message.toString());
            switch (parsedMessage.type) {
                case "syncLogsRequest":
                    // Client requests logs
                    console.log(`syncLogsRequest from ${parsedMessage.targetId}`);
                    clients.forEach((socket, id) => {
                        if (parsedMessage.targetId !== id) {
                            console.log(`getLogs request sent to ${id}`);
                            socket.send(JSON.stringify({
                                type: "getLogs",
                                targetId: parsedMessage.targetId,
                            }));
                        }
                    });
                    break;
                case "syncLogs":
                    if (parsedMessage.targetId === undefined) {
                        console.log("No targetID");
                        return;
                    }
                    console.log(`${parsedMessage.targetId} Requesting Log Sync`);
                    (_a = clients.get(parsedMessage.targetId)) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                        type: "syncData",
                        data: parsedMessage.data,
                    }));
                    break;
                default:
                    console.log(`Received unknown request "${parsedMessage.type}"`);
                    break;
            }
        }
        catch (error) {
            console.log(error);
        }
    });
    ws.on("close", () => {
        clients.delete(id);
        console.log("disconnect");
    });
});
//# sourceMappingURL=index.js.map