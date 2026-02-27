const { createLogger, format, transports } = require("winston");
const path = require("path");

const { combine, timestamp, errors, json, colorize, printf } = format;

const logDir = path.join(__dirname, "..", "logs");

const devFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `${timestamp} [${level}]${stack ? `: ${stack}` : `: ${message}`}${metaStr}`;
});

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
  ),
  defaultMeta: { service: "endpoint-api" },
  transports: [
    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
      tailable: true,
      format: combine(timestamp(), json()),
    }),
    new transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
      tailable: true,
      format: combine(timestamp(), json()),
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: path.join(logDir, "exceptions.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    }),
  ],
  rejectionHandlers: [
    new transports.File({
      filename: path.join(logDir, "rejections.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(colorize(), timestamp({ format: "HH:mm:ss" }), devFormat),
    }),
  );
} else {
  logger.add(
    new transports.Console({
      format: combine(timestamp(), json()),
    }),
  );
}

const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

module.exports = { logger, stream };
