export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    const cookieStore = cookies();
    const sessionUid = cookieStore.get("eztrip_session_uid")?.value;
    let checkerName = "Tour Leader (Kang Dedi)";

    if (sessionUid) {
      const u = await prisma.user.findUnique({ where: { id: sessionUid } });
      if (u) checkerName = u.name;
    }

    const booking = await prisma.booking.findUnique({
      where: { bookingCode: orderId },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 });
    }

    const nextCheckIn = !booking.isCheckedIn;

    const updated = await prisma.booking.update({
      where: { bookingCode: orderId },
      data: {
        isCheckedIn: nextCheckIn,
        checkedInAt: nextCheckIn ? new Date() : null,
        checkedInBy: nextCheckIn ? checkerName : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: nextCheckIn
        ? `Tamu ${updated.leadGuestName} berhasil ditandai hadir.`
        : `Presensi tamu ${updated.leadGuestName} dibatalkan.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal memproses presensi", message: err.message },
      { status: 500 }
    );
  }
}
