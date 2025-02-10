import pino from "pino";
import "pino-pretty";

export function createPinoLogger(service: string) {
  const logger = pino({
    level: process.env["LOG_LEVEL"] || "info",
    base: { service },
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "YY-MM-DD HH:mm:ss",
        ignore: "pid,hostname",
      },
    },
  });
  return logger;
}
