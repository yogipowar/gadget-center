import { LOCAL_STORAGE_KEYS } from "@/constants/storage";
import type { StaffAccount, StaffSession } from "@/features/admin/types";

const sessionListeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedSession: StaffSession | null = null;

function notifyStaffSession() {
  sessionListeners.forEach((listener) => listener());
}

export function subscribeStaffSession(onStoreChange: () => void) {
  sessionListeners.add(onStoreChange);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStoreChange);
  }
  return () => {
    sessionListeners.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStoreChange);
    }
  };
}

export const DEMO_STAFF: StaffAccount[] = [
  {
    email: "admin@gadgetcenter.local",
    password: "admin123",
    name: "Yogesh Powar",
    role: "SUPER_ADMIN",
  },
];

export function loginStaff(email: string, password: string): StaffSession | null {
  const account = DEMO_STAFF.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
  );
  if (!account) {
    return null;
  }
  const session: StaffSession = {
    email: account.email,
    name: account.name,
    role: account.role,
  };
  const raw = JSON.stringify(session);
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.staffSession, raw);
  cachedRaw = raw;
  cachedSession = session;
  notifyStaffSession();
  return session;
}

export function logoutStaff() {
  window.localStorage.removeItem(LOCAL_STORAGE_KEYS.staffSession);
  cachedRaw = null;
  cachedSession = null;
  notifyStaffSession();
}

export function getServerStaffSession(): StaffSession | null {
  return null;
}

export function readStaffSession(): StaffSession | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(LOCAL_STORAGE_KEYS.staffSession);
  if (raw === cachedRaw) {
    return cachedSession;
  }
  cachedRaw = raw;
  if (!raw) {
    cachedSession = null;
    return cachedSession;
  }
  try {
    const parsed = JSON.parse(raw) as StaffSession;
    if (!parsed.email || !parsed.name || parsed.role !== "SUPER_ADMIN") {
      cachedSession = null;
      return cachedSession;
    }
    cachedSession = parsed;
    return cachedSession;
  } catch {
    cachedSession = null;
    return cachedSession;
  }
}
