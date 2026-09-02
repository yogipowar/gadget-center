export { STAFF_ROLES, PERMISSIONS } from "@/constants/roles";
export type { StaffRole, Permission } from "@/constants/roles";

export {
  LEAD_STATUSES,
  LEAD_PRIORITIES,
  LEAD_SOURCES,
  LEAD_INTEREST_OPTIONS,
  LEAD_INTEREST_LABELS,
  LEAD_NUMBER_PREFIX,
} from "@/constants/leads";
export type { LeadStatus, LeadPriority, LeadSource, LeadInterest } from "@/constants/leads";

export {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
  ORDER_NUMBER_PREFIX,
} from "@/constants/orders";
export type { OrderStatus, PaymentStatus, PaymentMethod } from "@/constants/orders";

export {
  PRODUCT_CONDITIONS,
  PRODUCT_TYPES,
  PRODUCT_STATUSES,
  REFURBISHED_GRADES,
  REFURBISHED_GRADE_LABELS,
  TEST_RESULTS,
} from "@/constants/products";
export type {
  ProductCondition,
  ProductType,
  ProductStatus,
  RefurbishedGrade,
  TestResult,
} from "@/constants/products";

export {
  INVENTORY_MOVEMENT_TYPES,
  REFURBISHED_UNIT_STATUSES,
} from "@/constants/inventory";
export type { InventoryMovementType, RefurbishedUnitStatus } from "@/constants/inventory";

export { COOKIE_NAMES, LOCAL_STORAGE_KEYS } from "@/constants/storage";
