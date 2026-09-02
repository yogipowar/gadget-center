export const INVENTORY_MOVEMENT_TYPES = [
  "PURCHASE",
  "SALE",
  "RETURN",
  "DAMAGE",
  "ADJUSTMENT",
] as const;

export type InventoryMovementType = (typeof INVENTORY_MOVEMENT_TYPES)[number];

export const REFURBISHED_UNIT_STATUSES = [
  "AVAILABLE",
  "RESERVED",
  "SOLD",
  "IN_TESTING",
  "IN_REFURBISHMENT",
  "UNAVAILABLE",
] as const;

export type RefurbishedUnitStatus = (typeof REFURBISHED_UNIT_STATUSES)[number];
