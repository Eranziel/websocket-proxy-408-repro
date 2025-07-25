import http from "http";
import express from "express";

const app = express();

app.set("host", "127.0.0.1");
app.set("port", 8080);
app.set("ssl_port", 8443);

app.use("/", (req, res, next) => {
    console.log("Request:", req);
    console.log("Response:", res);
    next();
});

app.listen = () => {
    const server = http.createServer(app);
    const port = app.get("port");
    const host = app.get("host");
    server.listen(port, host);
    console.log(`Server is listening on ${host}:${port}`);
    console.log(`Server timeouts: ${server.headersTimeout / 1000}s  |  ${server.requestTimeout / 1000}s`);
    return app;
};
export default app.listen();
