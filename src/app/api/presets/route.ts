import { NextResponse } from "next/server";
import { getAllPresets, getPresetsByDeviceId } from "@/lib/db";

/**
 * GET /api/presets
 * Fetch all presets or filter by deviceId query parameter
 * Example: /api/presets?deviceId=oneplus-nord-buds-2
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");

    const presets = deviceId
      ? await getPresetsByDeviceId(deviceId)
      : await getAllPresets();

    return NextResponse.json({
      success: true,
      data: presets,
      meta: { total: presets.length },
    });
  } catch (error) {
    console.error("API Error - GET /api/presets:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Failed to fetch presets",
        },
      },
      { status: 500 }
    );
  }
}
