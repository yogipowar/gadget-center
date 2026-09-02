import { NextResponse } from "next/server";

import { failure } from "@/lib/api/response";
import { isAppError } from "@/lib/api/errors";
import { logger } from "@/lib/logger";

export function handleApiError(error: unknown) {
  if (isAppError(error)) {
    return NextResponse.json(
      failure(error.message, error.errors),
      { status: error.statusCode },
    );
  }

  logger.error("Unhandled API error", error);

  return NextResponse.json(failure("An unexpected error occurred"), {
    status: 500,
  });
}
