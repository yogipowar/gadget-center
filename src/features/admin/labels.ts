import type { LeadInterest, LeadPriority, LeadSource, LeadStatus } from "@/constants/leads";
import { LEAD_INTEREST_LABELS } from "@/constants/leads";
import type { OrderStatus, PaymentMethod, PaymentStatus } from "@/constants/orders";
import type { StaffRole } from "@/constants/roles";
import { REFURBISHED_GRADE_LABELS, type RefurbishedGrade } from "@/constants/products";
import type { RefurbishedUnitStatus } from "@/constants/inventory";

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  SALES_MANAGER: "Sales Manager",
  SALES_EXECUTIVE: "Sales Executive",
  INVENTORY_MANAGER: "Inventory Manager",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  INTERESTED: "Interested",
  FOLLOW_UP: "Follow-up",
  QUOTATION_SENT: "Quotation sent",
  CONVERTED: "Converted",
  NOT_INTERESTED: "Not interested",
  LOST: "Lost",
};

export const LEAD_PRIORITY_LABELS: Record<LeadPriority, string> = {
  HOT: "Hot",
  WARM: "Warm",
  COLD: "Cold",
};

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  META: "Meta Ads",
  ORGANIC: "Organic",
  DIRECT: "Direct",
  WHATSAPP: "WhatsApp",
  OTHER: "Other",
};

export { LEAD_INTEREST_LABELS };

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURN_REQUESTED: "Return requested",
  RETURNED: "Returned",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
  COD_PENDING: "COD pending",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  COD: "Cash on delivery",
  ENQUIRY: "Enquiry / request",
  RAZORPAY: "Razorpay",
};

export const UNIT_STATUS_LABELS: Record<RefurbishedUnitStatus, string> = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  SOLD: "Sold",
  IN_TESTING: "In testing",
  IN_REFURBISHMENT: "In refurbishment",
  UNAVAILABLE: "Unavailable",
};

export { REFURBISHED_GRADE_LABELS };
export type { RefurbishedGrade };

export function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
