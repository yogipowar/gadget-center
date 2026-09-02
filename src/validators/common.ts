import { z } from "zod";

export const indianMobileSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

export const pincodeSchema = z
  .string()
  .trim()
  .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode");

export const optionalEmailSchema = z.union([
  z.email("Enter a valid email address"),
  z.literal(""),
]);
