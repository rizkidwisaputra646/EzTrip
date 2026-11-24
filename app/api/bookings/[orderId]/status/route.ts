export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const body = await request.json();
    const { status } = body;

    const updated = await prisma.booking.update({
      where: { bookingCode: orderId },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal memperbarui status pesanan", message: err.message },
      { status: 500 }
    );
  }
}
