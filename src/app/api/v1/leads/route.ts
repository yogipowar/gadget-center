import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error-handler";
import { success } from "@/lib/api/response";
import { createLead } from "@/services/lead-service";
import type { Attribution } from "@/lib/tracking/utm";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      mobile?: string;
      address?: string;
      interestedCategory?: string;
      email?: string;
      landingPage?: string;
      attribution?: Attribution;
    };

    const data = await createLead({
      payload: {
        name: body.name,
        mobile: body.mobile,
        address: body.address,
        interestedCategory: body.interestedCategory,
        email: body.email,
      },
      attribution: body.attribution,
      landingPage: body.landingPage,
      userAgent: request.headers.get("user-agent"),
    });

    return NextResponse.json(success(data, "Lead captured"), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
