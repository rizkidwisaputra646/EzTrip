"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEzTripStore } from "@/lib/store";
import {
  ShieldCheck,
  UserCheck,
  Menu,
  X,
  Ticket,
  ChevronDown,
  LogIn,
  UserPlus,
  LogOut,
  Eye,
  FileCheck2,
  Compass,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { currentUser, isLoggedIn, logout } = useEzTripStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push("/login");
  };

  const role = currentUser?.role;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo (Adaptive per Role) */}
        <Link
          href={role === "admin" ? "/admin/dashboard" : role === "tour_leader" ? "/tour-leader/manifest" : "/"}
          className="flex items-center gap-2 group py-1"
        >
          <div className="relative h-11 w-28 sm:w-32 flex items-center">
            <Image
              src="/assets/images/logo_eztrip.png"
              alt="EZ Trip - Travel Made Easy"
              fill
              className="object-contain object-left group-hover:scale-105 transition-transform"
              priority
            />
          </div>
          {role && role !== "traveler" && (
            <span
              className={`hidden sm:inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                role === "admin"
                  ? "bg-amber-50 text-brand-orange border-amber-200"
                  : "bg-green-50 text-brand-green border-green-200"
              }`}
            >
              {role === "admin" ? "Admin" : "Pemandu"}
            </span>
          )}
        </Link>

        {/* Center: Desktop Navigation (Strictly Tailored to Role) */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
          {/* 1. ADMIN EXCLUSIVE NAVIGATION */}
          {role === "admin" && (
            <>
              <Link
                href="/admin/dashboard"
                className="px-3.5 py-2 rounded-full text-brand-navy font-bold bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-azure" />
                Dashboard Utama
              </Link>
              <Link
                href="/admin/dashboard"
                className="px-3.5 py-2 rounded-full text-slate-700 hover:text-brand-azure hover:bg-slate-50 transition-colors"
              >
                Omset & Transaksi
              </Link>
              <Link
                href="/admin/dashboard"
                className="px-3.5 py-2 rounded-full text-slate-700 hover:text-brand-azure hover:bg-slate-50 transition-colors"
              >
                Manifes & Kuota Bus
              </Link>
              <Link
                href="/?preview=true"
                className="px-3.5 py-2 rounded-full text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 transition-colors flex items-center gap-1"
                title="Lihat tampilan website seperti yang dilihat tamu"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview Website Tamu
              </Link>
            </>
          )}

          {/* 2. TOUR LEADER EXCLUSIVE NAVIGATION */}
          {role === "tour_leader" && (
            <>
              <Link
                href="/tour-leader/manifest"
                className="px-3.5 py-2 rounded-full text-brand-green font-bold bg-green-50 hover:bg-green-100 transition-colors flex items-center gap-1.5"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-brand-green" />
                Manifes Tamu Weekend
              </Link>
              <Link
                href="/tour-leader/manifest"
                className="px-3.5 py-2 rounded-full text-slate-700 hover:text-brand-green hover:bg-slate-50 transition-colors"
              >
                Presensi Meeting Point
              </Link>
              <Link
                href="/tour-leader/manifest"
                className="px-3.5 py-2 rounded-full text-slate-700 hover:text-brand-green hover:bg-slate-50 transition-colors"
              >
                Kontak Kru & Armada
              </Link>
              <Link
                href="/?preview=true"
                className="px-3.5 py-2 rounded-full text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                title="Lihat tampilan website seperti yang dilihat tamu"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview Website Tamu
              </Link>
            </>
          )}

          {/* 3. TRAVELER / ALL USER NAVIGATION (LANDING & EXPLORE) */}
          {(!role || role === "traveler") && (
            <>
              <Link
                href="/"
                className="px-3.5 py-2 rounded-full text-slate-700 hover:text-brand-azure hover:bg-slate-50 transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="/#paket"
                className="px-3.5 py-2 rounded-full text-slate-700 hover:text-brand-azure hover:bg-slate-50 transition-colors"
              >
                Paket Wisata
              </Link>
              <Link
                href="/#fasilitas"
                className="px-3.5 py-2 rounded-full text-slate-700 hover:text-brand-azure hover:bg-slate-50 transition-colors"
              >
                Fasilitas All-In
              </Link>
              <Link
                href="/#testimoni"
                className="px-3.5 py-2 rounded-full text-slate-700 hover:text-brand-azure hover:bg-slate-50 transition-colors"
              >
                Testimoni
              </Link>
              <Link
                href="/#faq"
                className="px-3.5 py-2 rounded-full text-slate-700 hover:text-brand-azure hover:bg-slate-50 transition-colors"
              >
                FAQ
              </Link>

              {isLoggedIn && (
                <>
                  <Link
                    href="/dashboard"
                    className="px-3.5 py-2 rounded-full text-brand-azure font-extrabold bg-sky-50 hover:bg-sky-100 transition-colors flex items-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5 text-brand-azure" />
                    Dashboard Saya
                  </Link>
                  <Link
                    href="/my-tickets"
                    className="px-3 py-2 rounded-full text-slate-700 hover:text-brand-azure hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Ticket className="w-3.5 h-3.5 text-slate-400" />
                    E-Tiket
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* Right: User Profile / Auth Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {isLoggedIn && currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 border-l border-slate-200 text-left hover:opacity-85 transition-opacity"
              >
                <div
                  className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center border shadow-sm ${
                    role === "admin"
                      ? "bg-brand-navy text-white border-slate-800"
                      : role === "tour_leader"
                      ? "bg-brand-green text-white border-emerald-600"
                      : "bg-brand-azure/10 text-brand-azure border-brand-azure/20"
                  }`}
                >
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="hidden lg:flex flex-col">
                  <span className="text-xs font-bold text-brand-navy leading-tight line-clamp-1">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize">
                    {role === "tour_leader" ? "Pemandu HPI" : role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-brand-navy truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span
                      className={`inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        role === "admin"
                          ? "bg-amber-100 text-brand-orange"
                          : role === "tour_leader"
                          ? "bg-green-100 text-brand-green"
                          : "bg-sky-100 text-brand-azure"
                      }`}
                    >
                      {role === "tour_leader" ? "Pemandu Lapangan" : role}
                    </span>
                  </div>

                  <div className="py-1 text-xs font-medium space-y-0.5">
                    {role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-brand-navy font-bold hover:bg-slate-50"
                      >
                        <ShieldCheck className="w-4 h-4 text-brand-orange" />
                        <span>Portal Dashboard Admin</span>
                      </Link>
                    )}
                    {role === "tour_leader" && (
                      <Link
                        href="/tour-leader/manifest"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-brand-green font-bold hover:bg-green-50"
                      >
                        <UserCheck className="w-4 h-4 text-brand-green" />
                        <span>Portal Manifes Pemandu</span>
                      </Link>
                    )}
                    {(!role || role === "traveler") && (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-brand-azure font-extrabold hover:bg-sky-50"
                        >
                          <Compass className="w-4 h-4 text-brand-azure" />
                          <span>Dashboard Wisatawan</span>
                        </Link>
                        <Link
                          href="/my-tickets"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50"
                        >
                          <Ticket className="w-4 h-4 text-slate-400" />
                          <span>E-Tiket & Riwayat Trip</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <Link
                href="/login"
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-brand-azure hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-brand-azure hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-azure/20 flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Daftar</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-brand-navy"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4">
          {/* User status */}
          {isLoggedIn && currentUser ? (
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center ${
                    role === "admin"
                      ? "bg-brand-navy text-white"
                      : role === "tour_leader"
                      ? "bg-brand-green text-white"
                      : "bg-brand-azure/10 text-brand-azure"
                  }`}
                >
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-navy">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 capitalize">
                    {role === "tour_leader" ? "Pemandu Lapangan" : role}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center text-xs font-bold text-brand-navy bg-slate-100 rounded-xl"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center text-xs font-bold text-white bg-brand-azure rounded-xl shadow-sm"
              >
                Daftar Akun
              </Link>
            </div>
          )}

          {/* Links for Mobile */}
          <div className="space-y-1 text-sm font-semibold text-slate-700">
            {role === "admin" && (
              <>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-brand-navy font-bold bg-amber-50"
                >
                  Dashboard Operasional Admin
                </Link>
                <Link
                  href="/?preview=true"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sky-700"
                >
                  Preview Tampilan Wisatawan
                </Link>
              </>
            )}

            {role === "tour_leader" && (
              <>
                <Link
                  href="/tour-leader/manifest"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-brand-green font-bold bg-green-50"
                >
                  Portal Manifes Pemandu
                </Link>
                <Link
                  href="/?preview=true"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-emerald-700"
                >
                  Preview Tampilan Wisatawan
                </Link>
              </>
            )}

            {(!role || role === "traveler") && (
              <>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-slate-100"
                >
                  Beranda & Paket
                </Link>
                <Link
                  href="/#fasilitas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-slate-100"
                >
                  Fasilitas All-In
                </Link>
                <Link
                  href="/#testimoni"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-slate-100"
                >
                  Testimoni Tamu
                </Link>
                <Link
                  href="/#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-slate-100"
                >
                  Pertanyaan (FAQ)
                </Link>
                {isLoggedIn && (
                  <Link
                    href="/my-tickets"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-slate-100 text-brand-azure font-bold"
                  >
                    E-Tiket & Riwayat Pesanan
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}