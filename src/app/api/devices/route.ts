import { NextResponse } from "next/server";
import { getAllDevices } from "@/lib/db";

/**
 * GET /api/devices
 * Fetch all devices from Supabase
 */
export async function GET() {
  try {
    const devices = await getAllDevices();
    return NextResponse.json({
      success: true,
      data: devices,
      meta: { total: devices.length },
    });
  } catch (error) {
    console.error("API Error - GET /api/devices:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Failed to fetch devices",
        },
      },
      { status: 500 }
    );
  }
}
