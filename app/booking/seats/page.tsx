"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEzTripStore } from "@/lib/store";
import {
  ArrowLeft,
  ArrowRight,
  Bus,
  Armchair,
  AlertCircle,
} from "lucide-react";

function BookingSeatsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, isInitialized, fleets, bookings, packages } = useEzTripStore();

  const packageId = searchParams.get("packageId") || "pahawang-kiluan";
  const schedule = searchParams.get("schedule") || "18 - 20 Okt 2026";
  const guestCount = parseInt(searchParams.get("guestCount") || "1", 10);
  const leadName = searchParams.get("leadName") || "";
  const leadPhone = searchParams.get("leadPhone") || "";
  const leadEmail = searchParams.get("leadEmail") || "";
  const leadIdCard = searchParams.get("leadIdCard") || "";
  const guest2Name = searchParams.get("guest2Name") || "";
  const guest3Name = searchParams.get("guest3Name") || "";
  const guest4Name = searchParams.get("guest4Name") || "";
  const meetingPoint = searchParams.get("meetingPoint") || "Stasiun Tanjung Karang (TKG) — 06:00 WIB";
  const specialNotes = searchParams.get("specialNotes") || "";

  // Require login to book:
  useEffect(() => {
    if (!isInitialized) return;
    if (!currentUser) {
      router.replace(`/login?redirect=${encodeURIComponent(`/booking/schedule?packageId=${packageId}`)}&message=login_required`);
      return;
    }
    if (currentUser.role === "admin") {
      router.replace("/admin/dashboard");
    } else if (currentUser.role === "tour_leader") {
      router.replace("/tour-leader/manifest");
    }
  }, [currentUser, isInitialized, packageId, router]);

  const pkg = packages.find((p) => p.id === packageId) || packages[0];

  // Dynamic fleet locked seats & confirmed booked seats for this package & schedule
  const currentFleet = fleets.find((f) => f.packageId === packageId) || fleets[0];
  const crewLockedSeats = currentFleet?.lockedSeats || [];
  const scheduleBookedSeats = bookings
    .filter((b) => b.packageId === packageId && b.scheduleDate === schedule && b.status === "Terkonfirmasi")
    .flatMap((b) => b.outboundSeatNumbers);

  const baseBooked = ["03", "04"];
  const allUnavailable = Array.from(new Set([...baseBooked, ...scheduleBookedSeats, ...crewLockedSeats]));

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const toggleSeat = (seatNo: string) => {
    if (allUnavailable.includes(seatNo)) {
      if (crewLockedSeats.includes(seatNo)) {
        setErrorMessage(`Kursi ${seatNo} telah dikunci untuk kru/driver atau keperluan operasional.`);
      } else {
        setErrorMessage(`Kursi ${seatNo} sudah dipesan oleh penumpang lain.`);
      }
      return;
    }

    if (selectedSeats.includes(seatNo)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNo));
      setErrorMessage("");
    } else {
      if (selectedSeats.length >= guestCount) {
        setErrorMessage(`Anda hanya memesan untuk ${guestCount} orang. Batalkan salah satu kursi jika ingin mengganti.`);
        return;
      }
      setSelectedSeats([...selectedSeats, seatNo]);
      setErrorMessage("");
    }
  };

  const handleNext = () => {
    if (selectedSeats.length !== guestCount) {
      setErrorMessage(`Silakan pilih tepat ${guestCount} kursi bus sebelum melanjutkan.`);
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
      seats: selectedSeats.sort().join(","),
    }).toString();

    router.push(`/booking/payment?${query}`);
  };

  const subtotal = pkg.price * guestCount;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in">
      {/* Back button & Step Progress */}
      <div className="space-y-4">
        <Link
          href={`/booking/details?packageId=${pkg.id}&schedule=${encodeURIComponent(schedule)}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-navy"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Data Tamu</span>
        </Link>

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-200 pb-3">
          <span className="text-brand-green flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand-green text-white flex items-center justify-center text-[10px]">✓</span>
            Pilih Tanggal
          </span>
          <span className="text-brand-green flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand-green text-white flex items-center justify-center text-[10px]">✓</span>
            Data Tamu
          </span>
          <span className="text-brand-azure flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand-azure text-white flex items-center justify-center text-[10px]">3</span>
            Pilih Kursi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">4</span>
            Bayar
          </span>
        </div>
      </div>

      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-extrabold text-brand-navy">Pilih Kursi Armada Bus Pariwisata</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Armada: Jetbus 3+ Royal Class (AC, Reclining Seat 2-2)
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Kebutuhan Kursi</p>
          <p className="text-base font-extrabold text-brand-azure">
            {selectedSeats.length} / {guestCount} Terpilih
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Seat Selection Legend */}
      <div className="flex items-center justify-center gap-6 py-2 text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg border border-slate-300 bg-white" />
          <span>Tersedia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-azure text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
            ✓
          </div>
          <span className="text-brand-azure font-bold">Pilihan Anda</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-400 flex items-center justify-center text-[10px]">
            ✕
          </div>
          <span>Sudah Terisi</span>
        </div>
      </div>

      {/* Bus Cabin Visual (2-2 Layout) */}
      <div className="max-w-xs mx-auto bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-lg relative">
        {/* Front Cabin Banner */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-slate-200 mb-6 text-xs text-slate-400 font-bold uppercase">
          <div className="flex items-center gap-1.5 text-brand-navy">
            <Bus className="w-4 h-4 text-brand-azure" />
            <span>Pintu Depan</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Sopir Bus</span>
            <div className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">
              🛞
            </div>
          </div>
        </div>

        {/* Seats Grid: 5 Rows of 4 seats (2 Left - Aisle - 2 Right) */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((row) => {
            const left1 = String((row - 1) * 4 + 1).padStart(2, "0");
            const left2 = String((row - 1) * 4 + 2).padStart(2, "0");
            const right1 = String((row - 1) * 4 + 3).padStart(2, "0");
            const right2 = String((row - 1) * 4 + 4).padStart(2, "0");

            const renderSeat = (num: string) => {
              const isLocked = crewLockedSeats.includes(num);
              const isBooked = allUnavailable.includes(num);
              const isSelected = selectedSeats.includes(num);

              return (
                <button
                  key={num}
                  type="button"
                  disabled={isBooked}
                  onClick={() => toggleSeat(num)}
                  className={`w-11 h-11 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center transition-all ${
                    isLocked
                      ? "bg-slate-900 text-slate-300 cursor-not-allowed border border-slate-800"
                      : isBooked
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      : isSelected
                      ? "bg-brand-azure text-white shadow-md shadow-brand-azure/30 scale-105 border-2 border-brand-azure"
                      : "bg-white text-slate-700 hover:bg-sky-50 border border-slate-300 hover:border-brand-azure"
                  }`}
                  title={isLocked ? "Terkunci untuk Kru" : isBooked ? "Sudah Terisi" : `Pilih Kursi ${num}`}
                >
                  <Armchair className="w-3.5 h-3.5 mb-0.5" />
                  <span className="text-[10px]">{isLocked ? "KRU" : num}</span>
                </button>
              );
            };

            return (
              <div key={row} className="flex items-center justify-between">
                <div className="flex gap-2">
                  {renderSeat(left1)}
                  {renderSeat(left2)}
                </div>

                {/* Aisle */}
                <span className="text-[10px] font-bold text-slate-300">R{row}</span>

                <div className="flex gap-2">
                  {renderSeat(right1)}
                  {renderSeat(right2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Back Cabin */}
        <div className="pt-6 mt-6 border-t-2 border-dashed border-slate-200 text-center text-[11px] font-semibold text-slate-400">
          Kabin Belakang & Bagasi
        </div>
      </div>

      {/* Selected Summary Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Nomor Kursi Terpilih</p>
          <p className="text-base font-extrabold text-brand-navy mt-0.5">
            {selectedSeats.length > 0 ? selectedSeats.sort().join(", ") : "Belum memilih kursi"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Total Biaya ({guestCount} Org)</p>
          <p className="text-base font-extrabold text-brand-azure mt-0.5">
            Rp {subtotal.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pt-2">
        <button
          onClick={handleNext}
          disabled={selectedSeats.length !== guestCount}
          className={`w-full py-4 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 ${
            selectedSeats.length === guestCount
              ? "bg-brand-azure hover:bg-sky-600 shadow-brand-azure/30"
              : "bg-slate-300 cursor-not-allowed shadow-none"
          }`}
        >
          <span>
            {selectedSeats.length === guestCount
              ? "Lanjut ke Pembayaran"
              : `Pilih ${guestCount - selectedSeats.length} Kursi Lagi`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function BookingSeatsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Memuat denah kabin bus...</div>}>
      <BookingSeatsContent />
    </Suspense>
  );
}
