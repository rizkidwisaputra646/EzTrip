"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { useEzTripStore } from "@/lib/store";
import {
  Clock,
  Copy,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  QrCode,
  PartyPopper,
} from "lucide-react";

export default function PaymentInstructionPage() {
  const params = useParams();
  const router = useRouter();
  const { bookings, updateBookingStatus } = useEzTripStore();

  const orderId = params?.orderId as string;
  const booking = bookings.find((b) => b.bookingCode === orderId) || bookings[0];

  const [copyFeedback, setCopyFeedback] = useState<string>("");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15 * 60);
  const [isPaid, setIsPaid] = useState<boolean>(booking?.status === "Terkonfirmasi");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  // Countdown timer
  useEffect(() => {
    if (isPaid) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaid]);

  // Generate QR Code if QRIS
  useEffect(() => {
    if (booking?.qrString) {
      QRCode.toDataURL(booking.qrString, { width: 260, margin: 1 })
        .then((url) => setQrCodeDataUrl(url))
        .catch(() => {});
    }
  }, [booking?.qrString]);

  // Auto-polling status every 5 seconds
  useEffect(() => {
    if (isPaid || !orderId) return;

    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/payment/status/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          const rawStatus = (data.transaction_status || "").toLowerCase();
          const fraud = (data.fraud_status || "").toLowerCase();

          if (rawStatus === "settlement" || (rawStatus === "capture" && fraud === "accept")) {
            handleSuccess();
          }
        }
      } catch (_) {}
    };

    const interval = setInterval(pollStatus, 5000);
    return () => clearInterval(interval);
  }, [isPaid, orderId]);

  const handleSuccess = () => {
    setIsPaid(true);
    updateBookingStatus(orderId, "Terkonfirmasi");
  };

  const handleManualCheck = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/payment/status/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        const rawStatus = (data.transaction_status || "").toLowerCase();
        if (rawStatus === "settlement" || rawStatus === "capture") {
          handleSuccess();
        } else {
          setCopyFeedback("Status transaksi masih pending. Silakan selesaikan pembayaran di simulator / ATM.");
          setTimeout(() => setCopyFeedback(""), 4000);
        }
      }
    } catch (_) {
      setCopyFeedback("Belum ada mutasi pembayaran terdeteksi.");
      setTimeout(() => setCopyFeedback(""), 3000);
    }
    setIsVerifying(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`${label} berhasil disalin!`);
    setTimeout(() => setCopyFeedback(""), 3000);
  };

  // Open Simulator
  const openMidtransSimulator = () => {
    let simUrl = "https://simulator.sandbox.midtrans.com";
    let textToCopy = booking?.vaNumber || booking?.billKey || booking?.qrString || orderId;

    if (booking?.paymentChannel === "bca_va") {
      simUrl = "https://simulator.sandbox.midtrans.com/bca/va/index";
    } else if (booking?.paymentChannel === "bri_va") {
      simUrl = "https://simulator.sandbox.midtrans.com/bri/va/index";
    } else if (booking?.paymentChannel === "bni_va") {
      simUrl = "https://simulator.sandbox.midtrans.com/bni/va/index";
    } else if (booking?.paymentChannel === "permata_va") {
      simUrl = "https://simulator.sandbox.midtrans.com/permata/va/index";
    } else if (booking?.paymentChannel === "mandiri_va") {
      simUrl = "https://simulator.sandbox.midtrans.com/mandiri/bill/index";
      textToCopy = booking?.billKey || "";
    } else if (booking?.paymentChannel === "qris") {
      simUrl = "https://simulator.sandbox.midtrans.com/qris/index";
    }

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopyFeedback(`Nomor (${textToCopy}) otomatis disalin! Membuka Simulator Midtrans...`);
      setTimeout(() => setCopyFeedback(""), 4000);
    }

    window.open(simUrl, "_blank");
  };

  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60).toString().padStart(2, "0");
    const secs = (totalSec % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  if (!booking) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h1 className="text-lg font-bold text-brand-navy">Data Pesanan Tidak Ditemukan</h1>
        <Link href="/" className="px-6 py-2.5 bg-brand-azure text-white text-xs font-bold rounded-xl inline-block">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Kode Booking: {booking.bookingCode}
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy">
          Instruksi Pembayaran Native
        </h1>
        <p className="text-xs text-slate-500">
          Selesaikan pembayaran sebelum batas waktu berakhir untuk mengamankan kursi Anda.
        </p>

        {/* Countdown Timer */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-brand-orange">
          <Clock className="w-4 h-4 text-brand-orange" />
          <span>Sisa Waktu: {formatCountdown(secondsRemaining)}</span>
        </div>
      </div>

      {copyFeedback && (
        <div className="p-3.5 bg-sky-50 border border-brand-azure/30 rounded-xl text-xs font-bold text-brand-azure text-center animate-in fade-in">
          {copyFeedback}
        </div>
      )}

      {/* Payment Details Container */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Total Amount Box */}
        <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Tagihan</p>
            <p className="text-xl font-extrabold text-brand-azure">
              Rp {booking.totalAmount.toLocaleString("id-ID")}
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(String(booking.totalAmount), "Nominal tagihan")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-sm"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Salin</span>
          </button>
        </div>

        {/* Dynamic Display based on payment channel */}
        {booking.paymentChannel === "qris" ? (
          /* QRIS DISPLAY */
          <div className="text-center space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl inline-block border border-slate-200">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="QRIS Code" className="w-56 h-56 mx-auto rounded-xl" />
              ) : (
                <div className="w-56 h-56 bg-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                  Memuat QRIS...
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-brand-navy">Pindai QRIS Menggunakan Aplikasi Apa Saja</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                GoPay, OVO, DANA, ShopeePay, BCA Mobile, Livin, BRImo
              </p>
            </div>
            {booking.qrString && (
              <button
                onClick={() => copyToClipboard(booking.qrString!, "Kode QRIS")}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Data String QRIS</span>
              </button>
            )}
          </div>
        ) : booking.paymentChannel === "mandiri_va" ? (
          /* MANDIRI BILL DISPLAY */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Kode Perusahaan (Biller Code)</p>
                  <p className="text-base font-extrabold text-brand-navy">70012</p>
                </div>
                <button
                  onClick={() => copyToClipboard("70012", "Kode Perusahaan")}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Salin
                </button>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Nomor Pembayaran (Bill Key)</p>
                  <p className="text-lg font-extrabold text-brand-azure tracking-wider">
                    {booking.billKey || "712582020871"}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(booking.billKey || "712582020871", "Nomor Pembayaran")}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Salin
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* VIRTUAL ACCOUNT DISPLAY (BCA, BRI, BNI, PERMATA) */
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {booking.paymentMethod}
                </span>
                <span className="text-[10px] bg-sky-50 text-brand-azure font-extrabold px-2 py-0.5 rounded-md">
                  Verifikasi Otomatis
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-brand-navy tracking-wider select-all">
                {booking.vaNumber || "67447819959198540644066"}
              </p>
              <div className="pt-2">
                <button
                  onClick={() =>
                    copyToClipboard(booking.vaNumber || "67447819959198540644066", "Nomor Virtual Account")
                  }
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Nomor Virtual Account</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Test in Simulator Button (Seamless Integration) */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <button
            onClick={openMidtransSimulator}
            className="w-full py-3.5 bg-sky-50 hover:bg-sky-100 text-brand-azure font-extrabold text-xs rounded-2xl border border-brand-azure/30 flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <ExternalLink className="w-4 h-4 text-brand-azure" />
            <span>Uji di Simulator Perbankan (Sandbox)</span>
          </button>
          <p className="text-[11px] text-center text-slate-400">
            Nomor VA / QR otomatis tersalin. Anda tinggal paste dan klik bayar di simulator.
          </p>
        </div>

        {/* Check Status Button */}
        <div className="pt-2">
          <button
            onClick={handleManualCheck}
            disabled={isVerifying}
            className="w-full py-4 bg-brand-azure hover:bg-sky-600 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-brand-azure/30 flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isVerifying ? "animate-spin" : ""}`} />
            <span>{isVerifying ? "Memverifikasi..." : "Cek Status Pembayaran"}</span>
          </button>
        </div>

        {/* Instant Sandbox Simulation button */}
        <div className="text-center">
          <button
            onClick={handleSuccess}
            className="text-xs font-bold text-brand-green hover:underline inline-flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Simulasi Bayar Berhasil Langsung (Testing)</span>
          </button>
        </div>
      </div>

      {/* Success Celebration Modal */}
      {isPaid && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-green-100 text-brand-green flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-brand-navy">Pembayaran Berhasil! 🎉</h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Transaksi Anda telah terverifikasi lunas. E-Tiket resmi dan kuota kursi armada telah dikonfirmasi.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Kode Booking</span>
                <span className="font-bold text-brand-navy">{booking.bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Paket Wisata</span>
                <span className="font-bold text-brand-navy">{booking.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nomor Kursi</span>
                <span className="font-bold text-brand-azure">Kursi {booking.outboundSeatNumbers.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-bold text-brand-green">Lunas (Terkonfirmasi)</span>
              </div>
            </div>

            <button
              onClick={() => router.push(`/booking/ticket/${booking.bookingCode}`)}
              className="w-full py-4 bg-brand-green hover:bg-green-600 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2"
            >
              <span>Lihat Detail E-Tiket Saya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
