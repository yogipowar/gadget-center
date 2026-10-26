import "server-only";

import { randomUUID } from "node:crypto";

import { LEAD_NUMBER_PREFIX } from "@/constants/leads";
import { Lead } from "@/database/models/lead";
import { ensureDatabase } from "@/database/sequelize";
import { AppError, ValidationError } from "@/lib/api/errors";
import { logger } from "@/lib/logger";
import { resolveLeadSource, type Attribution } from "@/lib/tracking/utm";
import { createLeadSchema } from "@/validators/lead";

export async function createLead(input: {
  payload: unknown;
  attribution?: Attribution | null;
  landingPage?: string;
  userAgent?: string | null;
}) {
  const parsed = createLeadSchema.safeParse(input.payload);
  if (!parsed.success) {
    throw new ValidationError(
      "Please check the highlighted fields",
      parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        code: "VALIDATION_ERROR",
        message: issue.message,
      })),
    );
  }

  const attribution = input.attribution ?? null;
  const source = attribution ? resolveLeadSource(attribution) : "DIRECT";
  const leadNumber = `${LEAD_NUMBER_PREFIX}${Date.now().toString().slice(-8)}`;

  try {
    await ensureDatabase();
    const lead = await Lead.create({
      id: randomUUID(),
      leadNumber,
      name: parsed.data.name,
      mobile: parsed.data.mobile,
      email: parsed.data.email || null,
      address: parsed.data.address,
      interestedCategory: parsed.data.interestedCategory ?? null,
      source,
      campaign: attribution?.utmCampaign,
      adSet: attribution?.utmContent,
      ad: attribution?.utmTerm,
      landingPage: input.landingPage ?? attribution?.landingPage,
      referrer: attribution?.referrer,
      fbclid: attribution?.fbclid,
      utmSource: attribution?.utmSource,
      utmMedium: attribution?.utmMedium,
      utmCampaign: attribution?.utmCampaign,
      utmContent: attribution?.utmContent,
      utmTerm: attribution?.utmTerm,
      userAgent: input.userAgent?.slice(0, 255) ?? null,
      requirement: parsed.data.requirement || null,
      status: "NEW",
      priority: source === "META" ? "HOT" : "WARM",
    } as never);

    return {
      id: lead.id,
      leadNumber: lead.leadNumber,
    };
  } catch (error) {
    logger.error("Failed to store lead", error);
    throw new AppError(
      "We could not save your details right now. Please try WhatsApp or try again.",
      503,
      "LEAD_STORE_FAILED",
    );
  }
}
