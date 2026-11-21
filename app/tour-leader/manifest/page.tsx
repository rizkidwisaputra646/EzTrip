"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEzTripStore } from "@/lib/store";
import {
  UserCheck,
  CheckCircle2,
  Clock,
  Search,
  MessageCircle,
  PhoneCall,
  MapPin,
  Users,
  Compass,
  Bus,
  QrCode,
  ShieldCheck,
  CheckSquare,
  Square,
  Send,
  X,
  ExternalLink,
  LogOut,
  Camera,
  CameraOff,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  FileCheck,
  ChevronRight,
  ChevronDown,
  Bell,
  Menu,
} from "lucide-react";

export default function TourLeaderManifestPage() {
  const router = useRouter();
  const {
    currentUser,
    isInitialized,
    confirmedBookings,
    toggleCheckIn,
    logout,
  } = useEzTripStore();

  // Route guard
  useEffect(() => {
    if (!isInitialized) return;
    if (!currentUser || currentUser.role !== "tour_leader") {
      router.replace("/login?message=leader_only");
    }
  }, [currentUser, isInitialized, router]);

  const [activeTab, setActiveTab] = useState<"manifest" | "scanner" | "sop" | "contacts">("manifest");
  const [filterPresence, setFilterPresence] = useState<"all" | "pending" | "checked_in">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Scanner state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [scanSuccessData, setScanSuccessData] = useState<{ code: string; name: string; seats: string[] } | null>(null);
  const [manualCode, setManualCode] = useState("");
  const html5QrCodeRef = useRef<any>(null);

  // Field Safety Checklist
  const [safetyChecklist, setSafetyChecklist] = useState({
    briefing: true,
    lifeJacket: false,
    snorkel: false,
    homestay: false,
    boatCoord: false,
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const checkedInCount = confirmedBookings.filter((b) => b.isCheckedIn).length;
  const pendingCount = confirmedBookings.length - checkedInCount;

  const filtered = confirmedBookings.filter((b) => {
    if (filterPresence === "pending" && b.isCheckedIn) return false;
    if (filterPresence === "checked_in" && !b.isCheckedIn) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.leadGuestName.toLowerCase().includes(q) ||
        b.bookingCode.toLowerCase().includes(q) ||
        b.meetingPoint.toLowerCase().includes(q) ||
        b.leadGuestPhone.includes(q)
      );
    }
    return true;
  });

  const handleToggle = (bookingCode: string, guestName: string, currentlyChecked: boolean) => {
    toggleCheckIn(bookingCode);
    setFeedback(
      currentlyChecked
        ? `Status presensi ${guestName} dibatalkan.`
        : `Presensi ${guestName} BERHASIL dikonfirmasi hadir! ✓`
    );
    setTimeout(() => setFeedback(""), 3500);
  };

  const verifyAndCheckInCode = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) return;

    const found = confirmedBookings.find(
      (b) => b.bookingCode.toUpperCase() === code || b.bookingCode.includes(code)
    );

    if (found) {
      if (!found.isCheckedIn) {
        toggleCheckIn(found.bookingCode);
      }
      setScanSuccessData({
        code: found.bookingCode,
        name: found.leadGuestName,
        seats: found.outboundSeatNumbers,
      });
      setFeedback(`Tiket ${found.bookingCode} valid! ${found.leadGuestName} telah check-in.`);
      setTimeout(() => setFeedback(""), 4000);
    } else {
      setCameraError(`Kode "${rawCode}" tidak terdaftar pada manifes trip ini.`);
      setTimeout(() => setCameraError(""), 4000);
    }
  };

  // Real Camera Scanner using html5-qrcode
  const startCameraScanner = async () => {
    setCameraError("");
    setScanSuccessData(null);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");

      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (_) {}
      }

      const qrScanner = new Html5Qrcode("reader-container");
      html5QrCodeRef.current = qrScanner;

      await qrScanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
        },
        (decodedText) => {
          verifyAndCheckInCode(decodedText);
          try {
            qrScanner.pause(true);
            setTimeout(() => {
              try {
                qrScanner.resume();
              } catch (_) {}
            }, 3000);
          } catch (_) {}
        },
        () => {}
      );

      setIsCameraActive(true);
    } catch (err: any) {
      console.error("Camera access error:", err);
      setIsCameraActive(false);
      setCameraError(
        err?.message || "Tidak dapat mengakses kamera. Pastikan izin kamera aktif pada browser Anda."
      );
    }
  };

  const stopCameraScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (_) {}
      html5QrCodeRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try {
          html5QrCodeRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  const toggleSafetyItem = (key: keyof typeof safetyChecklist) => {
    setSafetyChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isInitialized || !currentUser || currentUser.role !== "tour_leader") {
    return (
      <div className="min-h-screen bg-[#F4F7FE] flex flex-col items-center justify-center p-8 text-center text-slate-800">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-500">Memverifikasi Hak Akses Pemandu Lapangan...</p>
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
                setActiveTab("manifest");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "manifest"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Manifes Tamu</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("scanner");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "scanner"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50"
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Scan QR Kamera</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("sop");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "sop"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>SOP Keselamatan</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("contacts");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "contacts"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50"
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Kontak Kru & Driver</span>
            </button>

            <div className="pt-4 border-t border-slate-100 my-2 space-y-1">
              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-colors"
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

        {/* Bottom Floating Status Widget */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/80 p-4 rounded-3xl border border-emerald-100/60 text-center space-y-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-800">Live Weekend Trip</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Pahawang & Kiluan (3D2N) • Stasiun TKG & Dermaga Ketapang
            </p>
          </div>
          <a
            href={`https://wa.me/6281198765432?text=${encodeURIComponent(
              `Halo Admin Operasional EZ Trip, laporan kesiapan dari Kang Dedi (Tour Leader):\n- Trip: Beach Escape Pahawang & Kiluan\n- Kehadiran: ${checkedInCount}/${confirmedBookings.length} Tamu Sudah Hadir\n- Armada: Jetbus 3+ BE 7123 BU siap berangkat.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Lapor ke Admin</span>
          </a>
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
        {/* TOP HEADER */}
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
              placeholder="Cari nama tamu, booking code, atau no WA..."
              className="flex-1 text-xs bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
            />
            <button
              onClick={() => {
                if (searchQuery) setActiveTab("manifest");
              }}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-full transition-all shadow-md shadow-emerald-600/20"
            >
              Search
            </button>
          </div>

          {/* Right Header */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* Quick Action: Open Camera Scanner */}
            <button
              onClick={() => setActiveTab("scanner")}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR E-Tiket</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setFeedback("Standby di meeting point Stasiun Tanjung Karang (06:00 WIB).")}
              className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2.5 bg-white pl-1.5 pr-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                KD
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-extrabold text-slate-800 leading-tight">Kang Dedi</p>
                <p className="text-[10px] text-slate-400 font-medium">Tour Leader HPI</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>
          </div>
        </header>

        {/* MAIN BODY CANVAS */}
        <main className="p-6 sm:p-10 pt-2 space-y-6 flex-1">
          {/* Dynamic Feedback Toast */}
          {feedback && (
            <div className="bg-emerald-500 text-white px-5 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-lg shadow-emerald-500/20 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                <span>{feedback}</span>
              </div>
              <button onClick={() => setFeedback("")} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TOP ROW: 4 STATS CARDS (LEFT) + 1 VIBRANT EMERALD HERO CARD (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 4 Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  setFilterPresence("all");
                  setActiveTab("manifest");
                }}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-slate-900 font-sans">
                      {confirmedBookings.length} Tamu
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">Total Terdaftar</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>

              <div
                onClick={() => {
                  setFilterPresence("checked_in");
                  setActiveTab("manifest");
                }}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-slate-900 font-sans">
                      {checkedInCount} Tamu
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">Sudah Hadir ✓</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>

              <div
                onClick={() => {
                  setFilterPresence("pending");
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
                      {pendingCount} Tamu
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">Belum Tiba</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </div>

              <div
                onClick={() => setActiveTab("contacts")}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Bus className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-slate-900 font-sans">
                      BE 7123 BU
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">Jetbus 3+ (Pak Yanto)</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            {/* Big Vibrant Emerald Hero Card (Matching Reference Layout) */}
            <div className="bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-700 rounded-3xl p-7 text-white shadow-xl shadow-emerald-600/25 flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="space-y-2 relative z-10">
                <span className="text-[11px] font-black tracking-wider uppercase text-emerald-100 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                  Pemandu HPI Bertugas
                </span>
                <h2 className="text-2xl font-extrabold tracking-tight mt-2">
                  Selamat Bertugas, Kang Dedi!
                </h2>
                <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                  Trip: Pahawang & Kiluan (3D2N). Pintu bus ditutup pukul 06:30 WIB di Stasiun Tanjung Karang.
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between pt-2">
                <div>
                  <p className="text-[11px] text-emerald-200 font-bold uppercase">Progres Presensi</p>
                  <p className="text-xl font-black">
                    {checkedInCount} / {confirmedBookings.length} Tamu ({confirmedBookings.length > 0 ? Math.round((checkedInCount / confirmedBookings.length) * 100) : 0}%)
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("scanner")}
                  className="px-5 py-2.5 bg-white hover:bg-emerald-50 active:scale-95 text-emerald-700 text-xs font-extrabold rounded-2xl shadow-md transition-all"
                >
                  Buka Scanner QR
                </button>
              </div>

              <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>

          {/* =========================================================================
              TAB CONTENT: 1. MANIFES TAMU LIST
          ========================================================================= */}
          {activeTab === "manifest" && (
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    Manifes Tamu Weekend Ini
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Klik tombol centang untuk konfirmasi hadir, atau gunakan tombol WhatsApp untuk memanggil tamu yang belum tiba.
                  </p>
                </div>

                {/* Filter presence tabs */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilterPresence("all")}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                      filterPresence === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    Semua ({confirmedBookings.length})
                  </button>
                  <button
                    onClick={() => setFilterPresence("pending")}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                      filterPresence === "pending" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    Belum Tiba ({pendingCount})
                  </button>
                  <button
                    onClick={() => setFilterPresence("checked_in")}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                      filterPresence === "checked_in" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    Sudah Hadir ({checkedInCount})
                  </button>
                </div>
              </div>

              {/* Guest Cards */}
              <div className="space-y-3.5">
                {filtered.map((b) => (
                  <div
                    key={b.bookingCode}
                    className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      b.isCheckedIn
                        ? "bg-emerald-50/40 border-emerald-200"
                        : "bg-white border-slate-100 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Big Checkbox */}
                      <button
                        onClick={() => handleToggle(b.bookingCode, b.leadGuestName, b.isCheckedIn)}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                          b.isCheckedIn
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        }`}
                        title={b.isCheckedIn ? "Batalkan presensi" : "Tandai sudah hadir"}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-base font-extrabold ${b.isCheckedIn ? "line-through text-slate-400" : "text-slate-900"}`}>
                            {b.leadGuestName}
                          </span>
                          <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                            {b.bookingCode}
                          </span>
                          <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg">
                            Kursi: {b.outboundSeatNumbers.join(", ")}
                          </span>
                          {b.isCheckedIn ? (
                            <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                              Hadir ✓
                            </span>
                          ) : (
                            <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                              Belum Tiba
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 font-medium">
                          {b.guestCount} Wisatawan {b.guest2Name ? `(+${b.guest2Name})` : ""} • MP: <strong className="text-slate-800">{b.meetingPoint}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Actions: WA + Toggle */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <a
                        href={`https://wa.me/62${b.leadGuestPhone.replace(/\D/g, "").replace(/^0/, "")}?text=${encodeURIComponent(
                          `Halo Kak ${b.leadGuestName}, saya Kang Dedi (Tour Leader EZ Trip). Menginfokan bus Pahawang di ${b.meetingPoint.split("—")[0]} siap berangkat pukul 06:30 WIB. Apakah posisi Kakak sudah dekat?`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>WA Tamu</span>
                      </a>

                      <button
                        onClick={() => handleToggle(b.bookingCode, b.leadGuestName, b.isCheckedIn)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all shadow-sm ${
                          b.isCheckedIn
                            ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                        }`}
                      >
                        {b.isCheckedIn ? "Batalkan" : "Tandai Hadir"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB CONTENT: 2. REAL CAMERA QR SCANNER
          ========================================================================= */}
          {activeTab === "scanner" && (
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    Live Camera QR Scanner E-Tiket
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Arahkan kamera ke QR Code E-Tiket pada smartphone wisatawan untuk check-in instan.
                  </p>
                </div>

                <div>
                  {!isCameraActive ? (
                    <button
                      onClick={startCameraScanner}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Aktifkan Kamera</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopCameraScanner}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-95"
                    >
                      <CameraOff className="w-4 h-4" />
                      <span>Stop Kamera</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Camera Viewfinder */}
              <div className="max-w-md mx-auto bg-slate-950 rounded-3xl overflow-hidden min-h-[260px] flex flex-col items-center justify-center border-4 border-slate-100 shadow-xl">
                <div id="reader-container" className={`w-full ${isCameraActive ? "block" : "hidden"}`} />

                {!isCameraActive && (
                  <div className="text-center p-8 space-y-3">
                    <div className="w-14 h-14 rounded-3xl bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                      <QrCode className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-extrabold text-white">Kamera Scanner Non-Aktif</p>
                    <p className="text-xs text-slate-400 max-w-xs font-medium">
                      Klik &quot;Aktifkan Kamera&quot; untuk scan langsung QR tiket di HP tamu.
                    </p>
                  </div>
                )}
              </div>

              {/* Feedback Alert */}
              {cameraError && (
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              {scanSuccessData && (
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold space-y-1">
                  <p className="text-sm font-black text-emerald-700">✓ TIKET VALID: {scanSuccessData.name}</p>
                  <p className="text-slate-600 font-medium">Kode: {scanSuccessData.code} &bull; Kursi: {scanSuccessData.seats.join(", ")}</p>
                </div>
              )}

              {/* Fallback Manual Code Input */}
              <div className="max-w-md mx-auto pt-2 space-y-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    verifyAndCheckInCode(manualCode);
                    setManualCode("");
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Atau ketik booking code (e.g. EZTRIP-179508-001)..."
                    className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-extrabold shadow-md"
                  >
                    Check-in
                  </button>
                </form>

                {/* Sample Test Pills */}
                <div className="flex items-center gap-2 text-xs text-slate-400 overflow-x-auto">
                  <span className="shrink-0 font-bold">Sample test:</span>
                  {confirmedBookings.map((b) => (
                    <button
                      key={b.bookingCode}
                      onClick={() => verifyAndCheckInCode(b.bookingCode)}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] shrink-0"
                    >
                      {b.bookingCode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB CONTENT: 3. SOP KESELAMATAN HPI
          ========================================================================= */}
          {activeTab === "sop" && (
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  SOP Keselamatan & Logistik Lapangan (HPI Lampung)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Checklist wajib yang harus diselesaikan oleh Kang Dedi sebelum bus dan perahu motor berangkat.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { key: "briefing" as const, title: "1. Briefing Keselamatan Laut & Konservasi", desc: "Penjelasan batas aman snorkeling, larangan injak karang, dan SOP jika mabuk laut." },
                  { key: "lifeJacket" as const, title: "2. Fitting Life Jacket (Pelampung) Tamu", desc: "Memastikan semua tamu memakai pelampung sesuai ukuran badan sebelum menaiki perahu di Ketapang." },
                  { key: "snorkel" as const, title: "3. Masker Snorkel & Fin Steril", desc: "Pemeriksaan alat selam permukaan telah disanitasi & pas dengan ukuran kaki tamu." },
                  { key: "homestay" as const, title: "4. Kunci Homestay Apung Pahawang", desc: "Konfirmasi kamar apung bersih, air tawar mengalir normal, dan kasur siap pakai." },
                  { key: "boatCoord" as const, title: "5. Handover Nahkoda Kapal Motor", desc: "Koordinasi dengan Babeh Imron terkait kondisi cuaca BMKG dan mesin cadangan." },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => toggleSafetyItem(item.key)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                      safetyChecklist[item.key]
                        ? "bg-emerald-50/50 border-emerald-300 text-emerald-950"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {safetyChecklist[item.key] ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-extrabold text-sm">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB CONTENT: 4. KONTAK KRU LAPANGAN
          ========================================================================= */}
          {activeTab === "contacts" && (
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-emerald-600" />
                  Kontak Cepat Kru Lapangan & Driver
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Hubungi langsung rekan operasional jika terjadi kendala armada atau penyeberangan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-slate-900">Pak Yanto (Driver)</p>
                    <p className="text-xs text-slate-400 font-medium">Jetbus 3+ BE 7123 BU</p>
                    <p className="text-xs font-bold text-blue-600 mt-1">0812-7788-9900</p>
                  </div>
                  <a
                    href="tel:081277889900"
                    className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm hover:bg-blue-50 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-slate-900">Babeh Imron (Nahkoda)</p>
                    <p className="text-xs text-slate-400 font-medium">Kapal Motor Ketapang</p>
                    <p className="text-xs font-bold text-emerald-600 mt-1">0813-1122-3344</p>
                  </div>
                  <a
                    href="tel:081311223344"
                    className="p-3 bg-white rounded-2xl text-emerald-600 shadow-sm hover:bg-emerald-50 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-slate-900">Ibu Siti (Homestay)</p>
                    <p className="text-xs text-slate-400 font-medium">Homestay Apung Pahawang</p>
                    <p className="text-xs font-bold text-amber-600 mt-1">0812-9988-7766</p>
                  </div>
                  <a
                    href="tel:081299887766"
                    className="p-3 bg-white rounded-2xl text-amber-600 shadow-sm hover:bg-amber-50 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
