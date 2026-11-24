export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { LoginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { emailOrPhone, password } = parsed.data;
    const cleanInput = emailOrPhone.trim().toLowerCase();
    const cleanPhone = cleanInput.replace(/\D/g, "");

    // Search user by email OR phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: cleanInput, mode: "insensitive" } },
          ...(cleanPhone ? [{ phone: { contains: cleanPhone } }] : []),
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Akun belum terdaftar. Silakan periksa kembali email atau nomor HP Anda." },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Kata sandi yang Anda masukkan salah. Silakan coba lagi." },
        { status: 401 }
      );
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      city: user.city || "Bandar Lampung",
      role: user.role,
      avatarUrl: user.avatarUrl,
    };

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      message: "Login berhasil",
    });

    // Set HTTP-only cookie for session
    response.cookies.set("eztrip_session_uid", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat login", message: err.message },
      { status: 500 }
    );
  }
}
