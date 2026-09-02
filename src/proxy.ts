import { NextResponse } from "next/server";

import { applySecurityHeaders } from "@/lib/http/security-headers";

export function proxy() {
  const response = NextResponse.next();
  return applySecurityHeaders(response);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
