import "server-only";

import { cookies } from "next/headers";

import { COOKIE_NAMES } from "@/constants/storage";
import type { StaffSession } from "@/features/admin/types";
import { UnauthorizedError } from "@/lib/api/errors";
import { verifyStaffToken } from "@/lib/auth/staff-token";

export const staffCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function readStaffSessionFromCookie(): Promise<StaffSession | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAMES.staffAccess)?.value;
  if (!token) {
    return null;
  }
  return verifyStaffToken(token);
}

export async function requireStaffSession(): Promise<StaffSession> {
  const session = await readStaffSessionFromCookie();
  if (!session) {
    throw new UnauthorizedError("Sign in to continue.");
  }
  return session;
}
