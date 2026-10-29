/**
 * Values safe to import from Client Components.
 * Never put database credentials, JWT secrets, or payment keys here.
 */
export const publicEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "GadgetCenter",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "918530613876",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  orderPhone: process.env.NEXT_PUBLIC_PHONE_ORDERS ?? "8530613876",
  repairPhone: process.env.NEXT_PUBLIC_PHONE_REPAIR ?? "8530613876",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "gadgetcenterkop@gmail.com",
  address:
    process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ??
    "Jyotirling Colony, Bondre Nagar, Phulewadi, Kolhapur, Maharashtra 416010",
  upiId: process.env.NEXT_PUBLIC_UPI_ID ?? "powaryogesh20-1@oksbi",
  bankAccountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? "Yogesh Sambhaji Powar",
  bankName: process.env.NEXT_PUBLIC_BANK_NAME ?? "Bank of Maharashtra",
  bankAccountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? "60239477076",
  bankIfsc: process.env.NEXT_PUBLIC_BANK_IFSC ?? "MAHB0000497",
} as const;

export type PublicEnv = typeof publicEnv;
