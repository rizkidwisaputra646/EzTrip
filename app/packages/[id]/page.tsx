"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEzTripStore } from "@/lib/store";
import {
  Clock,
  Calendar,
  MapPin,
  Star,
  CheckCircle2,
  Shield,
  ArrowRight,
  ArrowLeft,
  Users,
  Compass,
} from "lucide-react";

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, packages, isLoading, error } = useEzTripStore();

  const packageId = params?.id as string;
  const pkg = packages.find((p) => p.id === packageId) || packages[0];

  const isStaff = currentUser?.role === "admin" || currentUser?.role === "tour_leader";

  return (
    <div className="pb-24 sm:pb-16 animate-in fade-in">
      {/* Top Breadcrumb & Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Jelajah Paket</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Left Content (8 cols on desktop) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Image Banner */}
            <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-md">
              <Image
                src={pkg.imagePath}
                alt={pkg.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold text-brand-navy shadow-sm">
                {pkg.category}
              </div>
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-extrabold text-amber-500 shadow-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{pkg.rating}</span>
                <span className="text-slate-400 font-normal">({pkg.reviewCount} ulasan)</span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="p-2 border-r border-slate-100 last:border-none">
                <Clock className="w-4 h-4 text-brand-azure mx-auto mb-1" />
                <p className="text-[11px] text-slate-400 font-medium">Durasi</p>
                <p className="text-xs font-extrabold text-brand-navy">{pkg.duration}</p>
              </div>
              <div className="p-2 border-r border-slate-100 last:border-none">
                <Calendar className="w-4 h-4 text-brand-azure mx-auto mb-1" />
                <p className="text-[11px] text-slate-400 font-medium">Jadwal</p>
                <p className="text-xs font-extrabold text-brand-navy">Tiap Weekend</p>
              </div>
              <div className="p-2 border-r border-slate-100 last:border-none">
                <MapPin className="w-4 h-4 text-brand-azure mx-auto mb-1" />
                <p className="text-[11px] text-slate-400 font-medium">Meeting Point</p>
                <p className="text-xs font-extrabold text-brand-navy">Stasiun TKG</p>
              </div>
              <div className="p-2">
                <Users className="w-4 h-4 text-brand-azure mx-auto mb-1" />
                <p className="text-[11px] text-slate-400 font-medium">Tipe Trip</p>
                <p className="text-xs font-extrabold text-brand-navy">{pkg.tripType}</p>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-navy tracking-tight font-editorial">
                {pkg.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {pkg.description}
              </p>
            </div>

            {/* Highlights & Inclusions */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-brand-navy">Fasilitas & Layanan Termasuk</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {pkg.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary 3D2N */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-brand-navy">Rencana Perjalanan (Itinerary 3D2N)</h2>
              <div className="space-y-4">
                {pkg.itinerary.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-brand-azure text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                        H{day.dayNumber}
                      </span>
                      <h3 className="font-bold text-sm text-brand-navy">{day.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 pl-9 leading-relaxed">
                      {day.activities}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Booking Sidebar (4 cols on desktop) */}
          <div className="lg:col-span-4 sticky top-24 hidden lg:block space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-5">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Harga Paket All-Inclusive</p>
                <p className="text-3xl font-extrabold text-brand-azure mt-1">
                  {pkg.priceFormatted}
                  <span className="text-xs font-normal text-slate-400"> / orang</span>
                </p>
              </div>

              <div className="space-y-2.5 py-4 border-y border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Ketersediaan Kursi</span>
                  <span className="font-bold text-brand-green">Tersedia {pkg.availableSeats} Kursi</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pilihan Tanggal</span>
                  <span className="font-bold text-brand-navy">Setiap Akhir Pekan</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Metode Pembayaran</span>
                  <span className="font-bold text-brand-navy">QRIS & Virtual Account</span>
                </div>
              </div>

              {isStaff ? (
                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-800 text-center font-medium">
                  Anda login sebagai <strong>{currentUser?.role}</strong>. Silakan beralih ke akun <strong>Traveler</strong> di navbar untuk mencoba reservasi.
                </div>
              ) : (
                <Link
                  href={`/booking/schedule?packageId=${pkg.id}`}
                  className="w-full py-4 bg-brand-orange hover:bg-orange-600 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-brand-orange/30 flex items-center justify-center gap-2"
                >
                  <span>Pilih Tanggal & Kursi</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <p className="text-[11px] text-center text-slate-400">
                🔒 Pembayaran aman dan terverifikasi otomatis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-3 safe-bottom shadow-2xl flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Harga per orang</p>
          <p className="text-lg font-extrabold text-brand-azure">{pkg.priceFormatted}</p>
        </div>

        {isStaff ? (
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-4 py-3 rounded-xl">
            Staff Mode ({currentUser?.role})
          </span>
        ) : (
          <Link
            href={`/booking/schedule?packageId=${pkg.id}`}
            className="px-6 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-orange/30 flex items-center gap-1.5"
          >
            <span>Pilih Tanggal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
