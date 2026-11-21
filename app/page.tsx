"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEzTripStore } from "@/lib/store";
import FadeIn from "@/components/FadeIn";
import {
  Star,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Radio,
  FileCheck2,
  Bus,
  MessageCircle,
  CreditCard,
  Camera,
  Utensils,
  Anchor,
  Sparkles,
  ChevronDown,
  Compass,
} from "lucide-react";

function LandingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    currentUser,
    isLoggedIn,
    packages,
    isInitialized,
  } = useEzTripStore();

  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const isPreviewMode = searchParams.get("preview") === "true";

  // AUTO-REDIRECT BASED ON ROLE:
  useEffect(() => {
    if (!isInitialized) return;
    if (isPreviewMode) return;

    if (currentUser?.role === "admin") {
      router.replace("/admin/dashboard");
    } else if (currentUser?.role === "tour_leader") {
      router.replace("/tour-leader/manifest");
    }
  }, [currentUser, isInitialized, isPreviewMode, router]);

  // Filter packages
  const filteredPackages = packages.filter((pkg) => {
    if (selectedCategory === "Semua") return true;
    if (selectedCategory === "Bahari" && pkg.category === "Beach & Island") return true;
    if (selectedCategory === "Konservasi" && pkg.category === "Wildlife Safari") return true;
    if (selectedCategory === "Budaya" && pkg.category === "Culture & Culinary") return true;
    return true;
  });

  const faqs = [
    {
      q: "Di mana lokasi titik kumpul (meeting point) keberangkatan resmi?",
      a: "Tersedia 2 titik kumpul utama yang ditentukan resmi oleh EZ Trip: (1) Stasiun Tanjung Karang (TKG) pukul 06:00 WIB untuk penjemputan dari kereta api / pusat kota, dan (2) Dermaga Ketapang Pesawaran pukul 08:30 WIB bagi tamu yang langsung menuju dermaga penyeberangan kapal jelajah.",
    },
    {
      q: "Apakah aman bagi peserta yang belum bisa berenang atau snorkeling?",
      a: "Sangat aman. Setiap peserta wajib menggunakan Life Jacket standar keselamatan SNI. Tim pemandu kami berlisensi resmi HPI (Himpunan Pramuwisata Indonesia) dan instruktur snorkeling bersertifikat akan mendampingi Anda di air secara intensif.",
    },
    {
      q: "Bagaimana alur dan metode pembayaran di EZ Trip?",
      a: "Pembayaran terintegrasi otomatis. Anda dapat memilih Virtual Account Bank (BCA, Mandiri, BRI, BNI, Permata) atau QRIS (GoPay, OVO, Dana, ShopeePay). Status pembayaran langsung terverifikasi seketika dan E-Tiket resmi dengan QR Code langsung terbit.",
    },
    {
      q: "Apakah kuota bus dibatasi dan bisa memilih nomor kursi?",
      a: "Ya! Kami menggunakan armada bus pariwisata eksekutif Jetbus 3+ dengan kapasitas 20 kursi nyaman formasi 2-2. Anda memilih jumlah tamu terlebih dahulu, lalu langsung memilih nomor kursi spesifik di denah kabin interaktif.",
    },
    {
      q: "Apakah ada jaminan pasti berangkat meskipun peserta sedikit?",
      a: "EZ Trip memberikan Jaminan Pasti Berangkat tiap akhir pekan (Jumat - Minggu). Jadwal keberangkatan tetap terlaksana tanpa pembatalan sepihak, sehingga rencana liburan Anda tetap terjamin.",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-hidden">
      {/* PREVIEW MODE BANNER FOR OPERATIONAL USERS BROWSING LANDING PAGE */}
      {isLoggedIn && currentUser && currentUser.role !== "traveler" && isPreviewMode && (
        <FadeIn direction="down" duration={600} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div
            className={`rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg ${
              currentUser.role === "admin"
                ? "bg-gradient-to-r from-brand-navy to-slate-900 border border-slate-700"
                : "bg-gradient-to-r from-brand-green-dark to-emerald-950 border border-emerald-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  currentUser.role === "admin" ? "bg-brand-azure text-white" : "bg-emerald-500 text-white"
                }`}
              >
                {currentUser.role === "admin" ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <FileCheck2 className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                    Mode Pratinjau Tampilan Wisatawan
                  </span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                    Login sebagai {currentUser.role === "admin" ? "Admin" : "Pemandu"}
                  </span>
                </div>
                <p className="text-xs text-slate-200 mt-0.5">
                  Anda sedang melihat landing page publik seperti yang dilihat oleh calon wisatawan.
                </p>
              </div>
            </div>

            <Link
              href={currentUser.role === "admin" ? "/admin/dashboard" : "/tour-leader/manifest"}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shrink-0 transition-transform hover:scale-105 shadow-md ${
                currentUser.role === "admin"
                  ? "bg-brand-azure hover:bg-sky-500 text-white"
                  : "bg-white text-emerald-950 hover:bg-emerald-50"
              }`}
            >
              <span>Kembali ke Portal {currentUser.role === "admin" ? "Admin" : "Tour Leader"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </FadeIn>
      )}

      {/* TRAVELER SHORTCUT BANNER IF VISITING LANDING PAGE WHILE LOGGED IN */}
      {isLoggedIn && currentUser && currentUser.role === "traveler" && (
        <FadeIn direction="down" duration={600} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg bg-gradient-to-r from-sky-600 via-brand-azure to-blue-700 border border-sky-400/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-white">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-100">
                    Halo, {currentUser.name}!
                  </span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                    Akun Wisatawan
                  </span>
                </div>
                <p className="text-xs text-sky-50 mt-0.5">
                  Anda sedang melihat landing page publik. Ingin cek reservasi aktif, E-Tiket QR, atau denah kursi bus Anda?
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shrink-0 transition-transform hover:scale-105 shadow-md bg-white text-brand-navy hover:bg-slate-50"
            >
              <span>Buka Dashboard Saya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </FadeIn>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative bg-brand-navy text-white overflow-hidden">
        {/* Background Landscape Photo with slow breathe effect */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/beach_pahawang.jpg"
            alt="Pahawang Lampung"
            fill
            priority
            className="object-cover opacity-35 scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-transparent" />
        </div>

        {/* Ambient Glows */}
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-brand-azure/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute -right-20 bottom-0 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 space-y-8">
          {/* Tagline Badge */}
          <FadeIn direction="up" delay={50} duration={600}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-300 text-xs font-extrabold uppercase tracking-wider shadow-sm">
              <Radio className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
              <span>Open & Private Trip Weekend Lampung 2026</span>
            </div>
          </FadeIn>

          {/* Editorial Headline */}
          <FadeIn direction="up" delay={150} duration={750} className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-editorial leading-[1.15]">
              Eksplorasi Keindahan Bahari & Alam Liar Lampung Tanpa Ribet
            </h1>
            <p className="text-slate-300 text-sm sm:text-lg leading-relaxed max-w-2xl">
              Paket 3D2N all-inclusive resmi: homestay apung di atas air jernih Teluk Lampung, lumba-lumba Kiluan, gajah Way Kambas, dan bus pariwisata AC eksekutif dengan nomor kursi terjamin.
            </p>
          </FadeIn>

          {/* Quick Action CTA Buttons */}
          <FadeIn direction="up" delay={250} duration={700}>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/#paket"
                className="inline-flex items-center gap-2 px-7 py-4 bg-brand-orange hover:bg-orange-600 text-white font-extrabold text-sm rounded-2xl transition-all shadow-xl shadow-brand-orange/30 hover:scale-[1.03] active:scale-[0.98]"
              >
                <span>Jelajah 3 Paket Wisata</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/booking/schedule?packageId=pahawang-kiluan`}
                className="inline-flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl transition-all backdrop-blur-md border border-white/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4 text-sky-300" />
                <span>Pesan Jadwal Terdekat</span>
              </Link>
            </div>
          </FadeIn>

          {/* 4 Trust Badges Grid (Staggered Animation) */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <FadeIn direction="up" delay={300} duration={600} className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Jaminan Pasti Berangkat</p>
                <p className="text-slate-400 text-[11px]">Tiap akhir pekan tanpa batal</p>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={400} duration={600} className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Pemandu Berlisensi HPI</p>
                <p className="text-slate-400 text-[11px]">Resmi Himpunan Pramuwisata</p>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={500} duration={600} className="flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Pembayaran Otomatis</p>
                <p className="text-slate-400 text-[11px]">QRIS & VA langsung verifikasi</p>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={600} duration={600} className="flex items-center gap-2.5">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Rating 4.9 / 5.0</p>
                <p className="text-slate-400 text-[11px]">Dari 850+ tamu bahagia</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. 3 OFFICIAL PACKAGES SECTION */}
      <section id="paket" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        <FadeIn direction="up" duration={700}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-azure">
                Kurasi Destinasi Resmi
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-navy tracking-tight font-editorial">
                Paket Wisata 3D2N Favorit Lampung
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Pilihan open trip akhir pekan dengan itinerary matang, tiket masuk wisata lunas, dan fasilitas terlengkap.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {["Semua", "Bahari", "Konservasi", "Budaya"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                    selectedCategory === cat
                      ? "bg-brand-azure text-white shadow-md shadow-brand-azure/30 scale-105"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* 3 Packages Cards (Staggered FadeIn) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {filteredPackages.map((pkg, idx) => (
            <FadeIn
              key={pkg.id}
              direction="up"
              delay={idx * 150}
              duration={700}
              className="h-full"
            >
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group">
                {/* Image Preview */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={pkg.imagePath}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-extrabold text-brand-navy shadow-sm">
                    {pkg.duration}
                  </div>
                  <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-extrabold text-amber-500 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{pkg.rating}</span>
                    <span className="text-slate-400 font-normal">({pkg.reviewCount})</span>
                  </div>
                  {pkg.badgeText && (
                    <div className="absolute bottom-3 left-3 bg-brand-orange text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-md">
                      {pkg.badgeText}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-azure">
                      {pkg.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-brand-navy leading-snug group-hover:text-brand-azure transition-colors">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {pkg.subtitle}
                    </p>
                  </div>

                  {/* Highlights preview */}
                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">
                    {pkg.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-green shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-brand-azure" />
                        Start TKG & Ketapang
                      </span>
                      <span className="font-bold text-brand-green">
                        Tersedia {pkg.availableSeats} Kursi Bus
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Harga All-In</p>
                        <p className="text-xl font-extrabold text-brand-navy">
                          {pkg.priceFormatted}
                          <span className="text-xs font-normal text-slate-400"> /org</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/packages/${pkg.id}`}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all active:scale-95"
                        >
                          Detail
                        </Link>
                        <Link
                          href={`/booking/schedule?packageId=${pkg.id}`}
                          className="px-4 py-2 bg-brand-azure hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-azure/25 active:scale-95"
                        >
                          Pilih Jadwal
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 3. ALL-INCLUSIVE FACILITIES SECTION */}
      <section id="fasilitas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <FadeIn direction="up" duration={800}>
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white space-y-10 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-400">
                Standar Fasilitas Terjamin
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-editorial">
                Liburan Nyaman Tanpa Biaya Tersembunyi
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Semua paket EZ Trip dirancang dengan standar operasional all-inclusive. Anda cukup siapkan pakaian dan perlengkapan pribadi.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: Bus,
                  title: "Armada Bus AC Eksekutif",
                  desc: "Jetbus 3+ Royal Class formasi 2-2, reclining seat, charger port tiap baris, dan pengemudi berpengalaman rute Lampung.",
                  color: "bg-brand-azure/20 text-sky-400",
                },
                {
                  icon: Anchor,
                  title: "Homestay Apung di Atas Laut",
                  desc: "Kamar apung bersih langsung di atas air jernih Teluk Lampung dengan hembusan angin laut dan view sunset eksotis.",
                  color: "bg-emerald-500/20 text-emerald-400",
                },
                {
                  icon: Utensils,
                  title: "Makan 7x & BBQ Seafood",
                  desc: "Sajian kuliner khas pesisir Lampung, ikan bakar segar, sambal seruit lezat, kelapa muda pantai, dan air mineral tak terbatas.",
                  color: "bg-brand-orange/20 text-orange-400",
                },
                {
                  icon: Camera,
                  title: "Dokumentasi Drone & Underwater",
                  desc: "Pilot drone profesional untuk aerial video 4K dan pemandu foto bawah laut (GoPro/Olympus Tough) tanpa pungutan biaya tambahan.",
                  color: "bg-sky-500/20 text-sky-300",
                },
                {
                  icon: ShieldCheck,
                  title: "Pemandu Berlisensi Resmi HPI",
                  desc: "Dipandu langsung oleh Tour Leader Kang Dedi & tim Himpunan Pramuwisata Indonesia Lampung yang menguasai keselamatan laut.",
                  color: "bg-brand-azure/20 text-sky-400",
                },
                {
                  icon: CreditCard,
                  title: "Pembayaran Otomatis & Tiket QR Instan",
                  desc: "Checkout mudah lewat Virtual Account bank atau QRIS nasional. E-Tiket otomatis tersimpan dan siap dipindai di meeting point.",
                  color: "bg-emerald-500/20 text-emerald-400",
                },
              ].map((f, i) => (
                <FadeIn
                  key={i}
                  direction="up"
                  delay={i * 100}
                  duration={600}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center shrink-0`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">{f.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-brand-azure/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </FadeIn>
      </section>

      {/* 4. HOW IT WORKS (4 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <FadeIn direction="up" duration={700} className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-azure">
            Alur Booking Simpel
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-navy tracking-tight font-editorial">
            4 Langkah Mudah Menuju Liburan Anda
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Sistem pemesanan transparan tanpa perlu chat manual atau konfirmasi transfer berbelit-belit.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Pilih Paket & Jadwal",
              desc: "Tentukan destinasi (Pahawang, Way Kambas, atau Siger) dan pilih tanggal keberangkatan weekend yang Anda inginkan.",
              bg: "bg-sky-100 text-brand-azure",
            },
            {
              step: "02",
              title: "Isi Tamu & Titik Kumpul",
              desc: "Tentukan jumlah penumpang (1-4 orang), identitas KTP/WhatsApp, dan pilih meeting point resmi (Stasiun TKG / Dermaga Ketapang).",
              bg: "bg-emerald-100 text-brand-green",
            },
            {
              step: "03",
              title: "Pilih Kursi Bus Interaktif",
              desc: "Pilih langsung nomor kursi favorit di denah kabin bus Jetbus 3+ sesuai kuota tamu Anda. Kursi terkunci otomatis.",
              bg: "bg-amber-100 text-brand-orange",
            },
            {
              step: "04",
              title: "Bayar & Terbitkan Tiket QR",
              desc: "Bayar menggunakan nomor VA asli atau QRIS. Begitu lunas, E-Tiket ber-QR code langsung terbit untuk ditunjukkan ke Tour Leader.",
              bg: "bg-violet-100 text-violet-700",
            },
          ].map((item, i) => (
            <FadeIn
              key={i}
              direction="up"
              delay={i * 120}
              duration={650}
              className="h-full"
            >
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all h-full space-y-4">
                <div className={`w-10 h-10 rounded-2xl ${item.bg} font-extrabold text-sm flex items-center justify-center`}>
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-brand-navy">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section id="testimoni" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        <FadeIn direction="up" duration={700}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-azure">
                Ulasan Nyata
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-navy tracking-tight font-editorial">
                Apa Kata Wisatawan EZ Trip?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Pengalaman nyata dari sahabat traveler yang telah berlibur bersama kami di Lampung.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-amber-500 text-sm font-bold bg-amber-50 px-4 py-2 rounded-full border border-amber-200 shrink-0">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>4.9 / 5.0 dari 850+ Ulasan</span>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Budi Santoso",
              loc: "Jakarta Selatan • Trip Pahawang",
              initials: "BS",
              color: "bg-brand-azure/10 text-brand-azure",
              review:
                "Trip Pahawang & Kiluan paling terkoordinir yang pernah saya ikuti. Kang Dedi sebagai tour leader ramah dan sabar banget ngarahin yang belum bisa renang. Homestay apungnya bersih, makanan lautnya berlimpah, dan dokumentasi dronenya juara!",
            },
            {
              name: "dr. Siti Rahmawati",
              loc: "Palembang • Trip Way Kambas",
              initials: "SR",
              color: "bg-brand-green/10 text-brand-green",
              review:
                "Bawa anak-anak safari ke Way Kambas sangat menyenangkan. Bus pariwisatanya bersih, AC sejuk, kursi empuk, dan penjemputan di Stasiun Tanjung Karang tepat waktu. Anak-anak bahagia sekali bisa mandiin gajah sumatera secara dekat.",
            },
            {
              name: "Dimas Aditya",
              loc: "Bandung • Trip Culture & Culinary",
              initials: "DA",
              color: "bg-brand-orange/10 text-brand-orange",
              review:
                "Pengalaman seruit lampung dan panorama Menara Siger spektakuler. Sistem pembayarannya serba otomatis, nomor VA langsung muncul dan tiket QR tinggal tunjukin waktu naik bus. Tidak ribet sama sekali!",
            },
          ].map((t, idx) => (
            <FadeIn
              key={idx}
              direction="up"
              delay={idx * 150}
              duration={700}
              className="h-full"
            >
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <div className={`w-9 h-9 rounded-full ${t.color} font-extrabold text-xs flex items-center justify-center`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-navy">{t.name}</p>
                    <p className="text-[11px] text-slate-400">{t.loc}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        <FadeIn direction="up" duration={700} className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-azure">
            Pusat Informasi
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-navy tracking-tight font-editorial">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Jawaban lengkap seputar jadwal, meeting point, keamanan, dan tiket perjalanan EZ Trip.
          </p>
        </FadeIn>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <FadeIn
                key={index}
                direction="up"
                delay={index * 80}
                duration={550}
              >
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all hover:border-brand-azure/40">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-brand-navy hover:text-brand-azure transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-brand-azure" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up" duration={800}>
          <div className="bg-gradient-to-br from-brand-navy via-slate-900 to-brand-navy text-white rounded-3xl p-8 sm:p-12 lg:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-3">
              <span className="inline-block px-3.5 py-1 bg-brand-orange text-white text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-md animate-float-slow">
                Slot Kuota Terbatas Tiap Weekend
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-editorial">
                Siap Liburan Akhir Pekan Terbaik di Lampung?
              </h2>
              <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
                Daftar sekarang, pilih kursi bus favorit Anda, dan nikmati pesona bahari serta petualangan alam bersama tour leader berlisensi resmi.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/#paket"
                className="px-8 py-4 bg-brand-orange hover:bg-orange-600 text-white font-extrabold text-sm rounded-2xl transition-all shadow-xl shadow-brand-orange/30 hover:scale-[1.03] active:scale-[0.98]"
              >
                Pesan Paket Sekarang
              </Link>
              <a
                href="https://wa.me/6281398765432?text=Halo%20EZ%20Trip%20Lampung,%20saya%20ingin%20tanya%20jadwal%20dan%20ketersediaan%20trip%20weekend%20ini."
                target="_blank"
                rel="noreferrer"
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl transition-all backdrop-blur-md border border-white/10 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Konsultasi WhatsApp</span>
              </a>
            </div>

            <div className="absolute -left-16 -top-16 w-64 h-64 bg-brand-azure/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          </div>
        </FadeIn>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold text-slate-400">Memuat EZ Trip Lampung...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}