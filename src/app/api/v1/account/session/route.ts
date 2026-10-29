import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error-handler";
import { success } from "@/lib/api/response";
import { readCustomerSessionFromCookie } from "@/lib/auth/customer-request";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await readCustomerSessionFromCookie();
    return NextResponse.json(success(session, "Session"));
  } catch (error) {
    return handleApiError(error);
  }
}
