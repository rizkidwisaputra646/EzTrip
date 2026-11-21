"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { useEzTripStore } from "@/lib/store";
import {
  Compass,
  MapPin,
  Calendar,
  Clock,
  User,
  Users,
  Armchair,
  CheckCircle2,
  Printer,
  ArrowLeft,
  MessageCircle,
  Bus,
} from "lucide-react";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { bookings } = useEzTripStore();

  const orderId = params?.orderId as string;
  const booking = bookings.find((b) => b.bookingCode === orderId) || bookings[0];

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  useEffect(() => {
    if (booking?.bookingCode) {
      QRCode.toDataURL(booking.bookingCode, { width: 220, margin: 1 })
        .then((url) => setQrCodeDataUrl(url))
        .catch(() => {});
    }
  }, [booking?.bookingCode]);

  if (!booking) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-lg font-bold text-brand-navy">E-Tiket Tidak Ditemukan</h1>
        <Link href="/" className="px-6 py-2.5 bg-brand-azure text-white text-xs font-bold rounded-xl inline-block">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in">
      {/* Top back */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-navy"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 shadow-sm"
        >
          <Printer className="w-3.5 h-3.5 text-brand-azure" />
          <span>Cetak / Simpan Tiket</span>
        </button>
      </div>

      {/* Ticket Card Container (Boarding Pass Aesthetic) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print:border-none print:shadow-none">
        {/* Ticket Header */}
        <div className="bg-brand-navy p-6 text-white space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-white rounded-xl px-2.5 py-1 shadow-sm flex items-center">
                <Image
                  src="/assets/images/logo_eztrip.png"
                  alt="EZ Trip"
                  width={90}
                  height={45}
                  className="h-6 w-auto object-contain"
                />
              </div>
              <span className="font-extrabold text-xs text-sky-300 uppercase tracking-wider">Official E-Ticket</span>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 font-bold text-[11px] rounded-full border border-green-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Terkonfirmasi Lunas
            </span>
          </div>

          <div className="pt-2">
            <h1 className="text-lg sm:text-xl font-extrabold">{booking.packageName}</h1>
            <p className="text-xs text-slate-300">{booking.scheduleDate} • Keberangkatan 07:00 WIB</p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="p-6 bg-slate-50 border-b border-dashed border-slate-200 text-center space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            QR Code Presensi Meeting Point
          </p>
          {qrCodeDataUrl ? (
            <img src={qrCodeDataUrl} alt="E-Ticket QR" className="w-48 h-48 mx-auto rounded-2xl bg-white p-2 shadow-sm border border-slate-200" />
          ) : (
            <div className="w-48 h-48 mx-auto bg-slate-200 rounded-2xl flex items-center justify-center text-xs text-slate-400">
              Memuat QR Tiket...
            </div>
          )}
          <p className="text-sm font-extrabold text-brand-navy font-mono tracking-wider">
            {booking.bookingCode}
          </p>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
            Tunjukkan QR Code ini kepada Tour Leader (Kang Dedi) saat tiba di titik penjemputan.
          </p>
        </div>

        {/* Ticket Body Details */}
        <div className="p-6 space-y-5 text-xs">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Wisatawan Utama</p>
              <p className="font-extrabold text-brand-navy text-sm mt-0.5">{booking.leadGuestName}</p>
              <p className="text-slate-500 text-[11px]">{booking.leadGuestPhone}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Jumlah Tamu</p>
              <p className="font-extrabold text-brand-navy text-sm mt-0.5">{booking.guestCount} Orang</p>
              <p className="text-slate-500 text-[11px]">
                {booking.guest2Name ? `Tamu 2: ${booking.guest2Name}` : "Peserta Tunggal"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Nomor Kursi Bus</p>
              <p className="font-extrabold text-brand-azure text-sm mt-0.5 flex items-center gap-1">
                <Armchair className="w-4 h-4 text-brand-azure" />
                <span>Kursi {booking.outboundSeatNumbers.join(", ")} (PP)</span>
              </p>
              <p className="text-slate-500 text-[11px]">{booking.vehicleId}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Metode Pembayaran</p>
              <p className="font-extrabold text-brand-navy text-sm mt-0.5">{booking.paymentMethod}</p>
              <p className="text-brand-green font-bold text-[11px]">Rp {booking.totalAmount.toLocaleString("id-ID")}</p>
            </div>
          </div>

          <div>
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Titik Penjemputan</p>
            <p className="font-extrabold text-brand-navy text-sm mt-0.5 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-brand-azure shrink-0" />
              <span>{booking.meetingPoint}</span>
            </p>
          </div>

          {/* Tour Leader Contact Card */}
          <div className="p-4 bg-sky-50 rounded-2xl border border-brand-azure/20 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-brand-azure font-bold uppercase">Tour Leader Bertugas</p>
              <p className="font-extrabold text-brand-navy text-sm">{booking.tourLeaderName}</p>
              <p className="text-[11px] text-slate-500">{booking.tourLeaderPhone} (HPI Lampung)</p>
            </div>
            <a
              href={`https://wa.me/6281398765432?text=${encodeURIComponent(
                `Halo Kang Dedi, saya ${booking.leadGuestName} pemegang tiket ${booking.bookingCode} untuk keberangkatan ${booking.scheduleDate}.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-brand-green hover:bg-green-600 text-white rounded-xl shadow-md transition-colors"
              title="WhatsApp Tour Leader"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
