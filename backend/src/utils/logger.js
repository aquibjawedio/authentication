import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize, align } = format;

const logger = createLogger({
  level: "info",
  format: combine(
    colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
    align(),
    printf(({ timestamp, level, message, ...meta }) => {
      const metaString = Object.keys(meta).length
        ? `\n${JSON.stringify(meta, null, 2)}`
        : "";
      return `[${timestamp}] ${level}: ${message}${metaString}`;
    })
  ),
  transports: [new transports.Console()],
});

export { logger };
