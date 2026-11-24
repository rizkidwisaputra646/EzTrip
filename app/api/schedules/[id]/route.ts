export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.departureSchedule.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Jadwal berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal menghapus jadwal", message: err.message },
      { status: 500 }
    );
  }
}
