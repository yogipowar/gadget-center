import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error-handler";
import { getUploadedImage } from "@/services/media-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const image = await getUploadedImage(id);
    return new NextResponse(new Uint8Array(image.bytes), {
      status: 200,
      headers: {
        "Content-Type": image.mimeType,
        "Content-Length": String(image.bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
