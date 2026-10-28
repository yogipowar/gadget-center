import { publicEnv } from "@/config/public-env";

export const siteConfig = {
  name: publicEnv.siteName,
  tagline: "Refurbished Dell & HP Business Laptops",
  description:
    "Import stock of refurbished business laptops. Adapter included. Bulk and corporate orders welcome.",
  locale: "en-IN",
  currency: "INR",
  timezone: "Asia/Kolkata",
  country: "IN",
  contact: {
    orderPhone: publicEnv.orderPhone,
    repairPhone: publicEnv.repairPhone,
    email: publicEnv.contactEmail,
    address: publicEnv.address,
  },
  payment: {
    upiId: publicEnv.upiId,
    accountName: publicEnv.bankAccountName,
    bankName: publicEnv.bankName,
    accountNumber: publicEnv.bankAccountNumber,
    ifsc: publicEnv.bankIfsc,
  },
} as const;

export type SiteConfig = typeof siteConfig;
