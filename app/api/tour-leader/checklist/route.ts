export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    let checklist = await prisma.operationalChecklist.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!checklist) {
      checklist = await prisma.operationalChecklist.create({
        data: {
          tripDate: "18 - 20 Okt 2026",
          briefingDone: true,
          lifeJacketReady: false,
          snorkelReady: false,
          homestayConfirmed: false,
          boatCoordDone: false,
        },
      });
    }

    return NextResponse.json({ success: true, data: checklist });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal mengambil SOP checklist", message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value, tripDate } = body;

    let checklist = await prisma.operationalChecklist.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!checklist) {
      checklist = await prisma.operationalChecklist.create({
        data: {
          tripDate: tripDate || "18 - 20 Okt 2026",
          [key]: value,
        },
      });
    } else {
      checklist = await prisma.operationalChecklist.update({
        where: { id: checklist.id },
        data: { [key]: value },
      });
    }

    return NextResponse.json({ success: true, data: checklist });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal memperbarui checklist", message: err.message },
      { status: 500 }
    );
  }
}
