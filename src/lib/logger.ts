type LogMeta = Record<string, unknown> | unknown;

type SqlError = Error & {
  parent?: { sqlMessage?: string; code?: string; errno?: number };
  original?: { sqlMessage?: string; code?: string; errno?: number };
  sql?: string;
};

function format(level: string, message: string, meta?: LogMeta) {
  const timestamp = new Date().toISOString();
  if (meta === undefined) {
    return `[${timestamp}] ${level} ${message}`;
  }
  return `[${timestamp}] ${level} ${message} ${safeSerialize(meta)}`;
}

function serializeError(error: Error) {
  const sqlError = error as SqlError;
  const sqlMessage = sqlError.parent?.sqlMessage || sqlError.original?.sqlMessage || error.message;
  const code = sqlError.parent?.code || sqlError.original?.code;
  const errno = sqlError.parent?.errno || sqlError.original?.errno;
  return [
    sqlMessage,
    code ? `code=${code}` : null,
    errno != null ? `errno=${errno}` : null,
    sqlError.sql ? `sql=${sqlError.sql}` : null,
    error.stack,
  ]
    .filter(Boolean)
    .join("\n");
}

function safeSerialize(meta: LogMeta) {
  if (meta instanceof Error) {
    return serializeError(meta);
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
