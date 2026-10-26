import { apiClient } from "@/lib/api/client";
import { routes } from "@/config/routes";
import type { StaffAccount, StaffSession } from "@/features/admin/types";

const sessionListeners = new Set<() => void>();
let cachedSession: StaffSession | null = null;
let pending = true;
let inflight: Promise<void> | null = null;

function notifyStaffSession() {
  sessionListeners.forEach((listener) => listener());
}

async function refreshSession() {
  const response = await apiClient.get<StaffSession | null>(routes.api.adminSession);
  cachedSession = response.success ? response.data : null;
  pending = false;
  notifyStaffSession();
}

function ensureSession() {
  if (!inflight) {
    inflight = refreshSession().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

export function subscribeStaffSession(onStoreChange: () => void) {
  sessionListeners.add(onStoreChange);
  void ensureSession();
  return () => {
    sessionListeners.delete(onStoreChange);
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

export async function loginStaff(email: string, password: string): Promise<StaffSession | null> {
  const response = await apiClient.post<StaffSession>(routes.api.adminLogin, { email, password });
  if (!response.success || !response.data) {
    return null;
  }
  cachedSession = response.data;
  pending = false;
  notifyStaffSession();
  return cachedSession;
}

export async function logoutStaff() {
  await apiClient.post(routes.api.adminLogout);
  cachedSession = null;
  pending = false;
  notifyStaffSession();
}

export function getServerStaffSession(): StaffSession | null {
  return null;
}

export function isStaffSessionPending() {
  return pending;
}

export function readStaffSession(): StaffSession | null {
  return cachedSession;
}
