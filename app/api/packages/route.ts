export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      include: {
        tiers: true,
        itinerary: {
          orderBy: { dayNumber: "asc" },
        },
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: packages,
    });
  } catch (err: any) {
    console.error("GET /api/packages error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data paket wisata dari database", message: err.message },
      { status: 500 }
    );
  }
}
