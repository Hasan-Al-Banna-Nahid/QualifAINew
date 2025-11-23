// app/api/clients/[id]/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clientService } from "@/app/(main)/lib/services/client.service";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysis = await clientService.analyzeClient(params.id);

    return NextResponse.json({
      success: true,
      data: analysis,
      message: "AI analysis completed successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to analyze client",
      },
      { status: 500 }
    );
  }
}
