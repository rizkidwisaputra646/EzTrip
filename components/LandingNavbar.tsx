"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEzTripStore } from "@/lib/store";
import { Menu, X, ArrowRight, UserCheck } from "lucide-react";

export default function LandingNavbar() {
  const router = useRouter();
  const { currentUser, isLoggedIn } = useEzTripStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group py-1">
          <div className="relative h-11 w-28 sm:w-32 flex items-center">
            <Image
              src="/assets/images/logo_eztrip.png"
              alt="EZ Trip - Travel Made Easy"
              fill
              className="object-contain object-left group-hover:scale-105 transition-transform"
              priority
            />
          </div>
        </Link>

        {/* Center: Public Landing Page Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-700">
          <Link
            href="/#"
            className="px-3.5 py-2 rounded-full hover:text-brand-azure hover:bg-slate-50 transition-colors"
          >
            Beranda
          </Link>
          <Link
            href="/#paket"
            className="px-3.5 py-2 rounded-full hover:text-brand-azure hover:bg-slate-50 transition-colors"
          >
            Paket Wisata 3D2N
          </Link>
          <Link
            href="/#fasilitas"
            className="px-3.5 py-2 rounded-full hover:text-brand-azure hover:bg-slate-50 transition-colors"
          >
            Fasilitas All-In
          </Link>
          <Link
            href="/#testimoni"
            className="px-3.5 py-2 rounded-full hover:text-brand-azure hover:bg-slate-50 transition-colors"
          >
            Testimoni Tamu
          </Link>
          <Link
            href="/#faq"
            className="px-3.5 py-2 rounded-full hover:text-brand-azure hover:bg-slate-50 transition-colors"
          >
            FAQ
          </Link>
        </nav>

        {/* Right: Public Actions / Member Shortcut */}
        <div className="hidden md:flex items-center gap-2.5">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="text-xs font-bold text-brand-navy hover:text-brand-azure px-3 py-2 rounded-xl transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="text-xs font-extrabold bg-brand-azure hover:bg-sky-600 text-white px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
              >
                <span>Daftar Akun</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          ) : (
            /* If already logged in, show clean 1-click jump to their respective portal */
            <Link
              href={
                currentUser?.role === "admin"
                  ? "/admin/dashboard"
                  : currentUser?.role === "tour_leader"
                  ? "/tour-leader/manifest"
                  : "/dashboard"
              }
              className="text-xs font-extrabold bg-brand-azure hover:bg-sky-600 text-white px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>
                {currentUser?.role === "admin"
                  ? "Portal Admin"
                  : currentUser?.role === "tour_leader"
                  ? "Portal Tour Leader"
                  : "Buka Dashboard Saya"}
              </span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 text-sm font-semibold animate-in slide-in-from-top-2">
          <Link
            href="/#"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
          >
            Beranda
          </Link>
          <Link
            href="/#paket"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
          >
            Paket Wisata 3D2N
          </Link>
          <Link
            href="/#fasilitas"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
          >
            Fasilitas All-In
          </Link>
          <Link
            href="/#testimoni"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
          >
            Testimoni Tamu
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
          >
            FAQ
          </Link>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-brand-navy"
                >
                  Masuk ke Akun
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-brand-azure text-white font-extrabold text-xs shadow-md"
                >
                  Daftar Akun Baru
                </Link>
              </>
            ) : (
              <Link
                href={
                  currentUser?.role === "admin"
                    ? "/admin/dashboard"
                    : currentUser?.role === "tour_leader"
                    ? "/tour-leader/manifest"
                    : "/dashboard"
                }
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-brand-azure text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>
                  {currentUser?.role === "admin"
                    ? "Portal Admin"
                    : currentUser?.role === "tour_leader"
                    ? "Portal Tour Leader"
                    : "Buka Dashboard Saya"}
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
