import { NextResponse } from "next/server";
import { getPresetById } from "@/lib/db";

/**
 * GET /api/presets/[id]
 * Fetch a single preset by ID with its EQ bands from Supabase
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const preset = await getPresetById(id);

    if (!preset) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Preset not found",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: preset,
    });
  } catch (error) {
    console.error(`API Error - GET /api/presets/${id}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Failed to fetch preset",
        },
      },
      { status: 500 }
    );
  }
}
