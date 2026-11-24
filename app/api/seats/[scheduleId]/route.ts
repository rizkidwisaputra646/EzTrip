export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { scheduleId: string } }
) {
  try {
    const { scheduleId } = params;

    // Get schedule and its package
    const schedule = await prisma.departureSchedule.findUnique({
      where: { id: scheduleId },
      include: {
        package: {
          include: { fleets: true },
        },
      },
    });

    if (!schedule) {
      return NextResponse.json({ error: "Jadwal tidak ditemukan" }, { status: 404 });
    }

    // Active bookings on this schedule
    const activeBookings = await prisma.booking.findMany({
      where: {
        scheduleDate: schedule.range,
        status: { in: ["Menunggu Pembayaran", "Terkonfirmasi"] },
      },
      select: {
        bookingCode: true,
        leadGuestName: true,
        outboundSeatNumbers: true,
      },
    });

    // Map booked seat numbers to guest names
    const bookedSeatsMap = new Map<string, string>();
    activeBookings.forEach((b) => {
      b.outboundSeatNumbers.forEach((s) => {
        bookedSeatsMap.set(s, b.leadGuestName);
      });
    });

    // Locked seats from package fleet
    const fleet = schedule.package?.fleets[0];
    const lockedSeatsSet = new Set<string>(fleet?.lockedSeats || []);

    const totalSeats = schedule.maxSeats || 20;
    const seatsConfig = [];

    for (let i = 1; i <= totalSeats; i++) {
      const sNum = i < 10 ? `0${i}` : `${i}`;
      let status: "available" | "booked" | "crew_locked" = "available";
      let assignedGuestName: string | undefined = undefined;

      if (bookedSeatsMap.has(sNum)) {
        status = "booked";
        assignedGuestName = bookedSeatsMap.get(sNum);
      } else if (lockedSeatsSet.has(sNum)) {
        status = "crew_locked";
      }

      seatsConfig.push({
        seatNumber: sNum,
        status,
        assignedGuestName,
      });
    }

    return NextResponse.json({ success: true, data: seatsConfig });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal mengambil denah kursi", message: err.message },
      { status: 500 }
    );
  }
}
