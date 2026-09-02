export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "FOLLOW_UP",
  "QUOTATION_SENT",
  "CONVERTED",
  "NOT_INTERESTED",
  "LOST",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_PRIORITIES = ["HOT", "WARM", "COLD"] as const;

export type LeadPriority = (typeof LEAD_PRIORITIES)[number];

export const LEAD_SOURCES = ["META", "ORGANIC", "DIRECT", "WHATSAPP", "OTHER"] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_INTEREST_OPTIONS = [
  "NEW_LAPTOP",
  "REFURBISHED_LAPTOP",
  "DESKTOP_PC",
  "REFURBISHED_DESKTOP",
  "CUSTOM_PC",
  "ACCESSORIES",
  "PRINTERS",
  "UPS",
  "CCTV",
  "HOME_APPLIANCES",
  "PRO_AUDIO",
  "ROBOTICS",
  "SERVICE_REPAIR",
  "OTHER",
] as const;

export type LeadInterest = (typeof LEAD_INTEREST_OPTIONS)[number];

export const LEAD_INTEREST_LABELS: Record<LeadInterest, string> = {
  NEW_LAPTOP: "New Laptop",
  REFURBISHED_LAPTOP: "Refurbished Laptop",
  DESKTOP_PC: "Desktop PC",
  REFURBISHED_DESKTOP: "Refurbished Desktop",
  CUSTOM_PC: "Custom PC",
  ACCESSORIES: "Accessories",
  PRINTERS: "Printers",
  UPS: "UPS",
  CCTV: "CCTV & Surveillance",
  HOME_APPLIANCES: "Home Appliances",
  PRO_AUDIO: "Pro Audio",
  ROBOTICS: "Robotics & EOT",
  SERVICE_REPAIR: "Service & Repair",
  OTHER: "Other",
};

export const LEAD_NUMBER_PREFIX = "GC-LEAD-";
