import { NextResponse } from "next/server";
import crypto from "crypto";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-xWl9iYg0XhQeS38cSt-76t6I";

export async function POST(request: Request) {
  try {
    const notification = await request.json();
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = notification;

    if (!order_id || !status_code || gross_amount === undefined || !signature_key) {
      return NextResponse.json({ error: "Invalid notification payload" }, { status: 400 });
    }

    // Hitung SHA-512 signature
    const inputStr = `${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`;
    const calculatedSignature = crypto.createHash("sha512").update(inputStr).digest("hex");

    if (calculatedSignature !== signature_key) {
      return NextResponse.json({ error: "Invalid signature key" }, { status: 401 });
    }

    let finalStatus = "pending";
    if (transaction_status === "settlement" || (transaction_status === "capture" && fraud_status === "accept")) {
      finalStatus = "paid";
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      finalStatus = "failed";
    }

    return NextResponse.json({
      success: true,
      order_id,
      transaction_status,
      final_status: finalStatus,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Webhook processing error", message: err.message }, { status: 500 });
  }
}
