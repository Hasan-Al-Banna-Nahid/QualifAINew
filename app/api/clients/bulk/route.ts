// app/api/clients/bulk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clientService } from "@/app/(main)/lib/services/client.service";

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { ids, status } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { success: false, error: "Invalid client IDs" },
                { status: 400 }
            );
        }

        if (!status) {
            return NextResponse.json(
                { success: false, error: "Status is required" },
                { status: 400 }
            );
        }

        await clientService.bulkUpdateStatus(ids, status);

        return NextResponse.json({
            success: true,
            message: `Updated ${ids.length} clients successfully`,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error ? error.message : "Failed to bulk update clients",
            },
            { status: 500 }
        );
    }
}
