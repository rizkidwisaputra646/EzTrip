export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

const MIDTRANS_SERVER_KEY =
  process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-bANxuPkVtohhqgqwaeHPFagJ";

export async function POST(request: Request) {
  try {
    const notification = await request.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
      va_numbers,
      biller_code,
      bill_key,
    } = notification;

    if (!order_id || !status_code || gross_amount === undefined || !signature_key) {
      return NextResponse.json({ error: "Invalid notification payload" }, { status: 400 });
    }

    // Hitung SHA-512 signature
    const inputStr = `${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY.trim()}`;
    const calculatedSignature = crypto.createHash("sha512").update(inputStr).digest("hex");

    if (calculatedSignature !== signature_key) {
      console.warn("Invalid Midtrans Webhook signature for order:", order_id);
      return NextResponse.json({ error: "Invalid signature key" }, { status: 401 });
    }

    let finalBookingStatus: "Terkonfirmasi" | "Menunggu Pembayaran" | "Dibatalkan" | "Kedaluwarsa" =
      "Menunggu Pembayaran";

    if (
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept")
    ) {
      finalBookingStatus = "Terkonfirmasi";
    } else if (transaction_status === "expire") {
      finalBookingStatus = "Kedaluwarsa";
    } else if (transaction_status === "cancel" || transaction_status === "deny") {
      finalBookingStatus = "Dibatalkan";
    }

    // Update database inside transaction
    await prisma.$transaction(async (tx) => {
      // 1. Find matching booking
      const booking = await tx.booking.findFirst({
        where: {
          OR: [{ midtransOrderId: order_id }, { bookingCode: order_id }],
        },
      });

      if (booking) {
        // Update booking status
        await tx.booking.update({
          where: { bookingCode: booking.bookingCode },
          data: { status: finalBookingStatus },
        });

        // 2. Upsert payment record
        const vaNum = va_numbers && va_numbers[0] ? va_numbers[0].va_number : undefined;
        const bankName = va_numbers && va_numbers[0] ? va_numbers[0].bank : undefined;

        await tx.payment.upsert({
          where: { midtransOrderId: order_id },
          create: {
            bookingCode: booking.bookingCode,
            midtransOrderId: order_id,
            paymentChannel: payment_type || "midtrans",
            grossAmount: Math.round(Number(gross_amount)),
            vaNumber: vaNum,
            bank: bankName,
            billerCode: biller_code,
            billKey: bill_key,
            transactionStatus: transaction_status,
            fraudStatus: fraud_status,
            settlementTime: finalBookingStatus === "Terkonfirmasi" ? new Date() : undefined,
            rawPayload: JSON.stringify(notification),
          },
          update: {
            transactionStatus: transaction_status,
            fraudStatus: fraud_status,
            settlementTime: finalBookingStatus === "Terkonfirmasi" ? new Date() : undefined,
            rawPayload: JSON.stringify(notification),
          },
        });
      }
    });

    console.log(`[Midtrans Webhook] Order ${order_id} -> Status: ${finalBookingStatus}`);

    return NextResponse.json({
      success: true,
      order_id,
      transaction_status,
      final_status: finalBookingStatus,
    });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook processing error", message: err.message }, { status: 500 });
  }
}
