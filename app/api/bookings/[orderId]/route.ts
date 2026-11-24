export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { bookingCode: orderId },
          { midtransOrderId: orderId },
        ],
      },
      include: {
        passengers: true,
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        package: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Tiket pesanan tidak ditemukan" }, { status: 404 });
    }

    const latestPayment = booking.payments[0] || null;

    const formatted = {
      ...booking,
      vaNumber: latestPayment?.vaNumber,
      bank: latestPayment?.bank,
      billerCode: latestPayment?.billerCode,
      billKey: latestPayment?.billKey,
      qrString: latestPayment?.qrString,
      expiryTime: latestPayment?.expiryTime,
    };

    return NextResponse.json({ success: true, data: formatted });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal mengambil data tiket", message: err.message },
      { status: 500 }
    );
  }
}
