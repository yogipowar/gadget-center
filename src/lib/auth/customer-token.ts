import "server-only";

import { jwtVerify, SignJWT } from "jose";

import { env } from "@/config/env";
import type { CustomerSession } from "@/features/account/types";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function signCustomerToken(session: CustomerSession) {
  return new SignJWT({
    mobile: session.mobile,
    name: session.name,
    kind: "customer",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyCustomerToken(token: string): Promise<CustomerSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (
      payload.kind !== "customer" ||
      typeof payload.mobile !== "string" ||
      typeof payload.name !== "string" ||
      payload.mobile.length !== 10
    ) {
      return null;
    }
    return { mobile: payload.mobile, name: payload.name };
  } catch {
    return null;
  }
}
