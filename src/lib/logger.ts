type LogMeta = Record<string, unknown> | unknown;

function format(level: string, message: string, meta?: LogMeta) {
  const timestamp = new Date().toISOString();
  if (meta === undefined) {
    return `[${timestamp}] ${level} ${message}`;
  }
  return `[${timestamp}] ${level} ${message} ${safeSerialize(meta)}`;
}

function safeSerialize(meta: LogMeta) {
  if (meta instanceof Error) {
    return meta.stack ?? meta.message;
  }
  try {
    return JSON.stringify(meta);
  } catch {
    return String(meta);
  }
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    console.info(format("INFO", message, meta));
  },
  warn(message: string, meta?: LogMeta) {
    console.warn(format("WARN", message, meta));
  },
  error(message: string, meta?: LogMeta) {
    console.error(format("ERROR", message, meta));
  },
};
