import "server-only";

import { cookies } from "next/headers";

import { COOKIE_NAMES } from "@/constants/storage";
import type { CustomerSession } from "@/features/account/types";
import { UnauthorizedError } from "@/lib/api/errors";
import { verifyCustomerToken } from "@/lib/auth/customer-token";

export const customerCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function readCustomerSessionFromCookie(): Promise<CustomerSession | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAMES.customerSession)?.value;
  if (!token) {
    return null;
  }
  return verifyCustomerToken(token);
}

export async function requireCustomerSession(): Promise<CustomerSession> {
  const session = await readCustomerSessionFromCookie();
  if (!session) {
    throw new UnauthorizedError("Sign in with your mobile and order number.");
  }
  return session;
}
