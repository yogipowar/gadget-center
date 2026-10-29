import type { LeadInterest, LeadPriority, LeadSource, LeadStatus } from "@/constants/leads";
import type { OrderStatus, PaymentMethod, PaymentStatus } from "@/constants/orders";
import type { RefurbishedUnitStatus } from "@/constants/inventory";
import type { StaffRole } from "@/constants/roles";
import type { RefurbishedGrade } from "@/constants/products";

export type StaffAccount = {
  email: string;
  password: string;
  name: string;
  role: StaffRole;
};

export type StaffSession = {
  email: string;
  name: string;
  role: StaffRole;
};

export type AdminLead = {
  id: string;
  leadNumber: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  interest: LeadInterest;
  status: LeadStatus;
  priority: LeadPriority;
  source: LeadSource;
  assignedTo: string;
  createdAt: string;
  notes: string;
};

export type AdminCustomer = {
  id: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  orders: number;
  totalSpend: number;
  lastOrderAt: string;
};

export type AdminOrderLine = {
  name: string;
  slug: string;
  quantity: number;
  unitPrice: number;
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  customer: string;
  mobile: string;
  email?: string | null;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  items: string;
  lineItems?: AdminOrderLine[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentReported?: boolean;
  notes?: string | null;
  createdAt: string;
};

export type AdminEnquiry = {
  id: string;
  name: string;
  mobile: string;
  product: string;
  channel: "WhatsApp" | "Form" | "Phone";
  status: "OPEN" | "REPLIED" | "CLOSED";
  createdAt: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  live: boolean;
  builtin?: boolean;
};

export type AdminBrand = {
  id: string;
  name: string;
  live: boolean;
};

export type AdminInventoryRow = {
  id: string;
  sku: string;
  name: string;
  onHand: number;
  reserved: number;
  reorderAt: number;
};

export type AdminCoupon = {
  id: string;
  code: string;
  discount: string;
  minOrder: number;
  uses: number;
  active: boolean;
  expiresAt: string;
};

export type AdminReview = {
  id: string;
  product: string;
  customer: string;
  rating: number;
  status: "PENDING" | "PUBLISHED" | "HIDDEN";
  comment: string;
};

export type AdminBanner = {
  id: string;
  title: string;
  placement: string;
  active: boolean;
  startsAt: string;
  endsAt: string;
};

export type AdminRefurbishedUnit = {
  id: string;
  serial: string;
  product: string;
  grade: RefurbishedGrade;
  status: RefurbishedUnitStatus;
  batteryHealth: string;
  warranty: string;
};

export type AdminStaffUser = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: "ACTIVE" | "INVITED";
};
