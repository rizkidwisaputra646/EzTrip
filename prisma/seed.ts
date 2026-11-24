import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding EZ Trip Database...");

  // 1. CLEANUP (Idempotent Seed)
  await prisma.payment.deleteMany();
  await prisma.busSeat.deleteMany();
  await prisma.passenger.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.busFleet.deleteMany();
  await prisma.departureSchedule.deleteMany();
  await prisma.itineraryDay.deleteMany();
  await prisma.packageTier.deleteMany();
  await prisma.package.deleteMany();
  await prisma.operationalChecklist.deleteMany();
  await prisma.user.deleteMany();

  // 2. USERS (Hashed Passwords)
  const adminPassword = await bcrypt.hash("AdminEzTrip2026!", 10);
  const leaderPassword = await bcrypt.hash("PemanduHPI2026!", 10);
  const travelerPassword = await bcrypt.hash("Traveler123!", 10);

  const admin = await prisma.user.create({
    data: {
      id: "usr_admin_001",
      name: "Admin Operasional EZ Trip",
      email: "admin@eztrip.id",
      phone: "0811-9876-5432",
      city: "Bandar Lampung",
      role: Role.admin,
      password: adminPassword,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
  });

  const leader = await prisma.user.create({
    data: {
      id: "usr_leader_001",
      name: "Kang Dedi (Tour Leader HPI)",
      email: "pemandu@eztrip.id",
      phone: "0813-9876-5432",
      city: "Pesawaran, Lampung",
      role: Role.tour_leader,
      password: leaderPassword,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
  });

  const traveler1 = await prisma.user.create({
    data: {
      id: "usr_traveler_001",
      name: "Rizki Pratama",
      email: "traveler@eztrip.id",
      phone: "0812-3456-7890",
      city: "Bandar Lampung",
      role: Role.traveler,
      password: travelerPassword,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    },
  });

  const traveler2 = await prisma.user.create({
    data: {
      id: "usr_traveler_002",
      name: "Budi Santoso",
      email: "budi.santoso@gmail.com",
      phone: "0812-1122-3344",
      city: "Jakarta Selatan",
      role: Role.traveler,
      password: travelerPassword,
    },
  });

  const traveler3 = await prisma.user.create({
    data: {
      id: "usr_traveler_003",
      name: "Siti Rahma",
      email: "siti.rahma@yahoo.com",
      phone: "0813-8899-7766",
      city: "Bandung",
      role: Role.traveler,
      password: travelerPassword,
    },
  });

  console.log("Users created successfully (Passwords safely hashed with bcrypt).");

  // 3. PACKAGES
  const pkg1 = await prisma.package.create({
    data: {
      id: "pahawang-kiluan",
      title: "Beach Escape: Pahawang & Kiluan",
      subtitle: "Snorkeling terumbu karang, lumba-lumba bebas Kiluan & homestay apung eksotis.",
      category: "Beach & Island",
      duration: "3 Hari 2 Malam",
      departureSchedule: "Tiap Weekend (Jumat - Minggu)",
      departureHub: "Stasiun Tanjung Karang / Dermaga Ketapang",
      price: 850000,
      rating: 4.9,
      reviewCount: 328,
      imagePath: "/assets/images/beach_pahawang.jpg",
      badgeText: "Favorit Traveler",
      tripType: "Open Trip",
      availableSeats: 6,
      isDeparting: true,
      description:
        "Nikmati surga bahari Lampung di Teluk Betung, Pulau Pahawang Besar, Pahawang Kecil, dan atraksi lumba-lumba liar Teluk Kiluan. Paket lengkap dengan homestay apung di atas air jernih, snorkeling reef, dokumentasi drone, dan kuliner laut khas pesisir.",
      highlights: [
        "Transportasi AC Pariwisata PP dari Bandar Lampung",
        "Homestay Apung di atas air jernih Pulau Pahawang",
        "Makan 7x khas pesisir & Seafood BBQ Malam",
        "Perahu jelajah pulau & Full Set Alat Snorkeling",
        "Dokumentasi Drone & Foto Underwater sepuasnya",
        "Pemandu lokal berlisensi HPI Lampung",
      ],
      tiers: {
        create: [
          {
            name: "Standard Package",
            price: 850000,
            badge: "Paling Populer",
            perks: ["Homestay Apung Kamar Fan", "Makan 7x All-In", "Full Set Snorkel", "Foto & Video Drone"],
          },
          {
            name: "VIP AC Room",
            price: 1100000,
            badge: "Kenyamanan Ekstra",
            perks: ["Private Room AC Homestay", "Makan 7x + Private BBQ", "Full Set Snorkel", "Dokumentasi Khusus"],
          },
        ],
      },
      itinerary: {
        create: [
          {
            dayNumber: 1,
            title: "Penjemputan, Dermaga Ketapang & Eksplorasi Pahawang",
            activities:
              "Meeting point di Stasiun Tanjung Karang (06:00 WIB), perjalanan darat ke Dermaga Ketapang. Naik boat menuju Pulau Kelagian & Pahawang Besar. Check-in homestay apung, snorkeling spot Cukuh Bedil & Nemo Garden, sunset santai.",
          },
          {
            dayNumber: 2,
            title: "Jelajah Teluk Kiluan & Atraksi Lumba-Lumba Liar",
            activities:
              "Morning call pukul 05:30 WIB, berlayar ke spot lumba-lumba Teluk Kiluan dengan jukung tradisional. Snorkeling laguna tersembunyi, makan siang khas pesisir, malam keakraban Seafood BBQ.",
          },
          {
            dayNumber: 3,
            title: "Pasir Timbul, Belanja Oleh-Oleh & Drop Point",
            activities:
              "Sunrise di homestay apung, foto di Pasir Timbul Pahawang Kecil. Kembali ke Dermaga Ketapang, belanja oleh-oleh khas Lampung (Kopi Robusta & Keripik Pisang), drop off di Stasiun Tanjung Karang pukul 16:00 WIB.",
          },
        ],
      },
    },
  });

  const pkg2 = await prisma.package.create({
    data: {
      id: "way-kambas-safari",
      title: "Nature Adventure: Way Kambas & TNBBS",
      subtitle: "Safari gajah liar sumatera, konservasi badak & jelajah hutan rimba lindung.",
      category: "Wildlife Safari",
      duration: "3 Hari 2 Malam",
      departureSchedule: "Tiap Weekend (Jumat - Minggu)",
      departureHub: "Stasiun Tanjung Karang / Bandara Radin Inten II",
      price: 950000,
      rating: 4.8,
      reviewCount: 194,
      imagePath: "/assets/images/way_kambas_misty.jpg",
      badgeText: "Ekowisata",
      tripType: "Open Trip",
      availableSeats: 8,
      isDeparting: false,
      description:
        "Ekspedisi alam liar di Taman Nasional Way Kambas (Pusat Konservasi Gajah) dan Taman Nasional Bukit Barisan Selatan. Amati satwa endemik gajah sumatera dari dekat, mandi gajah di sungai, trekking hutan tropis, dan menginap di eco-lodge asri.",
      highlights: [
        "Jeep Safari 4x4 jelajah hutan Way Kambas",
        "Interaksi memandikan & memberi makan gajah sumatera",
        "Akomodasi Eco-Lodge bernuansa alam rimba",
        "Trekking flora & fauna bersama Ranger BKSDA",
        "Makan 7x sajian kuliner lokal Lampung Timur",
      ],
      tiers: {
        create: [
          {
            name: "Standard Safari",
            price: 950000,
            badge: "Best Value",
            perks: ["Eco-Lodge Room", "Jeep Safari 4x4", "Makan 7x", "Guide Ranger BKSDA"],
          },
        ],
      },
      itinerary: {
        create: [
          {
            dayNumber: 1,
            title: "Penjemputan & Menuju Pusat Latihan Gajah (PLG)",
            activities:
              "Bertemu di Stasiun Tanjung Karang, transit ke Way Jepara. Check-in Eco-Lodge, pengenalan perilaku gajah bersama mahout dan ranger.",
          },
          {
            dayNumber: 2,
            title: "Safari Gajah Hutan & Sungai Way Kanan",
            activities:
              "Jeep safari pagi menyusuri savanna, berpatroli bersama gajah terlatih, susur sungai Way Kanan melihat burung endemik dan kera ekor panjang.",
          },
          {
            dayNumber: 3,
            title: "Eksplorasi TNBBS & Kembali ke Bandar Lampung",
            activities:
              "Trekking ringan konservasi pohon damar, edukasi satwa lindung, perjalanan kembali ke Bandar Lampung dengan drop-off stasiun.",
          },
        ],
      },
    },
  });

  const pkg3 = await prisma.package.create({
    data: {
      id: "siger-teluk-lampung",
      title: "Culture & Culinary: Menara Siger & Teluk Lampung",
      subtitle: "Ikon gerbang emas Sumatera, kain tapis tenun & pesta kuliner seruit pesisir.",
      category: "Culture & Culinary",
      duration: "3 Hari 2 Malam",
      departureSchedule: "Tiap Weekend (Jumat - Minggu)",
      departureHub: "Stasiun Tanjung Karang / Pelabuhan Bakauheni",
      price: 750000,
      rating: 4.7,
      reviewCount: 142,
      imagePath: "/assets/images/menara_siger.jpg",
      badgeText: "Budaya & Kuliner",
      tripType: "Open Trip",
      availableSeats: 10,
      isDeparting: false,
      description:
        "Kenali kemegahan mahkota kebanggaan masyarakat Lampung di Menara Siger Bakauheni dengan pemandangan Selat Sunda yang memukau. Lengkap dengan jelajah kuliner Seruit khas pesisir, sentra keripik pisang Gang PU, dan workshop tenun kain Tapis.",
      highlights: [
        "Tur arsitektur Menara Siger & Titik Nol Jalan Lintas Sumatera",
        "Pesta kuliner khas Seruit ikan bakar & sambal terasi tempoyak",
        "Kunjungan sentra tenun tradisional Tapis Lampung",
        "Hotel bintang 3 di pusat kota Bandar Lampung",
        "Belanja oleh-oleh aneka rasa Keripik Pisang Gang PU",
      ],
      tiers: {
        create: [
          {
            name: "Standard Cultural",
            price: 750000,
            badge: "Paling Hemat",
            perks: ["Hotel Bintang 3 (Twin Share)", "Makan 7x Khas Lampung", "Workshop Tenun", "Transport AC"],
          },
        ],
      },
      itinerary: {
        create: [
          {
            dayNumber: 1,
            title: "Menara Siger & Sunset Selat Sunda",
            activities:
              "Penjemputan di Bakauheni/Stasiun TKG, wisata foto Menara Siger, menikmati kuliner pesisir Teluk Lampung, check-in hotel.",
          },
          {
            dayNumber: 2,
            title: "Wisata Tenun Tapis & Pesta Kuliner Seruit",
            activities:
              "Belajar menenun kain Tapis asli, santap siang menu Seruit autentik, eksplorasi keindahan Teluk Lampung dari bukit Teropong Kota.",
          },
          {
            dayNumber: 3,
            title: "Sentra Oleh-Oleh Gang PU & Drop Point",
            activities:
              "Berburu aneka keripik pisang kepok cokelat & kopi robusta Lampung di Gang PU. Drop point kembali ke stasiun/bandara.",
          },
        ],
      },
    },
  });

  console.log("Packages, Tiers, and Itineraries created.");

  // 4. DEPARTURE SCHEDULES
  const sch1 = await prisma.departureSchedule.create({
    data: {
      id: "sch_01",
      packageId: pkg1.id,
      range: "18 - 20 Okt 2026",
      label: "Weekend Ini",
      status: "Tersedia",
      seatsAvailable: 6,
      maxSeats: 20,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  });

  const sch2 = await prisma.departureSchedule.create({
    data: {
      id: "sch_02",
      packageId: pkg1.id,
      range: "25 - 27 Okt 2026",
      label: "Weekend Depan",
      status: "Tersedia",
      seatsAvailable: 12,
      maxSeats: 20,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  });

  const sch3 = await prisma.departureSchedule.create({
    data: {
      id: "sch_03",
      packageId: pkg1.id,
      range: "01 - 03 Nov 2026",
      label: "Awal Bulan",
      status: "Sisa 4 Kursi",
      seatsAvailable: 4,
      maxSeats: 20,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
  });

  const sch4 = await prisma.departureSchedule.create({
    data: {
      id: "sch_04",
      packageId: pkg1.id,
      range: "08 - 10 Nov 2026",
      label: "Minggu Kedua",
      status: "Tersedia",
      seatsAvailable: 16,
      maxSeats: 20,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  });

  console.log("Departure schedules created.");

  // 5. BUS FLEETS
  await prisma.busFleet.create({
    data: {
      id: "bus_01",
      name: "Bus 01 • Jetbus 3+ Royal Class",
      plateNumber: "BE 7123 BU",
      driverName: "Pak Yanto",
      driverPhone: "0812-7788-9900",
      tourLeaderName: "Kang Dedi",
      tourLeaderId: leader.id,
      packageId: pkg1.id,
      totalQuota: 20,
      lockedSeats: ["19", "20"],
    },
  });

  await prisma.busFleet.create({
    data: {
      id: "bus_02",
      name: "Bus 02 • Toyota HiAce Premio",
      plateNumber: "BE 7890 AA",
      driverName: "Pak Joko",
      driverPhone: "0813-2233-4455",
      tourLeaderName: "Mas Arif",
      packageId: pkg2.id,
      totalQuota: 20,
      lockedSeats: ["01"],
    },
  });

  await prisma.busFleet.create({
    data: {
      id: "bus_03",
      name: "Bus 03 • Medium Bus Eksekutif",
      plateNumber: "BE 7341 CC",
      driverName: "Pak Ridwan",
      driverPhone: "0852-9988-7711",
      tourLeaderName: "Mbak Rina",
      packageId: pkg3.id,
      totalQuota: 20,
      lockedSeats: [],
    },
  });

  console.log("Bus fleets registered.");

  // 6. BOOKINGS & PASSENGERS
  const b1 = await prisma.booking.create({
    data: {
      bookingCode: "EZTRIP-179508-001",
      userId: traveler2.id,
      packageId: pkg1.id,
      scheduleId: sch1.id,
      packageName: pkg1.title,
      packageSubtitle: pkg1.subtitle,
      packageImage: pkg1.imagePath,
      tierName: "All-Inclusive Package",
      scheduleDate: "18 - 20 Okt 2026",
      departureTime: "07:00 WIB",
      meetingPoint: "Stasiun Tanjung Karang (TKG)",
      guestCount: 2,
      leadGuestName: "Budi Santoso",
      leadGuestPhone: "0812-1122-3344",
      leadGuestEmail: "budi.santoso@gmail.com",
      leadGuestIdCard: "3201100000000487",
      specialNotes: "Request homestay apung kamar non-smoking",
      subtotal: 1700000,
      insuranceFee: 0,
      discount: 0,
      totalAmount: 1700000,
      paymentMethod: "BCA Virtual Account",
      paymentChannel: "bca_va",
      status: "Terkonfirmasi",
      tourLeaderName: "Kang Dedi",
      tourLeaderPhone: "0813-9876-5432",
      createdAt: new Date("2026-10-15T10:30:00Z"),
      midtransOrderId: "EZTRIP-179508-001",
      outboundSeatNumbers: ["01", "02"],
      returnSeatNumbers: ["01", "02"],
      vehicleId: "Jetbus 3+ Royal Class",
      isCheckedIn: true,
      checkedInAt: new Date("2026-10-18T06:15:00Z"),
      checkedInBy: "Kang Dedi (Tour Leader)",
      passengers: {
        create: [
          { fullName: "Budi Santoso", isLead: true, idCard: "3201100000000487" },
          { fullName: "Andi Nugroho", isLead: false },
        ],
      },
      payments: {
        create: {
          midtransOrderId: "EZTRIP-179508-001",
          paymentChannel: "bca_va",
          grossAmount: 1700000,
          vaNumber: "67447819959198540644066",
          bank: "BCA",
          transactionStatus: "settlement",
          settlementTime: new Date("2026-10-15T10:35:00Z"),
        },
      },
    },
  });

  const b2 = await prisma.booking.create({
    data: {
      bookingCode: "EZTRIP-179508-002",
      userId: traveler3.id,
      packageId: pkg1.id,
      scheduleId: sch1.id,
      packageName: pkg1.title,
      packageSubtitle: pkg1.subtitle,
      packageImage: pkg1.imagePath,
      tierName: "All-Inclusive Package",
      scheduleDate: "18 - 20 Okt 2026",
      departureTime: "07:00 WIB",
      meetingPoint: "Dermaga Ketapang Pesawaran",
      guestCount: 2,
      leadGuestName: "Siti Rahma",
      leadGuestPhone: "0813-8899-7766",
      leadGuestEmail: "siti.rahma@yahoo.com",
      leadGuestIdCard: "3201200000000512",
      subtotal: 1700000,
      insuranceFee: 0,
      discount: 0,
      totalAmount: 1700000,
      paymentMethod: "QRIS",
      paymentChannel: "qris",
      status: "Terkonfirmasi",
      tourLeaderName: "Kang Dedi",
      tourLeaderPhone: "0813-9876-5432",
      createdAt: new Date("2026-10-16T14:10:00Z"),
      midtransOrderId: "EZTRIP-179508-002",
      outboundSeatNumbers: ["03", "04"],
      returnSeatNumbers: ["03", "04"],
      vehicleId: "Jetbus 3+ Royal Class",
      isCheckedIn: false,
      passengers: {
        create: [
          { fullName: "Siti Rahma", isLead: true, idCard: "3201200000000512" },
          { fullName: "Rina Marlina", isLead: false },
        ],
      },
      payments: {
        create: {
          midtransOrderId: "EZTRIP-179508-002",
          paymentChannel: "qris",
          grossAmount: 1700000,
          qrString:
            "00020101021226620014COM.GO-JEK.WWW011993600914306376744720210M0637674470303UKE51440014ID.CO.QRIS.WWW0215AID6599288295170303UKE52049405530336054068500005802ID5911gym fitness6010ACEH UTARA61052437762395028A1202611191214320tO6cNfUQAID0703A016304A95C",
          transactionStatus: "settlement",
          settlementTime: new Date("2026-10-16T14:15:00Z"),
        },
      },
    },
  });

  const b3 = await prisma.booking.create({
    data: {
      bookingCode: "EZTRIP-179508-003",
      userId: traveler1.id,
      packageId: pkg1.id,
      scheduleId: sch1.id,
      packageName: pkg1.title,
      packageSubtitle: pkg1.subtitle,
      packageImage: pkg1.imagePath,
      tierName: "All-Inclusive Package",
      scheduleDate: "18 - 20 Okt 2026",
      departureTime: "07:00 WIB",
      meetingPoint: "Stasiun Tanjung Karang (TKG)",
      guestCount: 1,
      leadGuestName: "Rizki Pratama",
      leadGuestPhone: "0812-3456-7890",
      leadGuestEmail: "traveler@eztrip.id",
      leadGuestIdCard: "1871000000000123",
      subtotal: 850000,
      insuranceFee: 0,
      discount: 0,
      totalAmount: 850000,
      paymentMethod: "BRI Virtual Account",
      paymentChannel: "bri_va",
      status: "Menunggu Pembayaran",
      tourLeaderName: "Kang Dedi",
      tourLeaderPhone: "0813-9876-5432",
      createdAt: new Date("2026-10-18T08:20:00Z"),
      midtransOrderId: "EZTRIP-179508-003",
      outboundSeatNumbers: ["05"],
      returnSeatNumbers: ["05"],
      vehicleId: "Jetbus 3+ Royal Class",
      isCheckedIn: false,
      passengers: {
        create: [{ fullName: "Rizki Pratama", isLead: true, idCard: "1871000000000123" }],
      },
      payments: {
        create: {
          midtransOrderId: "EZTRIP-179508-003",
          paymentChannel: "bri_va",
          grossAmount: 850000,
          vaNumber: "674476228559124980",
          bank: "BRI",
          transactionStatus: "pending",
        },
      },
    },
  });

  console.log("Bookings and Payments seeded.");

  // 7. SEATS ALLOCATION (For all schedules)
  const allSchedules = [sch1, sch2, sch3, sch4];
  for (const s of allSchedules) {
    for (let i = 1; i <= 20; i++) {
      const seatNum = i < 10 ? `0${i}` : `${i}`;
      let isBooked = false;
      let isLocked = false;
      let bookedCode: string | null = null;

      if (s.id === sch1.id) {
        if (seatNum === "01" || seatNum === "02") {
          isBooked = true;
          bookedCode = b1.bookingCode;
        } else if (seatNum === "03" || seatNum === "04") {
          isBooked = true;
          bookedCode = b2.bookingCode;
        } else if (seatNum === "05") {
          isBooked = true;
          bookedCode = b3.bookingCode;
        } else if (seatNum === "19" || seatNum === "20") {
          isLocked = true;
        }
      }

      await prisma.busSeat.create({
        data: {
          scheduleId: s.id,
          seatNumber: seatNum,
          isBooked,
          isLocked,
          bookingCode: bookedCode,
        },
      });
    }
  }

  console.log("Bus seats allocated (20 seats per schedule).");

  // 8. OPERATIONAL CHECKLIST
  await prisma.operationalChecklist.create({
    data: {
      tripDate: "18 - 20 Okt 2026",
      briefingDone: true,
      lifeJacketReady: false,
      snorkelReady: false,
      homestayConfirmed: false,
      boatCoordDone: false,
    },
  });

  console.log("Operational checklist seeded.");
  console.log("EZ Trip Database Seed COMPLETED SUCCESSFULLY! ✨");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
