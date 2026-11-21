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
  User as UserIcon,
  Phone,
  Mail,
  Lock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";
  const { register } = useEzTripStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Bandar Lampung");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Mohon masukkan nama lengkap sesuai identitas KTP.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Mohon masukkan nomor WhatsApp aktif.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Mohon masukkan alamat email yang valid.");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg("Kata sandi minimal 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    if (!agreeTerms) {
      setErrorMsg("Anda harus menyetujui Syarat & Ketentuan untuk melanjutkan.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      register({
        name,
        email,
        phone,
        city: city || "Bandar Lampung",
        role: "traveler",
      });
      setIsLoading(false);
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push("/dashboard");
      }
    }, 600);
  };

  return (
    <div className="min-h-[100dvh] lg:h-screen lg:overflow-hidden bg-slate-50 flex flex-col lg:flex-row">
      {/* Left Column: Visual Editorial Showcase (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-navy flex-col justify-between p-12 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/way_kambas_misty.jpg"
            alt="Way Kambas Lampung"
            fill
            priority
            className="object-cover opacity-35 hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent" />
        </div>

        {/* Top Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group bg-white rounded-2xl px-4 py-2 shadow-xl backdrop-blur-md hover:scale-105 transition-transform">
            <div className="relative h-10 w-32 flex items-center">
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

        {/* Middle Value Proposition */}
        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-sky-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Registrasi Bebas Ribet & Aman
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight font-editorial leading-tight">
            Gabung Komunitas Wisatawan Lampung Weekend Ini
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Daftar sekarang untuk kemudahan reservasi bus pariwisata, pemilihan kursi otomatis, dan akses instan ke penawaran eksklusif trip Pahawang, Kiluan, dan Way Kambas.
          </p>

          <div className="space-y-2 pt-2 text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tanpa biaya pendaftaran & tanpa langganan tersembunyi</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tiket digital tersimpan otomatis di profil dan terhubung WhatsApp</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Didampingi Tour Leader berlisensi resmi HPI Lampung</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 pt-6 border-t border-white/10 text-xs text-slate-300 flex items-center justify-between">
          <span>&copy; 2026 EZ Trip Operasional Lampung</span>
          <span className="text-sky-300 font-semibold">Tanjung Karang Hub</span>
        </div>
      </div>

      {/* Right Column: Clean Registration Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex items-center justify-between lg:hidden mb-6">
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-28">
              <Image
                src="/assets/images/logo_eztrip.png"
                alt="EZ Trip"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
          <Link href="/login" className="text-xs font-bold text-brand-azure hover:underline">
            Sudah Punya Akun?
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto space-y-5 my-auto">
          <div className="space-y-2">
            <div className="relative h-12 w-36">
              <Image
                src="/assets/images/logo_eztrip.png"
                alt="EZ Trip - Travel Made Easy"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Daftar Akun Baru
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Isi data diri untuk memulai reservasi trip akhir pekan Anda.
            </p>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl p-3">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Nama Lengkap */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap (Sesuai KTP)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-azure/30 focus:border-brand-azure"
                />
              </div>
            </div>

            {/* Grid 2 Column: Phone & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nomor WhatsApp</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-azure/30 focus:border-brand-azure"
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kota Domisili</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bandar Lampung / Jakarta"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-azure/30 focus:border-brand-azure"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-azure/30 focus:border-brand-azure"
                />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 karakter"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-azure/30 focus:border-brand-azure"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Ulangi Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi sandi"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-azure/30 focus:border-brand-azure"
                  />
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-brand-azure focus:ring-brand-azure"
                />
                <span className="text-[11px] text-slate-600 leading-tight">
                  Saya menyetujui <span className="text-brand-azure font-semibold">Syarat & Ketentuan Perjalanan</span> serta Kebijakan Privasi EZ Trip.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-brand-azure hover:bg-sky-600 active:scale-[0.99] text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-brand-azure/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>Mendaftarkan Akun...</span>
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Sudah memiliki akun EZ Trip?{" "}
              <Link
                href={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"}
                className="font-bold text-brand-azure hover:underline"
              >
                Masuk di Sini
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-4">
          Data Anda terlindungi dengan enkripsi standar industri perbankan nasional.
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-azure border-t-transparent" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}