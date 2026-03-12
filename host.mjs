import http from "http";
import express from "express";
import { Server as SocketServer } from "socket.io";

import logWithTime from "./common.mjs";

const app = express();
app.set("host", "127.0.0.1");
app.set("port", 8080);
app.set("ssl_port", 8443);

const server = http.createServer(app);
const socketServer = new SocketServer(server, {
    path: "/socket.io",
    origins: "*:*",
    // pingInterval: 2e4,
    // pingTimeout: 6e5,
    cookie: true,
    // maxHttpBufferSize: 1e8,
});
socketServer.on("connection", (socket) => {
    logWithTime(`Socket connection initiated`);
    socket.on("ping", (data) => {
        logWithTime(`Ping received:`, data);
        socketServer.emit("pong", data);
    });
});

app.use((req, res, next) => {
    logWithTime("Request from", req.ip, "for", req.path, req.method);
    next();
});

app.listen = () => {
    const port = app.get("port");
    const host = app.get("host");
    server.listen(port, host);
    logWithTime(`Server is listening on ${host}:${port}`);
    logWithTime(`Server timeouts: ${server.headersTimeout / 1000}s  |  ${server.requestTimeout / 1000}s`);
    return app;
};
export default app.listen();
