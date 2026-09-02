export type Attribution = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  fbclid: string | null;
  landingPage: string;
  referrer: string | null;
  firstVisitAt: string;
};

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

function readParam(params: URLSearchParams, key: string) {
  const value = params.get(key);
  if (!value) {
    return null;
  }
  return value.slice(0, 255);
}

export function parseAttribution(input: {
  searchParams: URLSearchParams;
  landingPage: string;
  referrer?: string | null;
  firstVisitAt?: string;
}): Attribution {
  return {
    utmSource: readParam(input.searchParams, "utm_source"),
    utmMedium: readParam(input.searchParams, "utm_medium"),
    utmCampaign: readParam(input.searchParams, "utm_campaign"),
    utmContent: readParam(input.searchParams, "utm_content"),
    utmTerm: readParam(input.searchParams, "utm_term"),
    fbclid: readParam(input.searchParams, "fbclid"),
    landingPage: input.landingPage.slice(0, 2048),
    referrer: input.referrer ? input.referrer.slice(0, 2048) : null,
    firstVisitAt: input.firstVisitAt ?? new Date().toISOString(),
  };
}

export function mergeAttribution(
  existing: Attribution | null,
  incoming: Attribution,
): Attribution {
  if (!existing) {
    return incoming;
  }

  return {
    utmSource: existing.utmSource ?? incoming.utmSource,
    utmMedium: existing.utmMedium ?? incoming.utmMedium,
    utmCampaign: existing.utmCampaign ?? incoming.utmCampaign,
    utmContent: existing.utmContent ?? incoming.utmContent,
    utmTerm: existing.utmTerm ?? incoming.utmTerm,
    fbclid: existing.fbclid ?? incoming.fbclid,
    landingPage: existing.landingPage || incoming.landingPage,
    referrer: existing.referrer ?? incoming.referrer,
    firstVisitAt: existing.firstVisitAt,
  };
}

export function hasCampaignParams(params: URLSearchParams) {
  return UTM_KEYS.some((key) => Boolean(params.get(key)));
}

export function resolveLeadSource(attribution: Attribution): "META" | "ORGANIC" | "DIRECT" | "OTHER" {
  const source = attribution.utmSource?.toLowerCase() ?? "";
  if (
    attribution.fbclid ||
    source.includes("facebook") ||
    source.includes("instagram") ||
    source === "fb" ||
    source === "ig" ||
    source === "meta"
  ) {
    return "META";
  }
  if (source) {
    return "OTHER";
  }
  if (attribution.referrer) {
    return "ORGANIC";
  }
  return "DIRECT";
}
