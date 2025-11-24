// app/api/clients/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clientService } from "@/app/(main)/lib/services/client.service";

export async function GET(request: NextRequest) {
    try {
        const stats = await clientService.getClientStats();

        return NextResponse.json({
            success: true,
            data: stats,
            message: "Client statistics fetched successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch client statistics" },
            { status: 500 }
        );
    }
}
