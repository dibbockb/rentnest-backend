type LogLevel = "info" | "warn" | "error";

const timestamp = () => new Date().toISOString();

const write = (level: LogLevel, message: string, meta?: unknown) => {
    const line = `[${timestamp()}] [${level.toUpperCase()}] ${message}`;
    const payload = meta !== undefined ? { ...(typeof meta === "object" && meta !== null ? meta : { meta }) } : undefined;

    if (level === "error") {
        payload ? console.error(line, payload) : console.error(line);
    } else if (level === "warn") {
        payload ? console.warn(line, payload) : console.warn(line);
    } else {
        payload ? console.log(line, payload) : console.log(line);
    }
};

export const logger = {
    info: (message: string, meta?: unknown) => write("info", message, meta),
    warn: (message: string, meta?: unknown) => write("warn", message, meta),
    error: (message: string, meta?: unknown) => write("error", message, meta),
};