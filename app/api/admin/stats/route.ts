export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalBookings,
      confirmedBookings,
      pendingBookings,
      revenueResult,
      fleetsCount,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "Terkonfirmasi" } }),
      prisma.booking.count({ where: { status: "Menunggu Pembayaran" } }),
      prisma.booking.aggregate({
        where: { status: "Terkonfirmasi" },
        _sum: { totalAmount: true },
      }),
      prisma.busFleet.count(),
    ]);

    const totalRevenue = revenueResult._sum.totalAmount || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        confirmedCount: confirmedBookings,
        pendingCount: pendingBookings,
        totalBookings,
        fleetsCount,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal mengambil statistik dashboard", message: err.message },
      { status: 500 }
    );
  }
}
