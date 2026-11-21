"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEzTripStore } from "@/lib/store";
import {
  Compass,
  Ticket,
  Bell,
  LogOut,
  ChevronDown,
  User,
  Plus,
  HelpCircle,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

export default function UserNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, bookings } = useEzTripStore();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const myActiveBooking = bookings.find((b) => b.status === "Terkonfirmasi");

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Traveler Hub Badge */}
        <div className="flex items-center gap-3.5">
          <Link href="/dashboard" className="flex items-center group py-1">
            <div className="relative h-10 w-28 sm:w-32 flex items-center">
              <Image
                src="/assets/images/logo_eztrip.png"
                alt="EZ Trip"
                fill
                className="object-contain object-left group-hover:scale-105 transition-transform"
                priority
              />
            </div>
          </Link>

          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-brand-azure text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-azure animate-pulse" />
            <span>Portal Wisatawan</span>
          </div>
        </div>

        {/* Center: Traveler Menu Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
          <Link
            href="/dashboard"
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              pathname === "/dashboard"
                ? "bg-slate-100 text-brand-navy font-bold shadow-xs"
                : "hover:bg-slate-50 hover:text-brand-navy"
            }`}
          >
            <Compass className="w-4 h-4 text-brand-azure" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/my-tickets"
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              pathname === "/my-tickets"
                ? "bg-slate-100 text-brand-navy font-bold shadow-xs"
                : "hover:bg-slate-50 hover:text-brand-navy"
            }`}
          >
            <Ticket className="w-4 h-4 text-brand-azure" />
            <span>Tiket & Booking Saya</span>
            {myActiveBooking && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Ada tiket aktif" />
            )}
          </Link>

          <Link
            href="/#paket"
            className="px-3.5 py-2 rounded-xl hover:bg-slate-50 hover:text-brand-navy transition-all flex items-center gap-1.5 text-slate-600"
          >
            <span>Jelajah Paket Lain</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <a
            href="https://wa.me/6281398765432?text=Halo%20EZ%20Trip%2C%20saya%20butuh%20bantuan%20mengenai%20trip%20saya"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl hover:bg-slate-50 hover:text-emerald-600 transition-all flex items-center gap-1.5 text-slate-600"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Bantuan 24 Jam</span>
          </a>
        </nav>

        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Action: New Booking */}
          <Link
            href="/#paket"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-azure hover:bg-sky-600 text-white font-extrabold text-xs shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pesan Trip Baru</span>
          </Link>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotification(!showNotification)}
              className="p-2 rounded-xl text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-colors relative"
              title="Notifikasi Perjalanan"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-orange ring-2 ring-white" />
            </button>

            {showNotification && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 text-xs z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-extrabold text-brand-navy">Notifikasi Perjalanan</span>
                  <span className="text-[10px] text-brand-azure font-bold">1 Baru</span>
                </div>
                <div className="bg-sky-50 rounded-xl p-3 border border-sky-100 space-y-1">
                  <p className="font-bold text-brand-navy">Trip Pahawang & Kiluan (3D2N)</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Jadwal keberangkatan akhir pekan ini pukul 06:00 WIB di Stasiun Tanjung Karang. Siapkan E-Tiket QR Anda!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-200/80"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-navy to-brand-azure text-white font-black text-xs flex items-center justify-center shadow-xs">
                {currentUser?.name
                  ? currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                  : "U"}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-bold text-brand-navy leading-tight line-clamp-1 max-w-[110px]">
                  {currentUser?.name || "Wisatawan"}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">Wisatawan Aktif</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 text-xs z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="font-bold text-brand-navy">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5 text-brand-azure" />
                  <span>Dashboard Saya</span>
                </Link>
                <Link
                  href="/my-tickets"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Ticket className="w-3.5 h-3.5 text-brand-azure" />
                  <span>E-Tiket & Riwayat</span>
                </Link>
                <div className="pt-1 border-t border-slate-100 mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 text-sm font-semibold">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-brand-navy hover:bg-slate-50"
          >
            Dashboard
          </Link>
          <Link
            href="/my-tickets"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-brand-navy hover:bg-slate-50"
          >
            Tiket & Booking Saya
          </Link>
          <Link
            href="/#paket"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50"
          >
            Jelajah Paket Lain
          </Link>
          <a
            href="https://wa.me/6281398765432"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 rounded-xl text-emerald-600 hover:bg-emerald-50"
          >
            Bantuan WhatsApp 24 Jam
          </a>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-rose-600 font-bold"
            >
              Keluar dari Akun
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
