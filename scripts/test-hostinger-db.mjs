import { resolve } from "node:path";

import { config } from "dotenv";
import { createConnection } from "mysql2/promise";

config({ path: resolve(process.cwd(), ".env.local") });

const host = process.argv[2] || process.env.DB_HOST || "srv947.hstgr.io";
const port = Number(process.argv[3] || process.env.DB_PORT || 3306);

try {
  const connection = await createConnection({
    host,
    port,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 15_000,
  });
  const [tables] = await connection.query("SHOW TABLES");
  const names = tables.map((row) => Object.values(row)[0]);
  console.log(`OK ${host}:${port} tables=${names.join(",") || "(none)"}`);
  await connection.end();
} catch (error) {
  console.log(`FAIL ${host}:${port} ${error.code || ""} ${error.message}`);
  process.exitCode = 1;
}
