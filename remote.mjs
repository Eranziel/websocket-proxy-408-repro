import { io } from "socket.io-client";
import logWithTime from "./common.mjs";

const host = "http://127.0.0.1";
const port = "8080";

logWithTime(`Attempting to connect to ${host}:${port}`);

const socket = io(`${host}:${port}`, {
    path: "/socket.io",
    transports: ["websocket"],
    upgrade: false,
    reconnection: true,
    forceNew: true,
    autoConnect: false,
});

socket.on("connect", () => {
    logWithTime(`Connected`);
});

socket.on("disconnect", () => {
    logWithTime(`Disconnected`);
});

socket.on("connect_error", (err) => {
    logWithTime(`Connection error: ${err}`);
});

socket.on("connect_timeout", (err) => {
    logWithTime(`Connection timeout: ${err}`);
});

socket.on("error", (err) => {
    logWithTime(`Error: ${err}`);
});

socket.on("ping", (data) => {
    logWithTime(`Received ping:`, data);
});

socket.on("pong", (data) => {
    logWithTime(`Received pong:`, data);
});

socket.connect();

let i = 0;

while (true) {
    // Sleep for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));
    if (socket.connected) {
        i++;
        logWithTime(`Send ping ${i}...`);
        socket.emit("ping", { iteration: i });
    } else {
        logWithTime(`Socket is still disconnected`);
    }
}
