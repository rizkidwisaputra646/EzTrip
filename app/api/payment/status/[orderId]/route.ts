export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const MIDTRANS_SNAP_URL = process.env.MIDTRANS_SNAP_URL || "https://app.sandbox.midtrans.com";
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-bANxuPkVtohhqgqwaeHPFagJ";

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;
    if (!orderId) {
      return NextResponse.json({ error: "Order ID missing" }, { status: 400 });
    }

    // 1. Check local database first
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ bookingCode: orderId }, { midtransOrderId: orderId }],
      },
      include: {
        payments: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (booking && booking.status === "Terkonfirmasi") {
      return NextResponse.json({
        transaction_status: "settlement",
        order_id: orderId,
        gross_amount: String(booking.totalAmount),
        status_code: "200",
        status_message: "Success, transaction is settled",
      });
    }

    // 2. Query Midtrans API
    const auth = Buffer.from(`${MIDTRANS_SERVER_KEY.trim()}:`).toString("base64");
    const res = await fetch(`${MIDTRANS_SNAP_URL}/v2/${encodeURIComponent(orderId)}/status`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      const status = data.transaction_status;

      if (status === "settlement" || status === "capture") {
        // Sync to database
        if (booking && booking.status !== "Terkonfirmasi") {
          await prisma.booking.update({
            where: { bookingCode: booking.bookingCode },
            data: { status: "Terkonfirmasi" },
          });
        }
      }

      return NextResponse.json(data);
    }

    return NextResponse.json(
      { transaction_status: booking?.status === "Terkonfirmasi" ? "settlement" : "pending" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch status", message: err.message },
      { status: 500 }
    );
  }
}
