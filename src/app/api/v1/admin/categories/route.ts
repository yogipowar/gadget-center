import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error-handler";
import { success } from "@/lib/api/response";
import { requireStaffSession } from "@/lib/auth/staff-request";
import { ValidationError } from "@/lib/api/errors";
import type { AdminCategory } from "@/features/admin/types";
import { listCategories, removeCategory, upsertCategory } from "@/services/category-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireStaffSession();
    const categories = await listCategories();
    return NextResponse.json(success(categories, "Categories loaded"));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireStaffSession();
    const body = (await request.json()) as AdminCategory;
    const category = await upsertCategory(body);
    return NextResponse.json(success(category, "Category saved"), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireStaffSession();
    const body = (await request.json()) as AdminCategory;
    const category = await upsertCategory(body);
    return NextResponse.json(success(category, "Category saved"));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireStaffSession();
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      throw new ValidationError("Category id is required.");
    }
    const removed = await removeCategory(body.id);
    return NextResponse.json(success({ removed }, "Category deleted"));
  } catch (error) {
    return handleApiError(error);
  }
}
