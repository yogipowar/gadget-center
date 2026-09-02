import { NextResponse } from "next/server";

import { env } from "@/config/env";
import { pingDatabase } from "@/database/sequelize";
import { handleApiError } from "@/lib/api/error-handler";
import { success } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let database: "connected" | "disconnected" = "disconnected";

    try {
      await pingDatabase();
      database = "connected";
    } catch {
      database = "disconnected";
    }

    return NextResponse.json(
      success(
        {
          service: "gadgetcenter-api",
          environment: env.NODE_ENV,
          database,
        },
        "GadgetCenter API is running",
      ),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
