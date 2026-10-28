import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error-handler";
import { success } from "@/lib/api/response";
import { loadCatalog } from "@/lib/catalog-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await loadCatalog();
    return NextResponse.json(success(products, "Products loaded"));
  } catch (error) {
    return handleApiError(error);
  }
}
