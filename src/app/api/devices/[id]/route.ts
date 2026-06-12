import { NextResponse } from "next/server";
import { getDeviceById } from "@/lib/db";

/**
 * GET /api/devices/[id]
 * Fetch a single device by ID from Supabase
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const device = await getDeviceById(id);

    if (!device) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Device not found",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: device,
    });
  } catch (error) {
    console.error(`API Error - GET /api/devices/${id}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Failed to fetch device",
        },
      },
      { status: 500 }
    );
  }
}
