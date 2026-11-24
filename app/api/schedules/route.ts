export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const schedules = await prisma.departureSchedule.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        package: {
          select: { id: true, title: true, price: true },
        },
      },
    });
    return NextResponse.json({ success: true, data: schedules });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal mengambil data jadwal", message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { range, label, status, seatsAvailable, maxSeats, packageId } = body;

    const newSch = await prisma.departureSchedule.create({
      data: {
        range: range || "Weekend Baru",
        label: label || "Trip Baru",
        status: status || "Tersedia",
        seatsAvailable: seatsAvailable || 20,
        maxSeats: maxSeats || 20,
        packageId: packageId || undefined,
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
    });

    // Create 20 seats for this new schedule
    const seatsData = [];
    for (let i = 1; i <= (newSch.maxSeats || 20); i++) {
      const sNum = i < 10 ? `0${i}` : `${i}`;
      seatsData.push({
        scheduleId: newSch.id,
        seatNumber: sNum,
        isBooked: false,
        isLocked: false,
      });
    }
    await prisma.busSeat.createMany({ data: seatsData });

    return NextResponse.json({ success: true, data: newSch }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal membuat jadwal baru", message: err.message },
      { status: 500 }
    );
  }
}
