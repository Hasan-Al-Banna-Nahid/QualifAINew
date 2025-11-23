// app/api/clients/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clientService } from "@/app/(main)/lib/services/client.service";
import { clientFormSchema } from "@/app/(main)/schemas/client.schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientService.getClient(params.id);

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: client,
      message: "Client fetched successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = clientFormSchema.partial().parse(body);

    await clientService.updateClient(params.id, validatedData);

    return NextResponse.json({
      success: true,
      message: "Client updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update client",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await clientService.deleteClient(params.id);

    return NextResponse.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete client" },
      { status: 500 }
    );
  }
}
