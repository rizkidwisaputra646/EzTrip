"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEzTripStore } from "@/lib/store";
import {
  Compass,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  Info,
  CheckCircle2,
  Ticket,
  CreditCard,
  UserCheck,
} from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useEzTripStore();

  const redirectUrl = searchParams.get("redirect");
  const messageParam = searchParams.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleQuickFill = (role: "traveler" | "leader" | "admin") => {
    if (role === "traveler") {
      setEmail("traveler@eztrip.id");
      setPassword("Wisatawan2026!");
    } else if (role === "leader") {
      setEmail("pemandu@eztrip.id");
      setPassword("PemanduHPI2026!");
    } else {
      setEmail("admin@eztrip.id");
      setPassword("AdminEzTrip2026!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Mohon masukkan email atau nomor WhatsApp akun Anda.");
      return;
    }
    if (!password) {
      setErrorMsg("Mohon masukkan kata sandi akun Anda.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setIsLoading(false);

      if (!result.success || !result.user) {
        setErrorMsg(result.message || "Email atau kata sandi tidak cocok. Silakan periksa kembali.");
        return;
      }

      // STRICT ROLE-BASED REDIRECTION
      if (result.user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (result.user.role === "tour_leader") {
        router.push("/tour-leader/manifest");
      } else {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push("/dashboard");
        }
      }
    }, 450);
  };

  return (
    <div className="min-h-[100dvh] lg:h-screen lg:overflow-hidden bg-[#F8FAFC] flex flex-col lg:flex-row font-sans">
      {/* Left Column: Modern Professional Enterprise Showcase (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F2042] flex-col justify-between p-12 text-white overflow-hidden">
        {/* Subtle Background Landscape */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/beach_pahawang.jpg"
            alt="Pulau Pahawang Lampung"
            fill
            priority
            className="object-cover opacity-25 mix-blend-luminosity hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2042] via-[#0F2042]/80 to-[#0F2042]/50" />
        </div>

        {/* Ambient Brand Glow */}
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-brand-azure/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-20 bottom-0 w-80 h-80 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Logo */}
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 group bg-white rounded-2xl px-4 py-2 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="relative h-9 w-32 flex items-center">
              <Image
                src="/assets/images/logo_eztrip.png"
                alt="EZ Trip - Travel Made Easy"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Middle Value Proposition with Clean Bento Grid */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-sky-300 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Platform Resmi Wisata Akhir Pekan Lampung</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight leading-snug">
              Akses E-Tiket & Manajemen Perjalanan Anda
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Masuk untuk melihat tiket dengan barcode presensi, memilih kursi bus pariwisata, dan memantau pemandu bertugas.
            </p>
          </div>

          {/* Clean Modern Professional Feature Highlights */}
          <div className="space-y-3 pt-1">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-brand-azure/30 flex items-center justify-center shrink-0 text-sky-300">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <p className="font-extrabold text-white text-xs">E-Tiket QR Code Instan</p>
                <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                  Tersimpan aman di akun Anda dan siap di-scan pemandu saat keberangkatan di Stasiun Tanjung Karang.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-extrabold text-white text-xs">Jaminan Pasti Berangkat (3D2N)</p>
                <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                  Keberangkatan akhir pekan terjadwal resmi tanpa pembatalan sepihak dan didampingi tim HPI Lampung.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-300">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="font-extrabold text-white text-xs">Pembayaran Otomatis & Terverifikasi</p>
                <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                  Verifikasi pembayaran QRIS dan Virtual Account Bank seketika tanpa perlu konfirmasi manual.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Verification Note */}
        <div className="relative z-10 pt-4 border-t border-white/10 text-xs text-slate-300 flex items-center justify-between">
          <span className="text-slate-400">&copy; 2026 EZ Trip Operasional Lampung</span>
          <span className="text-sky-300 font-bold">Stasiun Tanjung Karang Hub</span>
        </div>
      </div>

      {/* Right Column: Clean, Focused Login Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex items-center justify-between lg:hidden mb-6">
          <Link href="/" className="flex items-center">
            <div className="relative h-9 w-28">
              <Image
                src="/assets/images/logo_eztrip.png"
                alt="EZ Trip"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
          <Link href="/" className="text-xs font-bold text-brand-azure hover:underline">
            Kembali ke Beranda
          </Link>
        </div>

        {/* Center Container */}
        <div className="w-full max-w-md mx-auto space-y-6 my-auto">
          {/* Header Texts */}
          <div className="space-y-2">
            <div className="hidden lg:block">
              <span className="text-[11px] font-extrabold text-brand-azure uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                Portal Autentikasi
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2042] tracking-tight">
              Masuk ke Akun
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Gunakan email atau nomor WhatsApp yang terdaftar untuk melanjutkan ke portal Anda.
            </p>
          </div>

          {/* Info Banner when redirected */}
          {messageParam === "login_required" && (
            <div className="bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold rounded-2xl p-3.5 flex items-start gap-2.5 animate-in fade-in">
              <Info className="w-4 h-4 text-brand-azure shrink-0 mt-0.5" />
              <span>Silakan masuk atau daftar akun terlebih dahulu untuk melanjutkan pemesanan paket wisata Anda.</span>
            </div>
          )}

          {messageParam === "admin_only" && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-2xl p-3.5 flex items-start gap-2.5 animate-in fade-in">
              <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
              <span>Akses dibatasi. Halaman Dashboard hanya dapat diakses oleh akun Admin Operasional.</span>
            </div>
          )}

          {messageParam === "leader_only" && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl p-3.5 flex items-start gap-2.5 animate-in fade-in">
              <ShieldCheck className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
              <span>Akses dibatasi. Halaman Manifes hanya dapat diakses oleh akun Pemandu Lapangan.</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Email atau Nomor WhatsApp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="traveler@eztrip.id"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-azure/30 focus:border-brand-azure transition-all"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
                <a
                  href="https://wa.me/6281398765432?text=Halo%20Admin%20EZ%20Trip,%20saya%20membutuhkan%20bantuan%20reset%20kata%20sandi."
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-brand-azure hover:underline"
                >
                  Lupa Sandi?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-azure/30 focus:border-brand-azure transition-all"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-azure focus:ring-brand-azure rounded-sm"
                />
                <span className="text-xs text-slate-600 select-none">Ingat saya di perangkat ini</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-brand-azure hover:bg-sky-600 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-brand-azure/25 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {isLoading ? (
                <span>Memverifikasi Akun...</span>
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher - Discrete & Enterprise Minimalist */}
          <div className="pt-2 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Akses Cepat Pengujian:
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("traveler")}
                className="py-2 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-sky-50 hover:border-sky-300 text-slate-700 text-xs font-bold transition-all text-center"
              >
                Wisatawan
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("leader")}
                className="py-2 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 text-xs font-bold transition-all text-center"
              >
                Pemandu
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("admin")}
                className="py-2 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-slate-700 text-xs font-bold transition-all text-center"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Footer switch to register */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Belum memiliki akun wisatawan?{" "}
              <Link
                href={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"}
                className="font-bold text-brand-azure hover:underline"
              >
                Daftar Akun Baru
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom subtle copyright */}
        <div className="text-center text-[11px] text-slate-400 pt-6">
          Sistem autentikasi aman dengan enkripsi standar industri EZ Trip Lampung.
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold text-slate-400">Memuat EZ Trip Login...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
