"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PACKAGES } from "@/lib/mock-data";
import { useEzTripStore } from "@/lib/store";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Users,
  MapPin,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

function BookingDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, isInitialized } = useEzTripStore();

  const packageId = searchParams.get("packageId") || "pahawang-kiluan";
  const schedule = searchParams.get("schedule") || "18 - 20 Okt 2026";
  const pkg = PACKAGES.find((p) => p.id === packageId) || PACKAGES[0];

  // Require login to book:
  useEffect(() => {
    if (!isInitialized) return;
    if (!currentUser) {
      router.replace(`/login?redirect=${encodeURIComponent(`/booking/details?packageId=${packageId}&schedule=${schedule}`)}&message=login_required`);
      return;
    }
    if (currentUser.role === "admin") {
      router.replace("/admin/dashboard");
    } else if (currentUser.role === "tour_leader") {
      router.replace("/tour-leader/manifest");
    }
  }, [currentUser, isInitialized, packageId, schedule, router]);

  const [guestCount, setGuestCount] = useState<number>(1);
  const [leadName, setLeadName] = useState<string>(currentUser?.name || "");
  const [leadPhone, setLeadPhone] = useState<string>(currentUser?.phone || "");
  const [leadEmail, setLeadEmail] = useState<string>(currentUser?.email || "");
  const [leadIdCard, setLeadIdCard] = useState<string>("");
  const [guest2Name, setGuest2Name] = useState<string>("");
  const [guest3Name, setGuest3Name] = useState<string>("");
  const [guest4Name, setGuest4Name] = useState<string>("");
  const [meetingPoint, setMeetingPoint] = useState<string>("Stasiun Tanjung Karang (TKG) — 06:00 WIB");
  const [specialNotes, setSpecialNotes] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");

  const subtotal = pkg.price * guestCount;

  const handleNext = () => {
    if (!leadName.trim() || !leadPhone.trim() || !leadEmail.trim() || !leadIdCard.trim()) {
      setErrorMessage("Silakan lengkapi semua kolom data kontak & identitas tamu utama.");
      return;
    }
    if (guestCount > 1 && !guest2Name.trim()) {
      setErrorMessage("Silakan lengkapi nama tamu kedua.");
      return;
    }

    const query = new URLSearchParams({
      packageId: pkg.id,
      schedule,
      guestCount: String(guestCount),
      leadName,
      leadPhone,
      leadEmail,
      leadIdCard,
      guest2Name,
      guest3Name,
      guest4Name,
      meetingPoint,
      specialNotes,
    }).toString();

    router.push(`/booking/seats?${query}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in">
      {/* Back button & Step Progress */}
      <div className="space-y-4">
        <Link
          href={`/booking/schedule?packageId=${pkg.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-navy"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pilih Tanggal</span>
        </Link>

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-200 pb-3">
          <span className="text-brand-green flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand-green text-white flex items-center justify-center text-[10px]">✓</span>
            Pilih Tanggal
          </span>
          <span className="text-brand-azure flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand-azure text-white flex items-center justify-center text-[10px]">2</span>
            Data Tamu
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">3</span>
            Pilih Kursi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">4</span>
            Bayar
          </span>
        </div>
      </div>

      {/* Booking Quick Summary */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-extrabold text-brand-navy">{pkg.title}</h1>
          <p className="text-xs text-brand-azure font-bold mt-0.5">{schedule}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Subtotal ({guestCount} Org)</p>
          <p className="text-base font-extrabold text-brand-azure">Rp {subtotal.toLocaleString("id-ID")}</p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Guest Count Selector */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-azure" />
            Jumlah Penumpang / Wisatawan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih berapa banyak tiket yang ingin dipesan (Maksimal 4 orang per reservasi).
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((count) => {
            const isSelected = guestCount === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => setGuestCount(count)}
                className={`py-3 rounded-xl text-center font-bold text-sm transition-all border ${
                  isSelected
                    ? "bg-brand-azure text-white border-brand-azure shadow-md shadow-brand-azure/20"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {count} Orang
              </button>
            );
          })}
        </div>
      </div>

      {/* Lead Guest Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-brand-navy flex items-center gap-2 border-b border-slate-100 pb-3">
          <User className="w-4 h-4 text-brand-azure" />
          Data Tamu Utama (Pemesan)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Nama Lengkap (Sesuai KTP)</label>
            <input
              type="text"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-azure"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Nomor WhatsApp Aktif</label>
            <input
              type="tel"
              value={leadPhone}
              onChange={(e) => setLeadPhone(e.target.value)}
              placeholder="0812-xxxx-xxxx"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-azure"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Alamat Email (Pengiriman E-Tiket)</label>
            <input
              type="email"
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-azure"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Nomor NIK KTP / Paspor</label>
            <input
              type="text"
              value={leadIdCard}
              onChange={(e) => setLeadIdCard(e.target.value)}
              placeholder="16 digit nomor KTP"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-azure"
            />
          </div>
        </div>
      </div>

      {/* Additional Guests (If > 1) */}
      {guestCount > 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-brand-navy flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users className="w-4 h-4 text-brand-green" />
            Nama Tamu Tambahan
          </h2>

          <div className="space-y-3 text-xs">
            {guestCount >= 2 && (
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Nama Tamu 2</label>
                <input
                  type="text"
                  value={guest2Name}
                  onChange={(e) => setGuest2Name(e.target.value)}
                  placeholder="Nama lengkap tamu kedua"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-azure"
                />
              </div>
            )}

            {guestCount >= 3 && (
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Nama Tamu 3</label>
                <input
                  type="text"
                  value={guest3Name}
                  onChange={(e) => setGuest3Name(e.target.value)}
                  placeholder="Nama lengkap tamu ketiga"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-azure"
                />
              </div>
            )}

            {guestCount >= 4 && (
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Nama Tamu 4</label>
                <input
                  type="text"
                  value={guest4Name}
                  onChange={(e) => setGuest4Name(e.target.value)}
                  placeholder="Nama lengkap tamu keempat"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-azure"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Meeting Point Selection */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-azure" />
            Pilih Titik Kumpul (Meeting Point)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ditetapkan oleh tim operasional EZ Trip untuk koordinasi armada bus dan perahu.
          </p>
        </div>

        <div className="space-y-2.5 text-xs">
          {[
            "Stasiun Tanjung Karang (TKG) — 06:00 WIB",
            "Dermaga Ketapang Pesawaran — 08:30 WIB",
          ].map((mp) => {
            const isSelected = meetingPoint === mp;
            return (
              <div
                key={mp}
                onClick={() => setMeetingPoint(mp)}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
                  isSelected ? "bg-sky-50/50 border-brand-azure" : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected ? "border-brand-azure bg-brand-azure" : "border-slate-300"
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="font-bold text-brand-navy">{mp}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Notes & Requests */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs">
        <label className="font-bold text-brand-navy flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-brand-azure" />
          Catatan Khusus & Preferensi Konsumsi (Opsional)
        </label>
        <textarea
          rows={3}
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          placeholder="Contoh: Request kamar homestay non-smoking, alergi udang, dsb."
          className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-azure text-xs"
        />
      </div>

      {/* Bottom Button */}
      <div className="pt-2">
        <button
          onClick={handleNext}
          className="w-full py-4 bg-brand-azure hover:bg-sky-600 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-brand-azure/30 flex items-center justify-center gap-2"
        >
          <span>Lanjut ke Pemilihan Kursi Bus ({guestCount} Kursi)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function BookingDetailsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Memuat formulir pemesanan...</div>}>
      <BookingDetailsContent />
    </Suspense>
  );
}
