import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { COOKIE_NAMES } from "@/constants/storage";
import { handleApiError } from "@/lib/api/error-handler";
import { success } from "@/lib/api/response";
import { staffCookieOptions } from "@/lib/auth/staff-request";
import { signStaffToken } from "@/lib/auth/staff-token";
import { authenticateStaff } from "@/services/staff-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const session = await authenticateStaff(body.email ?? "", body.password ?? "");
    const token = await signStaffToken(session);
    const jar = await cookies();
    jar.set(COOKIE_NAMES.staffAccess, token, staffCookieOptions);
    return NextResponse.json(success(session, "Signed in"));
  } catch (error) {
    return handleApiError(error);
  }
}
