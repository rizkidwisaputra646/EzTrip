"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEzTripStore } from "@/lib/store";
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  Wallet,
  FileText,
  Settings,
  Search,
  Bell,
  ChevronRight,
  ChevronDown,
  Bus,
  Calendar,
  Users,
  Armchair,
  Printer,
  MessageSquare,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  UserPlus,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Check,
  X,
  LogOut,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Menu,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    currentUser,
    isInitialized,
    bookings,
    confirmedBookings,
    pendingBookings,
    totalRevenue,
    packages,
    fleets,
    schedules,
    logout,
    toggleSeatLock,
    updateFleetQuota,
    addSchedule,
    deleteSchedule,
    updatePackagePrice,
    rescheduleBooking,
    createManualBooking,
  } = useEzTripStore();

  // Route guard
  useEffect(() => {
    if (!isInitialized) return;
    if (!currentUser || currentUser.role !== "admin") {
      router.replace("/login?message=admin_only");
    }
  }, [currentUser, isInitialized, router]);

  // View state
  const [activeTab, setActiveTab] = useState<"dashboard" | "seats" | "schedules" | "pricing" | "manifest">("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending">("all");
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("Baru saja");
  const [toastMessage, setToastMessage] = useState("");

  // Modals state
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [selectedBookingForReschedule, setSelectedBookingForReschedule] = useState<any>(null);

  // Seat Configurator state
  const [selectedFleetId, setSelectedFleetId] = useState(fleets[0]?.id || "bus_01");

  // Price Editor state
  const [editingPricePkgId, setEditingPricePkgId] = useState<string | null>(null);
  const [tempPriceInput, setTempPriceInput] = useState<number>(0);

  // New Schedule form state
  const [newSchRange, setNewSchRange] = useState("");
  const [newSchLabel, setNewSchLabel] = useState("Weekend Reguler");
  const [newSchSeats, setNewSchSeats] = useState(20);

  // Manual Booking form state
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualKtp, setManualKtp] = useState("");
  const [manualPkgId, setManualPkgId] = useState(packages[0]?.id || "pahawang-kiluan");
  const [manualScheduleDate, setManualScheduleDate] = useState(schedules[0]?.range || "18 - 20 Okt 2026");
  const [manualGuestCount, setManualGuestCount] = useState(1);
  const [manualSeatNumbers, setManualSeatNumbers] = useState("17");
  const [manualPaymentMethod, setManualPaymentMethod] = useState("Tunai di Kantor (Cash)");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSyncMidtrans = () => {
    setIsSyncing(true);
    setToastMessage("");
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
      setToastMessage("Gateway pembayaran tersinkronisasi 100%. Seluruh data transaksi terverifikasi.");
      setTimeout(() => setToastMessage(""), 4000);
    }, 800);
  };

  // Active Fleet for Seat Blocker
  const activeFleet = fleets.find((f) => f.id === selectedFleetId) || fleets[0];

  // Booked seats for current selected fleet
  const activeFleetBookedSeats = bookings
    .filter((b) => b.packageId === activeFleet.packageId && b.status === "Terkonfirmasi")
    .flatMap((b) => b.outboundSeatNumbers);

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "confirmed" && b.status !== "Terkonfirmasi") return false;
    if (statusFilter === "pending" && b.status !== "Menunggu Pembayaran") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.leadGuestName.toLowerCase().includes(q) ||
        b.bookingCode.toLowerCase().includes(q) ||
        b.packageName.toLowerCase().includes(q) ||
        b.leadGuestPhone.includes(q)
      );
    }
    return true;
  });

  const totalConfirmedGuests = confirmedBookings.reduce((sum, b) => sum + b.guestCount, 0);

  // Submit Manual Booking
  const handleSaveManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim()) {
      alert("Nama pemesan dan No WhatsApp wajib diisi!");
      return;
    }

    const res = createManualBooking({
      leadGuestName: manualName,
      leadGuestPhone: manualPhone,
      leadGuestEmail: manualEmail,
      leadGuestIdCard: manualKtp,
      packageId: manualPkgId,
      scheduleDate: manualScheduleDate,
      guestCount: manualGuestCount,
      outboundSeatNumbers: manualSeatNumbers.split(",").map((s) => s.trim().padStart(2, "0")),
      paymentMethod: manualPaymentMethod,
    });

    if (res.success) {
      setToastMessage(res.message);
      setShowManualBookingModal(false);
      setManualName("");
      setManualPhone("");
      setTimeout(() => setToastMessage(""), 5000);
    }
  };

  // Submit Reschedule
  const handleConfirmReschedule = (newDate: string) => {
    if (!selectedBookingForReschedule) return;
    const res = rescheduleBooking(selectedBookingForReschedule.bookingCode, newDate);
    if (res.success) {
      setToastMessage(res.message);
      setShowRescheduleModal(false);
      setSelectedBookingForReschedule(null);
      setTimeout(() => setToastMessage(""), 5000);
    }
  };

  // Submit New Schedule
  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchRange.trim()) return;

    addSchedule({
      range: newSchRange,
      label: newSchLabel,
      status: "Tersedia",
      seatsAvailable: newSchSeats,
      maxSeats: newSchSeats,
    });

    setToastMessage(`Jadwal keberangkatan "${newSchRange}" berhasil ditambahkan.`);
    setShowAddScheduleModal(false);
    setNewSchRange("");
    setTimeout(() => setToastMessage(""), 4000);
  };

  if (!isInitialized || !currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#F4F7FE] flex flex-col items-center justify-center p-8 text-center text-slate-800">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-500">Memverifikasi Hak Akses Administrator...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex text-slate-800 font-sans antialiased">
      {/* 1. MODERN PROFESSIONAL LEFT SIDEBAR / NAVBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6 transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {/* Logo Header */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-9 w-28 flex items-center">
                <Image
                  src="/assets/images/logo_eztrip.png"
                  alt="EZ Trip"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("seats");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "seats"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/50"
              }`}
            >
              <Armchair className="w-4 h-4" />
              <span>Seat Blocker</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("schedules");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "schedules"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/50"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwal & Kuota</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("pricing");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "pricing"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/50"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Harga Paket</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("manifest");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "manifest"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/50"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Manifes & Tiket</span>
            </button>

            <div className="pt-4 border-t border-slate-100 my-2 space-y-1">
              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
              >
                <span className="flex items-center gap-3.5">
                  <ExternalLink className="w-4 h-4" />
                  <span>Preview Web Tamu</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom Floating Card widget (like in reference image) */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/80 p-4 rounded-3xl border border-blue-100/60 text-center space-y-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-800">Sistem Pembayaran Aktif</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Semua sistem pembayaran & armada operasional berjalan normal.
            </p>
          </div>
          <button
            onClick={handleSyncMidtrans}
            disabled={isSyncing}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync Gateway"}</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* 2. RIGHT WORKSPACE AREA */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* TOP HEADER (Modern Pill Search + Profile) */}
        <header className="h-20 px-6 sm:px-10 flex items-center justify-between gap-4 sticky top-0 z-30 bg-[#F4F7FE]/90 backdrop-blur-md">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-600"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search bar with Blue Search Button (Exact Reference Match) */}
          <div className="flex-1 max-w-md hidden sm:flex items-center gap-2 bg-white rounded-full p-1.5 pl-4 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for transaction, customer, booking code..."
              className="flex-1 text-xs bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
            />
            <button
              onClick={() => {
                if (searchQuery) setActiveTab("manifest");
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-full transition-all shadow-md shadow-blue-600/20"
            >
              Search
            </button>
          </div>

          {/* Right Header: Notification, Country/Flag, User Profile */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* Quick Action Button: Input Manual */}
            <button
              onClick={() => setShowManualBookingModal(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-all shadow-sm active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-400" />
              <span>+ Pesanan Manual</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setToastMessage("Tidak ada notifikasi darurat. Sistem operasional lancar.")}
                className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
            </div>

            {/* User Profile Avatar with dropdown look (Exact Reference Match) */}
            <div className="flex items-center gap-2.5 bg-white pl-1.5 pr-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                AD
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-extrabold text-slate-800 leading-tight">Admin Operasional</p>
                <p className="text-[10px] text-slate-400 font-medium">Kantor Pusat Lampung</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>
          </div>
        </header>

        {/* MAIN BODY CANVAS */}
        <main className="p-6 sm:p-10 pt-2 space-y-6 flex-1">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="bg-emerald-500 text-white px-5 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-lg shadow-emerald-500/20 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage("")} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* =========================================================================
              VIEW 1: DASHBOARD OVERVIEW (EXACT REFERENCE MODERN PROFESSIONAL LOOK)
          ========================================================================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* TOP ROW: 4 STATS CARDS (LEFT) + 1 BIG VIBRANT HERO CARD (RIGHT) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2x2 Stats Grid (Col 2 on Desktop) */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: Total Omset */}
                  <div
                    onClick={() => setActiveTab("manifest")}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xl font-extrabold text-slate-900 font-sans">
                          Rp {(totalRevenue / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-xs font-bold text-slate-400 mt-0.5">Total Omset Lunas</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Card 2: Total Wisatawan */}
                  <div
                    onClick={() => setActiveTab("manifest")}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xl font-extrabold text-slate-900 font-sans">
                          {totalConfirmedGuests} Orang
                        </p>
                        <p className="text-xs font-bold text-slate-400 mt-0.5">Tamu Terdaftar</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Card 3: Armada Bus */}
                  <div
                    onClick={() => setActiveTab("seats")}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Bus className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xl font-extrabold text-slate-900 font-sans">
                          {fleets.length} Armada
                        </p>
                        <p className="text-xs font-bold text-slate-400 mt-0.5">Jetbus 3+ & HiAce</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Card 4: Menunggu Bayar */}
                  <div
                    onClick={() => {
                      setStatusFilter("pending");
                      setActiveTab("manifest");
                    }}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xl font-extrabold text-slate-900 font-sans">
                          {pendingBookings.length} Pesanan
                        </p>
                        <p className="text-xs font-bold text-slate-400 mt-0.5">Menunggu Pembayaran</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                {/* Big Vibrant Blue Hero Card (Col 1 on Desktop - Exact Reference Match) */}
                <div className="bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 rounded-3xl p-7 text-white shadow-xl shadow-blue-500/25 flex flex-col justify-between space-y-6 relative overflow-hidden">
                  <div className="space-y-2 relative z-10">
                    <span className="text-[11px] font-black tracking-wider uppercase text-blue-100 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                      Pusat Kendali Weekend Ini
                    </span>
                    <h2 className="text-2xl font-extrabold tracking-tight mt-2">
                      Selamat Bertugas, Tim Operasional!
                    </h2>
                    <p className="text-xs text-blue-100 leading-relaxed font-medium">
                      Semua pemesanan terkonfirmasi otomatis. 3 Bus Pariwisata siap diberangkatkan dari Stasiun Tanjung Karang.
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between pt-2">
                    <div>
                      <p className="text-[11px] text-blue-200 font-bold uppercase">Kas Lunas</p>
                      <p className="text-xl font-black">Rp {totalRevenue.toLocaleString("id-ID")}</p>
                    </div>
                    <button
                      onClick={() => setShowPrintModal(true)}
                      className="px-5 py-2.5 bg-white hover:bg-blue-50 active:scale-95 text-blue-600 text-xs font-extrabold rounded-2xl shadow-md transition-all"
                    >
                      Cetak Surat Jalan
                    </button>
                  </div>

                  <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                </div>
              </div>

              {/* MIDDLE ROW: REVENUE REPORT / BAR CHART VISUAL + STATUS METRICS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Bar Chart Card (Col 2 - Reference Look) */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase">Statistik Operasional</p>
                      <h3 className="text-lg font-extrabold text-slate-900">Performa Reservasi & Keterisian Bus</h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-blue-600" />
                        Kursi Terisi
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-amber-400" />
                        Sisa Kuota
                      </span>
                    </div>
                  </div>

                  {/* 12-Month Simulated Bar Chart (Exact Visual Match with blue & yellow stacked bars) */}
                  <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 border-b border-slate-100 pb-4">
                    {[
                      { month: "Mei", blue: 60, yellow: 25 },
                      { month: "Jun", blue: 85, yellow: 35 },
                      { month: "Jul", blue: 95, yellow: 20 },
                      { month: "Agu", blue: 75, yellow: 40 },
                      { month: "Sep", blue: 80, yellow: 30 },
                      { month: "Okt", blue: 90, yellow: 20 },
                      { month: "Nov", blue: 85, yellow: 35 },
                      { month: "Des", blue: 100, yellow: 15 },
                    ].map((item, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div className="w-full max-w-[28px] flex flex-col items-center rounded-full overflow-hidden bg-slate-100 group-hover:scale-105 transition-transform">
                          <div
                            className="w-full bg-blue-600 rounded-t-full transition-all duration-500"
                            style={{ height: `${item.blue}%` }}
                          />
                          <div
                            className="w-full bg-amber-400 rounded-b-full transition-all duration-500"
                            style={{ height: `${item.yellow}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600">
                          {item.month}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Tingkat keterisian rata-rata: <strong className="text-slate-900 font-extrabold">87.5% per weekend</strong></span>
                    <button
                      onClick={() => setActiveTab("schedules")}
                      className="font-extrabold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>Kelola Slot Jadwal</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Mini Bento Widgets: Keterisian Kuota Donut + Quick Actions */}
                <div className="space-y-6">
                  {/* Gauge Widget (Like Reference Earning This Month with arc) */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4 text-center">
                    <div className="flex items-center justify-between text-left">
                      <div>
                        <p className="text-xs font-bold text-slate-400">Keterisian Kuota Armada</p>
                        <p className="text-xl font-extrabold text-slate-900">49 / 60 Kursi</p>
                      </div>
                      <span className="p-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs">
                        +15% MoM
                      </span>
                    </div>

                    {/* Semi-circle Donut Gauge visual */}
                    <div className="relative w-40 h-20 mx-auto overflow-hidden">
                      <div className="w-40 h-40 rounded-full border-[14px] border-slate-100 border-t-blue-600 border-r-amber-400 transform -rotate-45" />
                      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                        <span className="text-2xl font-black text-slate-900">82%</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Terisi</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Tersisa 11 kursi lagi untuk keberangkatan weekend ini di Stasiun TKG.
                    </p>
                  </div>

                  {/* Actions shortcut */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
                    <p className="text-xs font-extrabold text-slate-800">Aksi Cepat Staf Kantor</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowManualBookingModal(true)}
                        className="w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-2xl text-xs font-bold text-slate-700 flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4 text-blue-600" />
                          <span>Input Tamu Manual / Cash</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <a
                        href="https://wa.me/6281398765432"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-4 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl text-xs font-bold text-slate-700 flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                          <span>Hubungi Kang Dedi (Pemandu)</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW: RECENT BOOKINGS PREVIEW */}
              <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Reservasi Terbaru (Live Update)</h3>
                    <p className="text-xs text-slate-400">Sinkron dengan sistem pembayaran otomatis</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("manifest")}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Lihat Seluruh Manifes</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-100 pb-3">
                        <th className="pb-3">Kode Booking</th>
                        <th className="pb-3">Tamu Utama</th>
                        <th className="pb-3">Paket Wisata</th>
                        <th className="pb-3">Kursi</th>
                        <th className="pb-3">Total Bayar</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.bookingCode} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 font-mono font-extrabold text-blue-600">{b.bookingCode}</td>
                          <td className="py-4">
                            <p className="font-extrabold text-slate-900">{b.leadGuestName}</p>
                            <p className="text-[11px] text-slate-400 font-normal">{b.leadGuestPhone}</p>
                          </td>
                          <td className="py-4 max-w-xs truncate">{b.packageName}</td>
                          <td className="py-4">
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg font-extrabold">
                              {b.outboundSeatNumbers.join(", ")}
                            </span>
                          </td>
                          <td className="py-4 font-extrabold text-slate-900">
                            Rp {b.totalAmount.toLocaleString("id-ID")}
                          </td>
                          <td className="py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                                b.status === "Terkonfirmasi"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedBookingForReschedule(b);
                                setShowRescheduleModal(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white font-extrabold text-slate-700 transition-colors"
                            >
                              Reschedule
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 2: SEAT BLOCKER (REDBUS CABIN CONFIGURATOR)
          ========================================================================= */}
          {activeTab === "seats" && (
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Armchair className="w-5 h-5 text-blue-600" />
                    Manajemen Denah Kursi & Seat Blocker
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Pilih armada bus dan klik nomor kursi untuk mengunci (khusus kru/pemandu) atau membuka kembali untuk publik.
                  </p>
                </div>

                {/* Fleet Switcher */}
                <div className="flex gap-2">
                  {fleets.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFleetId(f.id)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                        selectedFleetId === f.id
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {f.name.split("•")[0].trim()} ({f.plateNumber})
                    </button>
                  ))}
                </div>
              </div>

              {/* Fleet Info Bar */}
              <div className="p-5 bg-slate-50 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Armada Aktif</span>
                    <strong className="text-slate-900 font-extrabold text-sm">{activeFleet.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Driver Bertugas</span>
                    <span className="text-slate-700 font-bold">{activeFleet.driverName} ({activeFleet.driverPhone})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Pemandu Lapangan</span>
                    <span className="text-emerald-600 font-extrabold">{activeFleet.tourLeaderName} (HPI)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-slate-700">Maksimal Kuota:</span>
                  <input
                    type="number"
                    min={10}
                    max={45}
                    value={activeFleet.totalQuota}
                    onChange={(e) => updateFleetQuota(activeFleet.id, parseInt(e.target.value, 10) || 20)}
                    className="w-16 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-center text-sm focus:outline-none focus:border-blue-600"
                  />
                  <span className="text-xs text-slate-400 font-bold">Kursi</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg border-2 border-slate-200 bg-white" />
                  <span>Tersedia untuk Publik</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-emerald-500 text-white text-[10px] flex items-center justify-center">
                    ✓
                  </div>
                  <span>Terisi Tamu (Lunas)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-slate-900 text-amber-400 text-[9px] flex items-center justify-center font-black">
                    KRU
                  </div>
                  <span className="text-slate-900">Dikunci untuk Kru / Admin</span>
                </div>
              </div>

              {/* Interactive Bus Visual (2-2 RedBus Style) */}
              <div className="max-w-md mx-auto bg-slate-50 p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-slate-200 text-xs font-extrabold uppercase text-slate-400">
                  <span>Pintu Masuk Penumpang</span>
                  <span>Sopir: {activeFleet.driverName} 🛞</span>
                </div>

                <div className="space-y-3.5">
                  {[1, 2, 3, 4, 5].map((row) => {
                    const left1 = String((row - 1) * 4 + 1).padStart(2, "0");
                    const left2 = String((row - 1) * 4 + 2).padStart(2, "0");
                    const right1 = String((row - 1) * 4 + 3).padStart(2, "0");
                    const right2 = String((row - 1) * 4 + 4).padStart(2, "0");

                    const renderAdminSeat = (num: string) => {
                      const isLocked = activeFleet.lockedSeats.includes(num);
                      const isBooked = activeFleetBookedSeats.includes(num);

                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => toggleSeatLock(activeFleet.id, num)}
                          className={`w-12 h-12 rounded-2xl text-xs font-extrabold flex flex-col items-center justify-center transition-all ${
                            isLocked
                              ? "bg-slate-900 text-amber-400 shadow-md shadow-slate-900/20"
                              : isBooked
                              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                              : "bg-white text-slate-800 hover:border-blue-600 border border-slate-200 hover:bg-blue-50/50 shadow-sm"
                          }`}
                          title={`Kursi ${num}: ${isLocked ? "Terkunci untuk Kru" : isBooked ? "Terisi Tamu" : "Tersedia"}`}
                        >
                          <Armchair className="w-4 h-4 mb-0.5" />
                          <span className="text-[10px]">{isLocked ? "KRU" : num}</span>
                        </button>
                      );
                    };

                    return (
                      <div key={row} className="flex items-center justify-between">
                        <div className="flex gap-2.5">
                          {renderAdminSeat(left1)}
                          {renderAdminSeat(left2)}
                        </div>
                        <span className="text-[11px] font-black text-slate-300">R{row}</span>
                        <div className="flex gap-2.5">
                          {renderAdminSeat(right1)}
                          {renderAdminSeat(right2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] font-extrabold text-slate-400 text-center pt-3 border-t-2 border-dashed border-slate-200 uppercase">
                  Kabin Belakang • Jetbus 3+ Royal Class
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 3: JADWAL & KUOTA (TRAVELOKA DEPARTURE SLOTS)
          ========================================================================= */}
          {activeTab === "schedules" && (
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    Manajemen Slot Jadwal Keberangkatan
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Tambah tanggal weekend baru. Jadwal akan otomatis langsung muncul pada form pemesanan tamu publik.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddScheduleModal(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Jadwal Weekend</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-100 pb-3">
                      <th className="pb-3">Rentang Tanggal (Weekend 3D2N)</th>
                      <th className="pb-3">Label Jadwal</th>
                      <th className="pb-3">Ketersediaan Kursi</th>
                      <th className="pb-3">Status Publik</th>
                      <th className="pb-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                    {schedules.map((sch) => (
                      <tr key={sch.id} className="hover:bg-slate-50/60">
                        <td className="py-4 font-extrabold text-slate-900 text-sm">{sch.range}</td>
                        <td className="py-4 text-slate-500 font-medium">{sch.label}</td>
                        <td className="py-4 text-emerald-600 font-extrabold">
                          {sch.seatsAvailable} / {sch.maxSeats} Kursi Siap
                        </td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600">
                            {sch.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => deleteSchedule(sch.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                            title="Hapus jadwal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 4: HARGA PAKET (DYNAMIC PRICING)
          ========================================================================= */}
          {activeTab === "pricing" && (
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  Pengaturan Tarif Paket Wisata
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Sesuaikan tarif dasar all-inclusive untuk musim liburan atau promo reguler.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg) => {
                  const isEditing = editingPricePkgId === pkg.id;

                  return (
                    <div
                      key={pkg.id}
                      className="bg-slate-50/70 p-6 rounded-3xl border border-slate-100 space-y-4 hover:shadow-md transition-shadow"
                    >
                      <div>
                        <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                          {pkg.category}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 mt-1">{pkg.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{pkg.subtitle}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase">Tarif Per Wisatawan</span>
                        {isEditing ? (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-extrabold text-slate-600">Rp</span>
                            <input
                              type="number"
                              step={10000}
                              value={tempPriceInput}
                              onChange={(e) => setTempPriceInput(parseInt(e.target.value, 10) || 0)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-extrabold text-sm focus:outline-none focus:border-blue-600"
                            />
                          </div>
                        ) : (
                          <p className="text-2xl font-black text-slate-900 mt-1">
                            {pkg.priceFormatted}
                            <span className="text-xs font-normal text-slate-400 ml-1">/org</span>
                          </p>
                        )}
                      </div>

                      <div>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                updatePackagePrice(pkg.id, tempPriceInput);
                                setEditingPricePkgId(null);
                                setToastMessage(`Harga paket ${pkg.title} berhasil diperbarui.`);
                                setTimeout(() => setToastMessage(""), 4000);
                              }}
                              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all"
                            >
                              Simpan
                            </button>
                            <button
                              onClick={() => setEditingPricePkgId(null)}
                              className="px-4 py-2.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingPricePkgId(pkg.id);
                              setTempPriceInput(pkg.price);
                            }}
                            className="w-full py-2.5 bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 text-slate-700 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Ubah Tarif Paket</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 5: MANIFES PENUMPANG LENGKAP & RESCHEDULE
          ========================================================================= */}
          {activeTab === "manifest" && (
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Manifes Penumpang & Reschedule Jadwal
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Cari data tamu, hubungi via WhatsApp, atau ubah jadwal keberangkatan secara instan.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                      statusFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    Semua ({bookings.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter("confirmed")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                      statusFilter === "confirmed" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    Lunas ({confirmedBookings.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter("pending")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                      statusFilter === "pending" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    Pending ({pendingBookings.length})
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-100 pb-3">
                      <th className="pb-3">Kode Booking</th>
                      <th className="pb-3">Tamu Utama</th>
                      <th className="pb-3">Paket & Jadwal</th>
                      <th className="pb-3">Kursi</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {filteredBookings.map((b) => (
                      <tr key={b.bookingCode} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 font-mono font-extrabold text-blue-600">{b.bookingCode}</td>
                        <td className="py-4">
                          <p className="font-extrabold text-slate-900">{b.leadGuestName}</p>
                          <p className="text-[11px] text-slate-400 font-normal">{b.leadGuestPhone}</p>
                        </td>
                        <td className="py-4 max-w-xs">
                          <p className="truncate font-bold text-slate-800">{b.packageName}</p>
                          <p className="text-[10px] text-slate-400">{b.scheduleDate}</p>
                        </td>
                        <td className="py-4">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg font-extrabold">
                            {b.outboundSeatNumbers.join(", ")}
                          </span>
                        </td>
                        <td className="py-4 font-extrabold text-slate-900">
                          Rp {b.totalAmount.toLocaleString("id-ID")}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                              b.status === "Terkonfirmasi"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedBookingForReschedule(b);
                              setShowRescheduleModal(true);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all"
                          >
                            Reschedule
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          MODALS: MANUAL BOOKING, RESCHEDULE, PRINT, ADD SCHEDULE
      ========================================================================= */}
      {showManualBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Input Tamu Manual (Kantor)</h3>
                <p className="text-xs text-slate-400">Pemesanan offline, walk-in, atau pembayaran tunai</p>
              </div>
              <button onClick={() => setShowManualBookingModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualBooking} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-slate-700 block mb-1">Nama Lengkap (KTP) *</label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Contoh: Hendra Kurniawan"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">No. WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="0812-XXXX-XXXX"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Paket Wisata</label>
                  <select
                    value={manualPkgId}
                    onChange={(e) => setManualPkgId(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none bg-white font-medium"
                  >
                    {packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Jadwal Keberangkatan</label>
                  <select
                    value={manualScheduleDate}
                    onChange={(e) => setManualScheduleDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none bg-white font-medium"
                  >
                    {schedules.map((s) => (
                      <option key={s.id} value={s.range}>
                        {s.range}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Nomor Kursi Bus</label>
                  <input
                    type="text"
                    value={manualSeatNumbers}
                    onChange={(e) => setManualSeatNumbers(e.target.value)}
                    placeholder="Contoh: 17 atau 17, 18"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowManualBookingModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-extrabold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-md shadow-blue-600/25"
                >
                  Terbitkan Tiket Sah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedBookingForReschedule && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Reschedule Tanggal Trip</h3>
                <p className="text-xs text-slate-400">
                  {selectedBookingForReschedule.bookingCode} &bull; {selectedBookingForReschedule.leadGuestName}
                </p>
              </div>
              <button onClick={() => setShowRescheduleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-1">
              <p className="text-slate-400 font-extrabold uppercase">Jadwal Lama Saat Ini:</p>
              <p className="text-sm font-extrabold text-slate-900">{selectedBookingForReschedule.scheduleDate}</p>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              <label className="text-slate-700 block">Pilih Jadwal Weekend Pengganti:</label>
              <div className="space-y-2">
                {schedules.map((sch) => {
                  const isCurrent = sch.range === selectedBookingForReschedule.scheduleDate;
                  return (
                    <button
                      key={sch.id}
                      disabled={isCurrent}
                      onClick={() => handleConfirmReschedule(sch.range)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isCurrent
                          ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-400 text-slate-900"
                      }`}
                    >
                      <span className="font-extrabold">{sch.range}</span>
                      <span className="text-xs text-blue-600 font-extrabold">
                        {isCurrent ? "Jadwal Saat Ini" : "Pilih Ini →"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Schedule Modal */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-7 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900">Tambah Jadwal Baru</h3>
              <button onClick={() => setShowAddScheduleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-slate-700 block mb-1">Rentang Tanggal (Weekend) *</label>
                <input
                  type="text"
                  required
                  value={newSchRange}
                  onChange={(e) => setNewSchRange(e.target.value)}
                  placeholder="Contoh: 15 - 17 Nov 2026"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Label Jadwal</label>
                <input
                  type="text"
                  value={newSchLabel}
                  onChange={(e) => setNewSchLabel(e.target.value)}
                  placeholder="Contoh: Weekend Pertengahan Bulan"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddScheduleModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-extrabold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-md shadow-blue-600/25"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Surat Jalan Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Surat Jalan Bus Resmi</h3>
                <p className="text-xs text-slate-400">DOC: SJ-EZTRIP/2026/10/018</p>
              </div>
              <button onClick={() => setShowPrintModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Tujuan Trip</span>
                  <strong className="text-slate-900">Pahawang & Kiluan (3D2N)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Armada & Nopol</span>
                  <strong className="text-slate-900">Jetbus 3+ BE 7123 BU</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Driver</span>
                  <span className="text-slate-700 font-bold">Pak Yanto</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Tour Leader</span>
                  <span className="text-emerald-600 font-extrabold">Kang Dedi (HPI)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-extrabold text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-600/25"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
