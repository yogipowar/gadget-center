import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error-handler";
import { success } from "@/lib/api/response";
import { requireStaffSession } from "@/lib/auth/staff-request";
import { ValidationError } from "@/lib/api/errors";
import { saveUploadedImages } from "@/services/media-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isUploadedFile(entry: FormDataEntryValue): entry is File {
  return typeof entry === "object" && entry !== null && typeof (entry as File).arrayBuffer === "function" && typeof (entry as File).size === "number";
}

export async function POST(request: NextRequest) {
  try {
    await requireStaffSession();
    const form = await request.formData();
    const files = form.getAll("files").filter(isUploadedFile);
    if (files.length === 0) {
      throw new ValidationError("Choose at least one image.");
    }
    const images = await saveUploadedImages(files);
    return NextResponse.json(success(images, "Images uploaded"), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
