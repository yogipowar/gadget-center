import { LOCAL_STORAGE_KEYS } from "@/constants/storage";
import {
  mergeAttribution,
  parseAttribution,
  type Attribution,
} from "@/lib/tracking/utm";

function readStored(): Attribution | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(LOCAL_STORAGE_KEYS.attribution);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as Attribution;
  } catch {
    return null;
  }
}

export function captureAttributionFromWindow(): Attribution {
  const incoming = parseAttribution({
    searchParams: new URLSearchParams(window.location.search),
    landingPage: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || null,
  });
  const merged = mergeAttribution(readStored(), incoming);
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.attribution, JSON.stringify(merged));
  return merged;
}
