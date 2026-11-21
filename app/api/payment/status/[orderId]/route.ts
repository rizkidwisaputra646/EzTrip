import { NextResponse } from "next/server";

const MIDTRANS_SNAP_URL = "https://app.sandbox.midtrans.com";
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-xWl9iYg0XhQeS38cSt-76t6I";

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;
    if (!orderId) {
      return NextResponse.json({ error: "Order ID missing" }, { status: 400 });
    }

    const auth = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");
    const res = await fetch(`${MIDTRANS_SNAP_URL}/v2/${encodeURIComponent(orderId)}/status`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch status", message: err.message }, { status: 500 });
  }
}
