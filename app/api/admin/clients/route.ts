// app/api/admin/clients/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminService, adminDb } from "@/app/(main)/lib/firebase/admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    const clientsSnapshot = await adminDb
      .collection("clients")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .offset((page - 1) * limit)
      .get();

    const clients = clientsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));

    const totalSnapshot = await adminDb.collection("clients").count().get();
    const total = totalSnapshot.data().count;

    return NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientData = await request.json();

    const clientRef = adminDb.collection("clients").doc();

    const client = {
      id: clientRef.id,
      ...clientData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await clientRef.set(client);

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}
