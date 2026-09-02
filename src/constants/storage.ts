export const COOKIE_NAMES = {
  staffAccess: "gc_staff_access",
  staffRefresh: "gc_staff_refresh",
  customerSession: "gc_customer_session",
  cart: "gc_cart",
  leadSubmitted: "gc_lead_submitted",
  attribution: "gc_attribution",
} as const;

export const LOCAL_STORAGE_KEYS = {
  leadSubmitted: "gc_lead_submitted",
  attribution: "gc_attribution",
  cart: "gc_cart",
  staffSession: "gc_staff_session",
  adminCatalog: "gc_admin_catalog",
} as const;
