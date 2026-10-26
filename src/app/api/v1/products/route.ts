import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error-handler";
import { success } from "@/lib/api/response";
import { listProducts } from "@/services/product-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json(success(products, "Products loaded"));
  } catch (error) {
    return handleApiError(error);
  }
}
