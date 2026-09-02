import { z } from "zod";

import { LEAD_INTEREST_OPTIONS } from "@/constants/leads";
import { indianMobileSchema } from "@/validators/common";

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(120),
  mobile: indianMobileSchema,
  address: z.string().trim().min(8, "Enter your address").max(500),
  interestedCategory: z.enum(LEAD_INTEREST_OPTIONS).optional(),
  email: z.email().optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
