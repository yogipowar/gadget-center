import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error-handler";
import { success } from "@/lib/api/response";
import { requireStaffSession } from "@/lib/auth/staff-request";
import type { CatalogProduct } from "@/features/catalog/types";
import { listProducts, removeProducts, upsertProduct } from "@/services/product-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireStaffSession();
    const products = await listProducts();
    return NextResponse.json(success(products));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireStaffSession();
    const body = (await request.json()) as CatalogProduct;
    const product = await upsertProduct(body);
    return NextResponse.json(success(product, "Product saved"), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireStaffSession();
    const body = (await request.json()) as CatalogProduct;
    const product = await upsertProduct(body);
    return NextResponse.json(success(product, "Product saved"));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireStaffSession();
    const body = (await request.json()) as { ids?: string[] };
    const removed = await removeProducts(body.ids ?? []);
    return NextResponse.json(success({ removed }, "Products deleted"));
  } catch (error) {
    return handleApiError(error);
  }
}
