export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pkg = await prisma.package.findUnique({
      where: { id: params.id },
      include: {
        tiers: true,
        itinerary: {
          orderBy: { dayNumber: "asc" },
        },
        schedules: true,
        fleets: true,
      },
    });

    if (!pkg) {
      return NextResponse.json({ error: "Paket wisata tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: pkg });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal mengambil data paket", message: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { price, availableSeats } = body;

    const dataToUpdate: any = {};
    if (typeof price === "number") dataToUpdate.price = price;
    if (typeof availableSeats === "number") dataToUpdate.availableSeats = availableSeats;

    const updated = await prisma.package.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal mengupdate paket wisata", message: err.message },
      { status: 500 }
    );
  }
}
