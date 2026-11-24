export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { seatNumber } = body;

    const fleet = await prisma.busFleet.findUnique({
      where: { id: params.id },
    });

    if (!fleet) {
      return NextResponse.json({ error: "Armada tidak ditemukan" }, { status: 404 });
    }

    const isLocked = fleet.lockedSeats.includes(seatNumber);
    const newLockedSeats = isLocked
      ? fleet.lockedSeats.filter((s) => s !== seatNumber)
      : [...fleet.lockedSeats, seatNumber].sort();

    const updated = await prisma.busFleet.update({
      where: { id: params.id },
      data: { lockedSeats: newLockedSeats },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal mengubah status kunci kursi", message: err.message },
      { status: 500 }
    );
  }
}
