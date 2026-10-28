import "server-only";

import { setDefaultResultOrder } from "node:dns";
import { lookup } from "node:dns/promises";
import "mysql2";
import { Sequelize } from "sequelize";

import { env } from "@/config/env";
import { logger } from "@/lib/logger";

setDefaultResultOrder("ipv4first");

function createSequelize() {
  if (env.DATABASE_URL) {
    return new Sequelize(env.DATABASE_URL, {
      dialect: "mysql",
      logging: env.NODE_ENV === "development" ? (sql) => logger.info(sql) : false,
      dialectOptions: {
        connectTimeout: 15_000,
        ...(process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : {}),
      },
      define: {
        underscored: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 30_000,
        idle: 10_000,
      },
    });
  }

  return new Sequelize({
    dialect: "mysql",
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    logging: env.NODE_ENV === "development" ? (sql) => logger.info(sql) : false,
    dialectOptions: {
      charset: "utf8mb4",
      connectTimeout: 15_000,
      ...(process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : {}),
    },
    define: {
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30_000,
      idle: 10_000,
    },
  });
}

const globalForSequelize = globalThis as typeof globalThis & {
  sequelize?: Sequelize;
};

export const sequelize = globalForSequelize.sequelize ?? createSequelize();

if (env.NODE_ENV !== "production") {
  globalForSequelize.sequelize = sequelize;
}

async function preferIpv4Host() {
  if (env.DATABASE_URL) {
    return;
  }
  const host = env.DB_HOST;
  if (!host || host === "127.0.0.1" || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) {
    return;
  }
  const resolved = host === "localhost" ? "127.0.0.1" : (await lookup(host, { family: 4 })).address;
  sequelize.config.host = resolved;
  const manager = sequelize.connectionManager as { config?: { host?: string } };
  if (manager.config) {
    manager.config.host = resolved;
  }
}

export async function pingDatabase(timeoutMs = 8000) {
  await preferIpv4Host();
  await Promise.race([
    sequelize.authenticate(),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Database connection timed out")), timeoutMs);
    }),
  ]);
}

let ready: Promise<void> | null = null;

export function ensureDatabase() {
  if (!ready) {
    ready = (async () => {
      await import("@/database/models");
      const { seedDatabase } = await import("@/database/seed");
      await pingDatabase();
      await sequelize.sync();
      await seedDatabase();
    })().catch((error) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}
