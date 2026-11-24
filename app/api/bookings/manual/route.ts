export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { ManualBookingSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ManualBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const cookieStore = cookies();
    const sessionUid = cookieStore.get("eztrip_session_uid")?.value;
    const adminUser = sessionUid ? await prisma.user.findUnique({ where: { id: sessionUid } }) : null;

    const pkg = await prisma.package.findUnique({
      where: { id: data.packageId },
    });

    if (!pkg) {
      return NextResponse.json({ error: "Paket wisata tidak ditemukan" }, { status: 404 });
    }

    const guestCount = data.guestCount || 1;
    const totalAmount = data.totalAmount || pkg.price * guestCount;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const bookingCode = `EZTRIP-MANUAL-${randomSuffix}`;

    const newBooking = await prisma.booking.create({
      data: {
        bookingCode,
        userId: adminUser?.id || "usr_admin_001",
        packageId: pkg.id,
        packageName: pkg.title,
        packageSubtitle: pkg.subtitle,
        packageImage: pkg.imagePath,
        tierName: "All-Inclusive Package (Kantor)",
        scheduleDate: data.scheduleDate,
        departureTime: "07:00 WIB",
        meetingPoint: data.meetingPoint || "Stasiun Tanjung Karang (TKG)",
        guestCount,
        leadGuestName: data.leadGuestName,
        leadGuestPhone: data.leadGuestPhone,
        leadGuestEmail:
          data.leadGuestEmail ||
          `${data.leadGuestName.toLowerCase().replace(/\s+/g, "")}@customer.eztrip.id`,
        leadGuestIdCard: data.leadGuestIdCard || "1871000000000000",
        specialNotes:
          data.specialNotes ||
          "Reservasi Manual Staf Kantor (Pembayaran Tunai / Transfer Langsung)",
        subtotal: totalAmount,
        insuranceFee: 0,
        discount: 0,
        totalAmount,
        paymentMethod: data.paymentMethod || "Tunai di Kantor (Cash)",
        paymentChannel: "permata_va",
        status: "Terkonfirmasi",
        tourLeaderName: "Kang Dedi",
        tourLeaderPhone: "0813-9876-5432",
        midtransOrderId: bookingCode,
        outboundSeatNumbers: data.outboundSeatNumbers && data.outboundSeatNumbers.length > 0
          ? data.outboundSeatNumbers
          : ["17"],
        returnSeatNumbers: data.outboundSeatNumbers && data.outboundSeatNumbers.length > 0
          ? data.outboundSeatNumbers
          : ["17"],
        vehicleId: "Jetbus 3+ Royal Class",
        isCheckedIn: false,
        passengers: {
          create: [
            { fullName: data.leadGuestName, isLead: true },
            ...(data.guest2Name ? [{ fullName: data.guest2Name, isLead: false }] : []),
            ...(data.guest3Name ? [{ fullName: data.guest3Name, isLead: false }] : []),
            ...(data.guest4Name ? [{ fullName: data.guest4Name, isLead: false }] : []),
          ],
        },
      },
    });

    return NextResponse.json({
      success: true,
      bookingCode,
      data: newBooking,
      message: `Tiket manual ${bookingCode} untuk ${data.leadGuestName} berhasil diterbitkan (Status: Lunas).`,
    });
  } catch (err: any) {
    console.error("Manual booking error:", err);
    return NextResponse.json(
      { error: "Gagal membuat tiket manual", message: err.message },
      { status: 500 }
    );
  }
}
