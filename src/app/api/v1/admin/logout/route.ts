import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { COOKIE_NAMES } from "@/constants/storage";
import { success } from "@/lib/api/response";
import { staffCookieOptions } from "@/lib/auth/staff-request";

export const dynamic = "force-dynamic";

export async function POST() {
  const jar = await cookies();
  jar.set(COOKIE_NAMES.staffAccess, "", { ...staffCookieOptions, maxAge: 0 });
  return NextResponse.json(success({ ok: true }, "Signed out"));
}
