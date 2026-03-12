# Websocket Proxy Timeout Bug

When using `http-proxy-3` to proxy long-lived websocket connections, the socket will be disconnected every ~90 seconds. This minimal reproduction demonstrates the bug.

## Usage

This reproduction consists of 3 node scripts:

1. `host.mjs` - This is the "main" server, the ultimate destination of the websocket requests. It logs any "ping" events received on the socket and responds by emitting a "pong" event with the same payload.
2. `remote.mjs` - This is the client which initiates the websocket connections. It attempts to send a "ping" event on the websocket every 5 seconds, and will log any "pong" events received. Multiple copies of this can be run simultaneously if desired.
3. `proxy.mjs` - This is the proxy server standing between `remote` and `host`. It proxies all received requests to `host`.
   a. If the request headers indicate a websocket connection, it uses `http-proxy-3`'s `.ws` method to proxy.
   b. Otherwise, it uses `http-proxy-3`'s `.web` method to proxy.

Running the 3 scripts as provided will demonstrate the bug. After approximately 90 seconds, `proxy.mjs` will log an `ERR_HTTP_REQUEST_TIMEOUT` and `host.mjs` and `remote.mjs` will both log that the socket was disconnected.

The time until the timeout error can be modified by changing `server.headersTimeout` and `server.requestTimeout` in `proxy.mjs`. The timeout will occur 30 seconds after the shorter value.
