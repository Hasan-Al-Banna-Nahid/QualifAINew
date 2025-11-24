// app/api/admin/clients/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminService } from "@/app/(main)/lib/firebase/admin";

export async function GET(request: NextRequest) {
  try {
    // Validate Firebase Admin initialization
    if (!adminService.isInitialized) {
      return NextResponse.json(
        { error: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    const result = await adminService.getClients(limit, page);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching clients:", error);

    // Provide more specific error messages
    if (error.message?.includes("Firebase Admin not initialized")) {
      return NextResponse.json(
        {
          error:
            "Server configuration error. Please check Firebase Admin setup.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch clients", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate Firebase Admin initialization
    if (!adminService.isInitialized) {
      return NextResponse.json(
        { error: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    const clientData = await request.json();

    // Validate required fields
    const requiredFields = ["name", "email"];
    const missingFields = requiredFields.filter((field) => !clientData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const client = await adminService.createClient(clientData);

    return NextResponse.json(client, { status: 201 });
  } catch (error: any) {
    console.error("Error creating client:", error);

    if (error.message?.includes("Firebase Admin not initialized")) {
      return NextResponse.json(
        {
          error:
            "Server configuration error. Please check Firebase Admin setup.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create client", details: error.message },
      { status: 500 }
    );
  }
}

// Additional endpoints for single client operations
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("id");

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    const clientData = await request.json();
    const updatedClient = await adminService.updateClient(clientId, clientData);

    return NextResponse.json(updatedClient);
  } catch (error: any) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Failed to update client", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("id");

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    await adminService.deleteClient(clientId);

    return NextResponse.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { error: "Failed to delete client", details: error.message },
      { status: 500 }
    );
  }
}
