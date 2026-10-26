import { COOKIE_NAMES } from "@/constants/storage";
import {
  mergeAttribution,
  parseAttribution,
  type Attribution,
} from "@/lib/tracking/utm";

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }
  const prefix = `${name}=`;
  const match = document.cookie.split("; ").find((part) => part.startsWith(prefix));
  if (!match) {
    return null;
  }
  return decodeURIComponent(match.slice(prefix.length));
}

function writeCookie(name: string, value: string, maxAge = 15_552_000) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
}

function readStored(): Attribution | null {
  const raw = readCookie(COOKIE_NAMES.attribution);
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
  writeCookie(COOKIE_NAMES.attribution, JSON.stringify(merged));
  return merged;
}
