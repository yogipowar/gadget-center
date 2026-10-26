import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { COOKIE_NAMES } from "@/constants/storage";
import type { CartLine, CartState } from "@/features/cart/types";
import { handleApiError } from "@/lib/api/error-handler";
import { success } from "@/lib/api/response";

export const dynamic = "force-dynamic";

const cartCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

function parseCart(raw: string | undefined): CartState {
  if (!raw) {
    return { items: [] };
  }
  try {
    const parsed = JSON.parse(raw) as CartState;
    if (!Array.isArray(parsed.items)) {
      return { items: [] };
    }
    return {
      items: parsed.items
        .filter((item): item is CartLine => Boolean(item?.slug) && Number(item.quantity) > 0)
        .map((item) => ({ slug: item.slug, quantity: Math.min(10, Math.max(1, Number(item.quantity) || 1)) })),
    };
  } catch {
    return { items: [] };
  }
}

export async function GET() {
  try {
    const jar = await cookies();
    return NextResponse.json(success(parseCart(jar.get(COOKIE_NAMES.cart)?.value)));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as CartState;
    const next = parseCart(JSON.stringify(body));
    const jar = await cookies();
    jar.set(COOKIE_NAMES.cart, JSON.stringify(next), cartCookie);
    return NextResponse.json(success(next, "Cart saved"));
  } catch (error) {
    return handleApiError(error);
  }
}
