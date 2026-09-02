export const PRODUCT_CONDITIONS = ["NEW", "REFURBISHED", "USED"] as const;

export type ProductCondition = (typeof PRODUCT_CONDITIONS)[number];

export const PRODUCT_TYPES = [
  "LAPTOP",
  "DESKTOP",
  "CUSTOM_PC",
  "MONITOR",
  "PRINTER",
  "UPS",
  "ACCESSORY",
  "NETWORKING",
  "CCTV",
  "APPLIANCE",
  "AUDIO",
  "ROBOTICS",
  "OTHER",
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];

export const PRODUCT_STATUSES = ["DRAFT", "ACTIVE", "INACTIVE", "OUT_OF_STOCK"] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const REFURBISHED_GRADES = ["A_PLUS", "A", "B", "C"] as const;

export type RefurbishedGrade = (typeof REFURBISHED_GRADES)[number];

export const REFURBISHED_GRADE_LABELS: Record<RefurbishedGrade, string> = {
  A_PLUS: "A+",
  A: "A",
  B: "B",
  C: "C",
};

export const TEST_RESULTS = ["PASS", "FAIL", "NOT_TESTED"] as const;

export type TestResult = (typeof TEST_RESULTS)[number];
