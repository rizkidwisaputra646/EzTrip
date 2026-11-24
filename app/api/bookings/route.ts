export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { CreateBookingSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 50));
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const skip = (page - 1) * limit;

    const cookieStore = cookies();
    const sessionUid = cookieStore.get("eztrip_session_uid")?.value;

    let userRole = "guest";
    let currentUser = null;

    if (sessionUid) {
      currentUser = await prisma.user.findUnique({
        where: { id: sessionUid },
      });
      if (currentUser) {
        userRole = currentUser.role;
      }
    }

    const where: any = {};

    // Role-based access control
    if (userRole === "traveler" && currentUser) {
      where.OR = [
        { userId: currentUser.id },
        { leadGuestEmail: currentUser.email },
      ];
    } else if (userRole === "tour_leader") {
      // Tour Leader sees all bookings or their trip
      // We can allow tour leader to see all active tour bookings
    } else if (userRole === "admin") {
      // Admin sees all
    }

    // Filter by status if provided
    if (status && status !== "all") {
      where.status = status;
    }

    // Search query
    if (search && search.trim()) {
      const q = search.trim();
      where.AND = [
        {
          OR: [
            { bookingCode: { contains: q, mode: "insensitive" } },
            { leadGuestName: { contains: q, mode: "insensitive" } },
            { leadGuestPhone: { contains: q } },
            { leadGuestEmail: { contains: q, mode: "insensitive" } },
            { packageName: { contains: q, mode: "insensitive" } },
          ],
        },
      ];
    }

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: {
          passengers: true,
          payments: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error("GET /api/bookings error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data reservasi", message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi data reservasi gagal", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check session or anonymous traveler
    const cookieStore = cookies();
    const sessionUid = cookieStore.get("eztrip_session_uid")?.value;
    let userId = sessionUid;

    if (!userId) {
      // Find or create guest user
      const existingUser = await prisma.user.findUnique({
        where: { email: data.leadGuestEmail },
      });
      if (existingUser) {
        userId = existingUser.id;
      } else {
        const guestUser = await prisma.user.create({
          data: {
            name: data.leadGuestName,
            email: data.leadGuestEmail,
            phone: data.leadGuestPhone,
            password: "GuestTravelerPassword!",
            role: "traveler",
          },
        });
        userId = guestUser.id;
      }
    }

    const orderSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `EZTRIP-${Date.now().toString().slice(-6)}-${orderSuffix}`;

    // Execute atomic booking transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify seat availability (anti double-booking)
      const conflictingBookings = await tx.booking.findMany({
        where: {
          packageId: data.packageId,
          scheduleDate: data.scheduleDate,
          status: { in: ["Menunggu Pembayaran", "Terkonfirmasi"] },
          outboundSeatNumbers: { hasSome: data.outboundSeatNumbers },
        },
      });

      if (conflictingBookings.length > 0) {
        throw new Error(
          `Salah satu kursi yang Anda pilih (${data.outboundSeatNumbers.join(
            ", "
          )}) baru saja dipesan oleh wisatawan lain. Silakan pilih kursi lain.`
        );
      }

      // 2. Create Booking
      const booking = await tx.booking.create({
        data: {
          bookingCode,
          userId,
          packageId: data.packageId,
          scheduleId: data.scheduleId,
          packageName: data.packageName,
          packageSubtitle: data.packageSubtitle || "",
          packageImage: data.packageImage || "/assets/images/beach_pahawang.jpg",
          tierName: data.tierName || "Standard Package",
          scheduleDate: data.scheduleDate,
          departureTime: data.departureTime || "07:00 WIB",
          meetingPoint: data.meetingPoint,
          guestCount: data.guestCount,
          leadGuestName: data.leadGuestName,
          leadGuestPhone: data.leadGuestPhone,
          leadGuestEmail: data.leadGuestEmail,
          leadGuestIdCard: data.leadGuestIdCard,
          specialNotes: data.specialNotes,
          subtotal: data.subtotal,
          insuranceFee: data.insuranceFee || 0,
          discount: data.discount || 0,
          totalAmount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          paymentChannel: data.paymentChannel,
          status: "Menunggu Pembayaran",
          tourLeaderName: "Kang Dedi",
          tourLeaderPhone: "0813-9876-5432",
          midtransOrderId: bookingCode,
          outboundSeatNumbers: data.outboundSeatNumbers,
          returnSeatNumbers: data.returnSeatNumbers || data.outboundSeatNumbers,
          vehicleId: data.vehicleId || "Jetbus 3+ Royal Class",
          isCheckedIn: false,
          passengers: {
            create: [
              { fullName: data.leadGuestName, isLead: true, idCard: data.leadGuestIdCard },
              ...(data.guest2Name ? [{ fullName: data.guest2Name, isLead: false }] : []),
              ...(data.guest3Name ? [{ fullName: data.guest3Name, isLead: false }] : []),
              ...(data.guest4Name ? [{ fullName: data.guest4Name, isLead: false }] : []),
            ],
          },
        },
      });

      // 3. Mark bus seats if schedule exists
      if (data.scheduleId) {
        for (const seatNum of data.outboundSeatNumbers) {
          await tx.busSeat.upsert({
            where: {
              scheduleId_seatNumber: {
                scheduleId: data.scheduleId,
                seatNumber: seatNum,
              },
            },
            update: {
              isBooked: true,
              bookingCode: booking.bookingCode,
            },
            create: {
              scheduleId: data.scheduleId,
              seatNumber: seatNum,
              isBooked: true,
              bookingCode: booking.bookingCode,
            },
          });
        }
      }

      return booking;
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/bookings error:", err);
    return NextResponse.json(
      { error: err.message || "Gagal membuat reservasi tiket" },
      { status: 400 }
    );
  }
}
