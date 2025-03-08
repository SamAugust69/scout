"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const PORT = 155;
const httpServer = (0, http_1.createServer)();
const io = new socket_io_1.Server(httpServer, {
// options
});
const clients = new Map();
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 9); // Simple unique ID generator
}
io.on("connection", (socket) => {
    console.log("Connection!");
    const id = generateUniqueId();
    clients.set(id, socket);
    socket.emit("message", { newId: id });
    socket.on("message", (message) => {
        console.log(message);
    });
    socket.on("disconnect", () => {
        console.log("Disconnected...");
    });
});
httpServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
//# sourceMappingURL=index2.js.map