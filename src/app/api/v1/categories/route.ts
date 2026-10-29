import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error-handler";
import { success } from "@/lib/api/response";
import { listCategories } from "@/services/category-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await listCategories();
    return NextResponse.json(success(categories, "Categories loaded"));
  } catch (error) {
    return handleApiError(error);
  }
}
