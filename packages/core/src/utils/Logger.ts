import { createLogger, transports, format } from 'winston';

export function createWinstonLogger(service: string) {
  return createLogger({
    level: process.env['LOG_LEVEL'] || 'info',
    defaultMeta: { service },
    format: format.combine(
      format.simple(),
      format.label({
        label: '[LOGGER]',
      }),
      format.colorize({ all: true }),
      format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
      format.align(),
      format.printf((info) => `[${info.level}] ${new Date().toLocaleDateString('en-EN')} : ${info.message}`)
    ),
    transports: [new transports.Console()],
  });
}
