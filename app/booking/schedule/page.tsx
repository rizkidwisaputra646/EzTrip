"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEzTripStore } from "@/lib/store";
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2 } from "lucide-react";

function ScheduleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, isInitialized, schedules, packages } = useEzTripStore();
  const packageId = searchParams.get("packageId") || "pahawang-kiluan";
  const pkg = packages.find((p) => p.id === packageId) || packages[0];

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

  const activeSchedules = schedules && schedules.length > 0 ? schedules : [
    {
      id: "sch_01",
      range: "18 - 20 Okt 2026",
      label: "Weekend Ini",
      status: "Tersedia" as const,
      seatsAvailable: 6,
      maxSeats: 20,
      badgeColor: "bg-green-100 text-brand-green",
    },
  ];

  const [selectedSchedule, setSelectedSchedule] = useState(activeSchedules[0]?.range || "18 - 20 Okt 2026");

  const handleNext = () => {
    router.push(`/booking/details?packageId=${pkg.id}&schedule=${encodeURIComponent(selectedSchedule)}`);
  };

  if (!isInitialized || !currentUser || currentUser.role !== "traveler") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-3 text-center">
        <div className="w-10 h-10 border-4 border-brand-azure border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-brand-navy">Mengarahkan ke halaman masuk akun...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in">
      {/* Back button & Step Progress */}
      <div className="space-y-4">
        <Link
          href={`/packages/${pkg.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-navy"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Batal & Kembali</span>
        </Link>

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-200 pb-3">
          <span className="text-brand-azure flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand-azure text-white flex items-center justify-center text-[10px]">1</span>
            Pilih Tanggal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">2</span>
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

      {/* Package Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-brand-azure font-bold uppercase">{pkg.category}</p>
          <h1 className="text-base font-extrabold text-brand-navy">{pkg.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{pkg.duration} • All-Inclusive</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-slate-400 font-semibold uppercase">Harga</p>
          <p className="text-base font-extrabold text-brand-azure">{pkg.priceFormatted}</p>
        </div>
      </div>

      {/* Schedule Picker */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-brand-navy">Pilih Jadwal Keberangkatan Akhir Pekan</h2>
          <p className="text-xs text-slate-500">
            Trip reguler 3 Hari 2 Malam berangkat setiap hari Jumat pagi dan kembali Minggu sore.
          </p>
        </div>

        <div className="space-y-3">
          {activeSchedules.map((d) => {
            const isSelected = selectedSchedule === d.range;
            return (
              <div
                key={d.range}
                onClick={() => setSelectedSchedule(d.range)}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                  isSelected
                    ? "bg-sky-50/50 border-brand-azure shadow-md shadow-brand-azure/10"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "border-brand-azure bg-brand-azure text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-brand-navy">{d.range}</span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {d.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-azure" />
                      Jumat 06:00 WIB s/d Minggu 16:00 WIB
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${d.badgeColor}`}>
                    {d.status} ({d.seatsAvailable} Kursi)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assurance note */}
      <div className="bg-slate-100 p-4 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
        <span>
          <strong>Jaminan Pasti Berangkat:</strong> Begitu Anda menyelesaikan reservasi, slot kursi bus dan homestay langsung terkunci untuk Anda.
        </span>
      </div>

      {/* Bottom Button */}
      <div className="pt-2">
        <button
          onClick={handleNext}
          className="w-full py-4 bg-brand-azure hover:bg-sky-600 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-brand-azure/30 flex items-center justify-center gap-2"
        >
          <span>Lanjut ke Pengisian Data Tamu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function BookingSchedulePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Memuat jadwal keberangkatan...</div>}>
      <ScheduleContent />
    </Suspense>
  );
}
