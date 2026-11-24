export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const body = await request.json();
    const { newScheduleDate, newSeats } = body;

    if (!newScheduleDate) {
      return NextResponse.json({ error: "Tanggal jadwal baru wajib diisi" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { bookingCode: orderId },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 });
    }

    const updated = await prisma.booking.update({
      where: { bookingCode: orderId },
      data: {
        scheduleDate: newScheduleDate,
        outboundSeatNumbers: newSeats && newSeats.length > 0 ? newSeats : booking.outboundSeatNumbers,
        returnSeatNumbers: newSeats && newSeats.length > 0 ? newSeats : booking.returnSeatNumbers,
        specialNotes: `${booking.specialNotes ? booking.specialNotes + " • " : ""}Rescheduled ke ${newScheduleDate} oleh Admin`,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Jadwal pesanan ${orderId} berhasil dialihkan ke ${newScheduleDate}.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal me-reschedule pesanan", message: err.message },
      { status: 500 }
    );
  }
}
