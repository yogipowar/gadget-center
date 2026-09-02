import { sequelize } from "@/database/sequelize";

/**
 * Model registry. Phase 2 registers Sequelize models and associations here.
 */
export const models = {} as const;

export function getSequelize() {
  return sequelize;
}

export { sequelize };
