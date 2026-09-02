import "server-only";

import { Sequelize } from "sequelize";

import { env } from "@/config/env";
import { logger } from "@/lib/logger";

function createSequelize() {
  if (env.DATABASE_URL) {
    return new Sequelize(env.DATABASE_URL, {
      dialect: "mysql",
      logging: env.NODE_ENV === "development" ? (sql) => logger.info(sql) : false,
      dialectOptions: {
        connectTimeout: 3000,
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
      connectTimeout: 3000,
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

export async function pingDatabase(timeoutMs = 2500) {
  await Promise.race([
    sequelize.authenticate(),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Database connection timed out")), timeoutMs);
    }),
  ]);
}
