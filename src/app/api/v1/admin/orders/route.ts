import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error-handler";
import { ValidationError } from "@/lib/api/errors";
import { success } from "@/lib/api/response";
import { requireStaffSession } from "@/lib/auth/staff-request";
import { listOrders, markOrderPaidById } from "@/services/order-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireStaffSession();
    const orders = await listOrders();
    return NextResponse.json(success(orders, "Orders loaded"));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireStaffSession();
    const body = (await request.json()) as { id?: string };
    const id = body.id?.trim() ?? "";
    if (!id) {
      throw new ValidationError("Order id is required.");
    }
    const order = await markOrderPaidById(id);
    return NextResponse.json(success(order, "Payment marked as received"));
  } catch (error) {
    return handleApiError(error);
  }
}
