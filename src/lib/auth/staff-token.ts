import "server-only";

import { jwtVerify, SignJWT } from "jose";

import { env } from "@/config/env";
import type { StaffSession } from "@/features/admin/types";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function signStaffToken(session: StaffSession) {
  return new SignJWT({
    email: session.email,
    name: session.name,
    role: session.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyStaffToken(token: string): Promise<StaffSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      payload.role !== "SUPER_ADMIN"
    ) {
      return null;
    }
    return {
      email: payload.email,
      name: payload.name,
      role: "SUPER_ADMIN",
    };
  } catch {
    return null;
  }
}
