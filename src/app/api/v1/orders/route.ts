import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { COOKIE_NAMES } from "@/constants/storage";
import type { CartState } from "@/features/cart/types";
import { handleApiError } from "@/lib/api/error-handler";
import { success } from "@/lib/api/response";
import { createOrder } from "@/services/order-service";

export const dynamic = "force-dynamic";

function parseCart(raw: string | undefined): CartState {
  if (!raw) {
    return { items: [] };
  }
  try {
    const parsed = JSON.parse(raw) as CartState;
    return Array.isArray(parsed.items) ? parsed : { items: [] };
  } catch {
    return { items: [] };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      customerName?: string;
      mobile?: string;
      email?: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
    };
    const jar = await cookies();
    const cart = parseCart(jar.get(COOKIE_NAMES.cart)?.value);
    const order = await createOrder({
      customerName: body.customerName ?? "",
      mobile: body.mobile ?? "",
      email: body.email,
      address: body.address ?? "",
      city: body.city ?? "",
      state: body.state ?? "",
      pincode: body.pincode ?? "",
      items: cart.items,
    });
    jar.set(COOKIE_NAMES.cart, JSON.stringify({ items: [] }), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return NextResponse.json(success(order, "Order saved"), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
