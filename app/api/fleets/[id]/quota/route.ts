export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const quota = Math.max(10, Math.min(45, Number(body.totalQuota) || 20));

    const updated = await prisma.busFleet.update({
      where: { id: params.id },
      data: { totalQuota: quota },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal mengupdate kuota armada", message: err.message },
      { status: 500 }
    );
  }
}
