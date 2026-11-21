"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEzTripStore } from "@/lib/store";
import {
  LayoutDashboard,
  Ticket,
  Compass,
  CreditCard,
  MessageCircle,
  Search,
  Bell,
  ChevronRight,
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  Bus,
  User,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Phone,
  Luggage,
  CheckSquare,
  Square,
  ArrowRight,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

export default function UserDashboardPage() {
  const router = useRouter();
  const { currentUser, isInitialized, bookings, packages, logout } = useEzTripStore();

  // Route guard
  useEffect(() => {
    if (!isInitialized) return;
    if (!currentUser) {
      router.replace("/login?message=login_required");
      return;
    }
    if (currentUser.role === "admin") {
      router.replace("/admin/dashboard");
    } else if (currentUser.role === "tour_leader") {
      router.replace("/tour-leader/manifest");
    }
  }, [currentUser, isInitialized, router]);

  // Active view tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "tickets" | "explore" | "support">("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  // Packing Checklist state
  const [packingChecklist, setPackingChecklist] = useState({
    ktp: true,
    swimwear: true,
    sunblock: false,
    medicine: false,
    cash: false,
  });

  const toggleCheck = (key: keyof typeof packingChecklist) => {
    setPackingChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Traveler's bookings
  const myBookings = bookings.filter(
    (b) =>
      b.userId === currentUser?.id ||
      b.leadGuestEmail.toLowerCase() === currentUser?.email.toLowerCase() ||
      b.leadGuestPhone.replace(/\D/g, "") === currentUser?.phone.replace(/\D/g, "")
  );

  const activeBooking = myBookings.find((b) => b.status === "Terkonfirmasi") || myBookings[0];

  const checkedCount = Object.values(packingChecklist).filter(Boolean).length;
  const readinessPercent = Math.round((checkedCount / 5) * 100);

  if (!isInitialized || !currentUser) {
    return (
      <div className="min-h-screen bg-[#F4F7FE] flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="w-10 h-10 border-4 border-brand-azure border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-500">Memuat Portal Wisatawan EZ Trip...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex text-slate-800 antialiased font-sans">
      {/* 1. LEFT SIDEBAR (Modern Professional Layout) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 p-6 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-10 w-32 flex items-center">
                <Image
                  src="/assets/images/logo_eztrip.png"
                  alt="EZ Trip"
                  fill
                  className="object-contain object-left group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
            </Link>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
                activeTab === "dashboard"
                  ? "bg-brand-azure text-white shadow-md shadow-brand-azure/25"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("tickets");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
                activeTab === "tickets"
                  ? "bg-brand-azure text-white shadow-md shadow-brand-azure/25"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Ticket className="w-4 h-4" />
                <span>Tiket Saya</span>
              </div>
              {activeBooking && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    activeTab === "tickets"
                      ? "bg-white/20 text-white"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  1 Aktif
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab("explore");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
                activeTab === "explore"
                  ? "bg-brand-azure text-white shadow-md shadow-brand-azure/25"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Jelajah Trip</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("support");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
                activeTab === "support"
                  ? "bg-brand-azure text-white shadow-md shadow-brand-azure/25"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pusat Bantuan</span>
            </button>

            <Link
              href="/"
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-slate-500 hover:text-brand-azure hover:bg-slate-50 transition-all pt-3 border-t border-slate-100 mt-2"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4" />
                <span>Lihat Landing Page</span>
              </div>
            </Link>
          </nav>
        </div>

        {/* Bottom Support Callout Card */}
        <div className="bg-gradient-to-br from-sky-50 to-blue-50/60 p-4 rounded-2xl border border-sky-100 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-azure text-white flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-brand-navy">Hotline Tour Leader</p>
              <p className="text-[10px] text-slate-500">Standby 24 Jam</p>
            </div>
          </div>
          <a
            href="https://wa.me/6281398765432"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block text-center py-2 bg-white hover:bg-sky-50 text-brand-azure font-extrabold text-[11px] rounded-xl shadow-xs border border-sky-200 transition-colors"
          >
            Hubungi WhatsApp
          </a>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Pill Search Bar with Blue Button (Matching Reference Design) */}
            <div className="relative flex-1 flex items-center">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kode booking, destinasi, atau tanggal..."
                  className="w-full pl-9 pr-24 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-azure/30 focus:border-brand-azure transition-all"
                />
                <button
                  type="button"
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-3.5 py-1 bg-brand-azure hover:bg-sky-600 text-white font-extrabold text-[11px] rounded-full transition-colors shadow-xs"
                >
                  Cari
                </button>
              </div>
            </div>
          </div>

          {/* Right Profile & Notifications */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotification(!showNotification)}
                className="p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 relative transition-colors"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-brand-orange ring-2 ring-white absolute top-1.5 right-1.5" />
              </button>

              {showNotification && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 text-xs z-50 animate-in fade-in">
                  <p className="font-extrabold text-brand-navy mb-1">Pengingat Keberangkatan</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Trip akhir pekan Anda telah terkonfirmasi lunas. Tiket QR Code siap ditunjukkan ke Tour Leader di Stasiun TKG.
                  </p>
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-navy to-brand-azure text-white font-black text-xs flex items-center justify-center shadow-xs">
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-extrabold text-slate-800 leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400">Wisatawan Terverifikasi</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors ml-1"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-4 sm:p-8 space-y-6">
          {activeTab === "dashboard" && (
            <>
              {/* TOP ROW: 4 STAT CARDS (2x2 Grid) + VIBRANT BLUE HERO CARD (Matching Reference Image) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 4 Stat Cards in 2x2 Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: Trip Aktif */}
                  <div
                    onClick={() => setActiveTab("tickets")}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex items-center justify-between cursor-pointer hover:border-brand-azure/30 transition-all group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-sky-50 text-brand-azure flex items-center justify-center font-bold">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xl font-extrabold text-slate-900">
                          {activeBooking ? "1 Trip Aktif" : "0 Trip"}
                        </p>
                        <p className="text-xs text-slate-400">Pahawang & Kiluan</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-azure group-hover:translate-x-0.5 transition-all" />
                  </div>

                  {/* Card 2: Status Pembayaran */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex items-center justify-between group">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xl font-extrabold text-slate-900">Lunas</p>
                        <p className="text-xs text-slate-400">Terverifikasi Otomatis</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Card 3: Nomor Kursi Bus */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex items-center justify-between group">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-amber-50 text-brand-orange flex items-center justify-center font-bold">
                        <Bus className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xl font-extrabold text-slate-900">
                          {activeBooking ? `Kursi ${activeBooking.outboundSeatNumbers.join(", ")}` : "Belum Ada"}
                        </p>
                        <p className="text-xs text-slate-400">Jetbus 3+ Eksekutif</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Card 4: Tour Leader Bertugas */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex items-center justify-between group">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xl font-extrabold text-slate-900">Kang Dedi</p>
                        <p className="text-xs text-slate-400">Lisensi Resmi HPI</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Right: Vibrant Blue Hero Card (Matching Reference Design) */}
                <div className="bg-gradient-to-r from-brand-azure to-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-brand-azure/20 flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-1.5 relative z-10">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                      Pemesanan Terverifikasi
                    </span>
                    <h3 className="text-lg font-extrabold leading-snug">
                      Halo, {currentUser.name}! 🌊
                    </h3>
                    <p className="text-xs text-sky-100">
                      {activeBooking ? activeBooking.packageName : "Belum ada tiket aktif"}
                    </p>
                  </div>

                  <div className="my-3 relative z-10">
                    <p className="text-2xl font-black font-mono tracking-tight">
                      {activeBooking ? `Rp ${activeBooking.totalAmount.toLocaleString("id-ID")}` : "Rp 0"}
                    </p>
                    <p className="text-[10px] text-sky-100 mt-0.5">
                      {activeBooking ? `Jadwal: ${activeBooking.scheduleDate}` : "Pesan paket liburan weekend Anda"}
                    </p>
                  </div>

                  <div className="relative z-10">
                    {activeBooking ? (
                      <Link
                        href={`/booking/ticket/${activeBooking.bookingCode}`}
                        className="w-full text-center py-2.5 bg-white hover:bg-slate-50 text-brand-azure font-extrabold text-xs rounded-xl shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Buka E-Tiket QR</span>
                      </Link>
                    ) : (
                      <Link
                        href="/#paket"
                        className="w-full text-center py-2.5 bg-white hover:bg-slate-50 text-brand-azure font-extrabold text-xs rounded-xl shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Pesan Trip Sekarang
                      </Link>
                    )}
                  </div>

                  <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                </div>
              </div>

              {/* MIDDLE ROW: CHECKLIST & ITINERARY (LEFT) + GAUGE & MEETING POINT (RIGHT) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Card: Checklist Persiapan Keberangkatan */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <Luggage className="w-5 h-5 text-brand-azure" />
                        Checklist Barang Bawaan Wisatawan (3D2N)
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Centang perlengkapan sebelum tiba di Stasiun Tanjung Karang:
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-brand-azure bg-sky-50 px-2.5 py-1 rounded-full">
                      {checkedCount} dari 5 Siap ({readinessPercent}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                      { key: "ktp" as const, title: "1. KTP Asli / Identitas", desc: "Wajib ditunjukkan saat presensi di bus & syahbandar." },
                      { key: "swimwear" as const, title: "2. Baju Renang & Pakaian Kering", desc: "Bawa minimal 3 stel pakaian santai untuk homestay apung." },
                      { key: "sunblock" as const, title: "3. Sunblock & Kacamata", desc: "Perlindungan saat jelajah pulau & snorkeling." },
                      { key: "medicine" as const, title: "4. Obat Pribadi / Antimo", desc: "Minum 30 menit sebelum kapal berlayar." },
                      { key: "cash" as const, title: "5. Uang Tunai Secukupnya", desc: "Untuk jajan kelapa muda atau kemplang pesisir." },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => toggleCheck(item.key)}
                        className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                          packingChecklist[item.key]
                            ? "bg-sky-50/70 border-sky-200 text-sky-950"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {packingChecklist[item.key] ? (
                          <CheckSquare className="w-4 h-4 text-brand-azure shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-extrabold text-slate-900">{item.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Stacked Cards: Meeting Point & Readiness Gauge */}
                <div className="space-y-4">
                  {/* Card 1: Meeting Point */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">Titik Kumpul</span>
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Standby 06:00 WIB
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-brand-azure shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">Stasiun Tanjung Karang (TKG)</p>
                        <p className="text-[11px] text-slate-400">Penjemputan bus pariwisata AC eksekutif</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Semi-Circular Gauge (Matching Reference Design) */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] text-center space-y-3">
                    <div className="flex items-center justify-between text-left">
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">Kesiapan Berangkat</p>
                        <p className="text-[10px] text-slate-400">Berdasarkan kelengkapan checklist</p>
                      </div>
                      <span className="text-xs font-black text-brand-azure">{readinessPercent}%</span>
                    </div>

                    {/* Semicircular Visual Gauge */}
                    <div className="relative w-36 h-20 mx-auto overflow-hidden">
                      <div className="w-36 h-36 rounded-full border-[14px] border-slate-100 border-t-brand-azure border-r-brand-azure rotate-[-45deg]" />
                      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                        <span className="text-xl font-black text-slate-900 leading-none">{readinessPercent}%</span>
                        <span className="text-[10px] text-slate-400 font-bold">Siap Jalan</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      {readinessPercent === 100
                        ? "Seluruh perlengkapan Anda sudah lengkap!"
                        : "Lengkapi checklist bawaan agar trip akhir pekan Anda sempurna."}
                    </p>
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW: REKOMENDASI TRIP AKHIR PEKAN LAINNYA */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Destinasi Akhir Pekan Lainnya</h3>
                    <p className="text-xs text-slate-400">Pesan langsung tanpa perlu mengisi ulang data identitas</p>
                  </div>
                  <Link href="/#paket" className="text-xs font-extrabold text-brand-azure hover:underline">
                    Lihat Semua Paket →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col justify-between group hover:shadow-lg transition-all"
                    >
                      <div className="relative h-40 w-full">
                        <Image
                          src={pkg.imagePath}
                          alt={pkg.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black text-slate-800">
                          {pkg.category}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-brand-navy/90 text-white px-3 py-1 rounded-full text-xs font-black">
                          {pkg.priceFormatted}
                        </div>
                      </div>

                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{pkg.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-0.5">
                            {pkg.subtitle}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-emerald-600 font-extrabold">Tiap Weekend</span>
                          <Link
                            href={`/booking/schedule?packageId=${pkg.id}`}
                            className="px-3.5 py-1.5 bg-brand-azure hover:bg-sky-600 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all"
                          >
                            Pilih Tanggal
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: TIKET SAYA */}
          {activeTab === "tickets" && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">E-Tiket & Reservasi Perjalanan</h2>
                <p className="text-xs text-slate-400">Seluruh tiket pesanan Anda yang terdaftar di EZ Trip Lampung.</p>
              </div>

              {myBookings.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-3">
                  <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">Belum Ada Tiket</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Anda belum memesan tiket trip weekend. Silakan pilih paket wisata favorit.
                  </p>
                  <button
                    onClick={() => setActiveTab("explore")}
                    className="px-6 py-2.5 bg-brand-azure text-white font-extrabold text-xs rounded-xl shadow-md"
                  >
                    Pesan Tiket Sekarang
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBookings.map((b) => (
                    <div
                      key={b.bookingCode}
                      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-brand-azure bg-sky-50 px-2 py-0.5 rounded-lg">
                            {b.bookingCode}
                          </span>
                          <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                            {b.status}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900">{b.packageName}</h3>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-brand-azure" />
                            {b.scheduleDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bus className="w-3.5 h-3.5 text-brand-azure" />
                            Kursi: {b.outboundSeatNumbers.join(", ")}
                          </span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                        <p className="text-base font-extrabold text-slate-900">
                          Rp {b.totalAmount.toLocaleString("id-ID")}
                        </p>
                        <Link
                          href={`/booking/ticket/${b.bookingCode}`}
                          className="px-4 py-2 bg-brand-azure hover:bg-sky-600 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Buka E-Tiket QR</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: JELAJAH TRIP */}
          {activeTab === "explore" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Jelajahi Paket Wisata 3D2N</h2>
                <p className="text-xs text-slate-400">Pilih open trip weekend dengan jaminan 100% pasti berangkat.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col justify-between"
                  >
                    <div className="relative h-48 w-full">
                      <Image src={pkg.imagePath} alt={pkg.title} fill className="object-cover" />
                      <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-black">
                        {pkg.category}
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900">{pkg.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{pkg.subtitle}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-sm font-extrabold text-brand-azure">{pkg.priceFormatted}</p>
                        <Link
                          href={`/booking/schedule?packageId=${pkg.id}`}
                          className="px-4 py-2 bg-brand-azure text-white text-xs font-extrabold rounded-xl shadow-xs"
                        >
                          Pilih Jadwal
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PUSAT BANTUAN */}
          {activeTab === "support" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Pusat Bantuan & Layanan Tamu</h2>
                <p className="text-xs text-slate-400">Tim kami siap membantu kebutuhan perjalanan Anda.</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">WhatsApp Customer Care 24 Jam</h3>
                    <p className="text-xs text-slate-400">Respon cepat untuk perubahan jadwal atau kendala meeting point</p>
                  </div>
                </div>

                <a
                  href="https://wa.me/6281398765432"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
                >
                  Chat WhatsApp Sekarang (+62 813-9876-5432)
                </a>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] space-y-2">
                <h3 className="font-extrabold text-sm text-slate-900">Kantor Operasional Hub Lampung</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Jl. Raden Intan No. 88, Tanjung Karang Pusat, Kota Bandar Lampung (Dekat Stasiun TKG).
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
