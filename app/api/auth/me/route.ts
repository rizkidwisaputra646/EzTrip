export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionUid = cookieStore.get("eztrip_session_uid")?.value;

    if (!sessionUid) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUid },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        role: true,
        avatarUrl: true,
      },
    });

    return NextResponse.json({ user: user || null });
  } catch (err: any) {
    return NextResponse.json({ user: null });
  }
}
