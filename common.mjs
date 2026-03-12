export default function logWithTime(msg, ...args) {
    console.log(`${new Date().toTimeString()} | ${msg}`, ...args);
}
