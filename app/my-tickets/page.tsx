"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEzTripStore } from "@/lib/store";
import { Ticket, Calendar, MapPin, ArrowRight, CheckCircle2, Clock } from "lucide-react";

export default function MyTicketsPage() {
  const router = useRouter();
  const { bookings, currentUser, isInitialized } = useEzTripStore();

  useEffect(() => {
    if (!isInitialized) return;
    if (!currentUser) {
      router.replace("/login?redirect=/my-tickets&message=login_required");
    }
  }, [currentUser, isInitialized, router]);

  if (!isInitialized || !currentUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-3 text-center">
        <div className="w-10 h-10 border-4 border-brand-azure border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-brand-navy">Mengarahkan ke halaman masuk...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">E-Tiket & Riwayat Pesanan</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Daftar seluruh tiket perjalanan wisata Anda bersama EZ Trip Lampung.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-brand-navy">Belum Ada Tiket Pemesanan</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Anda belum memiliki reservasi aktif. Silakan jelajahi paket wisata favorit akhir pekan ini.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-brand-azure text-white font-bold text-xs rounded-xl shadow-md"
          >
            Jelajah Paket Wisata
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.bookingCode}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 font-mono">
                    {b.bookingCode}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.status === "Terkonfirmasi"
                        ? "bg-green-100 text-brand-green"
                        : "bg-amber-100 text-brand-orange"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <h2 className="text-base font-extrabold text-brand-navy">{b.packageName}</h2>

                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-azure" />
                    {b.scheduleDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-azure" />
                    Kursi: {b.outboundSeatNumbers.join(", ")}
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0">
                <p className="text-base font-extrabold text-brand-azure">
                  Rp {b.totalAmount.toLocaleString("id-ID")}
                </p>

                {b.status === "Terkonfirmasi" ? (
                  <Link
                    href={`/booking/ticket/${b.bookingCode}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-green hover:bg-green-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    <span>Buka E-Tiket QR</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    href={`/booking/instructions/${b.bookingCode}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    <span>Lanjut Bayar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
