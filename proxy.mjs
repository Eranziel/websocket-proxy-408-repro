import http from "http";
import express from "express";
import httpProxy from "http-proxy-3";

import logWithTime from "./common.mjs";

const app = express();
app.set("host", "127.0.0.1");
app.set("port", 8081);
app.set("ssl_port", 8444);

const host = "http://127.0.0.1:8080";

const server = http.createServer(app);
server.headersTimeout = 60000; // Default is 60 sec
server.requestTimeout = 300000; // Default is 300 sec

const proxy = httpProxy.createProxyServer({
    ws: true,
    xfwd: true,
});
proxy.on("error", (err, req, res) => {
    logWithTime("Got a Proxy error : ", err);
    try {
        res.status(502).send("Bad Gateway");
    } catch {
        // WS ?
    }
});

// app.use((req, res, next) => {
//     const catchProxyError = (err) => {
//         if (err) {
//             return next(err);
//         }
//         next();
//     };
//     logWithTime(`${req.ip} ${req.method} ${req.path} - Proxying to host at ${host}`);
//     // Proxy request to host
//     if (req.headers && req.headers.upgrade && req.headers.upgrade.toLowerCase() == "websocket") {
//         logWithTime("Websocket upgrade");
//         proxy.ws(req, req.socket, { target: host }, catchProxyError);
//     } else {
//         proxy.web(req, res, { target: host }, catchProxyError);
//     }
// });

server.on("upgrade", (req, socket, head) => {
    proxy.ws(req, socket, { target: host });
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
