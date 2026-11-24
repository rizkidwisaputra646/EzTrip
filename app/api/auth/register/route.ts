export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { RegisterSchema } from "@/lib/validations";
import { Role } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, email, phone, city, password } = parsed.data;
    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan gunakan email lain atau login." },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        phone,
        city: city || "Bandar Lampung",
        password: hashedPassword,
        role: Role.traveler,
      },
    });

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || "",
      city: newUser.city || "Bandar Lampung",
      role: newUser.role,
    };

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      message: "Registrasi berhasil",
    });

    response.cookies.set("eztrip_session_uid", newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat registrasi", message: err.message },
      { status: 500 }
    );
  }
}
