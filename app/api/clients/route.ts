// app/api/clients/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clientService } from "@/app/(main)/lib/services/client.service";
import { clientFormSchema } from "@/app/(main)/schemas/client.schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filter = {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "all",
      serviceType: searchParams.get("serviceType") || "all",
      serviceTier: searchParams.get("serviceTier") || "all",
      paymentStatus: searchParams.get("paymentStatus") || "all",
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "12"),
    };

    const result = await clientService.getClients(filter);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Clients fetched successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validatedData = clientFormSchema.parse(body);

    // Create client
    const result = await clientService.createClient(validatedData);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Client created successfully",
    });
  } catch (error) {
    console.error("Create client error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create client",
      },
      { status: 400 }
    );
  }
}
