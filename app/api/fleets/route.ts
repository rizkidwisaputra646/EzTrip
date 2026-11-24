export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const fleets = await prisma.busFleet.findMany({
      orderBy: { id: "asc" },
      include: {
        package: {
          select: { id: true, title: true },
        },
      },
    });
    return NextResponse.json({ success: true, data: fleets });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal mengambil data armada bus", message: err.message },
      { status: 500 }
    );
  }
}
