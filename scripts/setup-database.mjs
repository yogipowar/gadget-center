import { resolve } from "node:path";

import { config } from "dotenv";
import { createConnection } from "mysql2/promise";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const host = process.env.DB_HOST || "127.0.0.1";
const port = Number(process.env.DB_PORT || 3306);
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME;

if (!user || !database) {
  console.error("Set DB_USER and DB_NAME in .env.local before running db:setup.");
  process.exit(1);
}

const connection = await createConnection({
  host,
  port,
  user,
  password,
  database,
  connectTimeout: 15_000,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

await connection.query("SELECT 1 AS ok");
await connection.end();
console.log(`Connected to MySQL database ${database} on ${host}:${port}`);
