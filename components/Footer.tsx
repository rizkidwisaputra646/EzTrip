import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Shield, CheckCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-slate-800">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-2xl px-3 py-1.5 shadow-md inline-flex items-center">
                <Image
                  src="/assets/images/logo_eztrip.png"
                  alt="EZ Trip - Travel Made Easy"
                  width={130}
                  height={70}
                  className="h-9 w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform reservasi wisata akhir pekan resmi Lampung. Menyediakan open trip terpadu (3D2N)
              dengan jaminan pasti berangkat, pemandu HPI profesional, homestay apung, dan sistem pembayaran
              online otomatis dengan verifikasi instan.
            </p>
            <div className="flex flex-col gap-2 pt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-brand-green" /> Jaminan Pasti Berangkat
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-brand-azure" /> Pemandu Berlisensi HPI
              </span>
            </div>
          </div>

          {/* Col 2: Destinasi Wisata */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">3 Paket Favorit</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/packages/pahawang-kiluan" className="hover:text-brand-azure transition-colors">
                  Beach Escape: Pahawang & Kiluan
                </Link>
              </li>
              <li>
                <Link href="/packages/way-kambas-safari" className="hover:text-brand-azure transition-colors">
                  Nature Adventure: Way Kambas
                </Link>
              </li>
              <li>
                <Link href="/packages/siger-teluk-lampung" className="hover:text-brand-azure transition-colors">
                  Culture & Culinary: Menara Siger
                </Link>
              </li>
              <li className="pt-2">
                <Link href="/#fasilitas" className="text-slate-400 hover:text-white transition-colors">
                  Fasilitas All-Inclusive
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-slate-400 hover:text-white transition-colors">
                  Pertanyaan Sering Diajukan (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Akun & Layanan */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Akun & Layanan</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="hover:text-brand-azure transition-colors">
                  Masuk ke Akun
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-brand-azure transition-colors">
                  Daftar Akun Baru
                </Link>
              </li>
              <li>
                <Link href="/my-tickets" className="hover:text-brand-azure transition-colors">
                  E-Tiket & Riwayat Booking
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-brand-azure transition-colors">
                  Pusat Bantuan & Kebijakan
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Hubungi Kami */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Kantor Operasional</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-azure shrink-0 mt-0.5" />
                <span>Jl. Raden Intan No. 88, Tanjung Karang Pusat, Bandar Lampung</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-azure shrink-0" />
                <span>+62 813-9876-5432 (Kang Dedi)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-azure shrink-0" />
                <span>halo@eztrip.id</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 EZ Trip Lampung. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="text-[11px]">Terintegrasi Resmi dengan Sistem Pembayaran Online Otomatis & HPI Lampung.</p>
        </div>
      </div>
    </footer>
  );
}