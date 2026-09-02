import { publicEnv } from "@/config/public-env";

export const siteConfig = {
  name: publicEnv.siteName,
  tagline: "New & Refurbished Laptops & Computers at the Right Price",
  description:
    "Shop laptops, desktops, printers, UPS, CCTV, appliances and computer accessories from trusted brands.",
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
} as const;

export type SiteConfig = typeof siteConfig;
