import { LOCAL_STORAGE_KEYS } from "@/constants/storage";
import type { StaffAccount, StaffSession } from "@/features/admin/types";

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
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.staffSession, JSON.stringify(session));
  return session;
}

export function logoutStaff() {
  window.localStorage.removeItem(LOCAL_STORAGE_KEYS.staffSession);
}

export function readStaffSession(): StaffSession | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(LOCAL_STORAGE_KEYS.staffSession);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as StaffSession;
    if (!parsed.email || !parsed.name || parsed.role !== "SUPER_ADMIN") {
      window.localStorage.removeItem(LOCAL_STORAGE_KEYS.staffSession);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
