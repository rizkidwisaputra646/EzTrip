"use client";

import Link from "next/link";
import { MessageCircle, Shield, MapPin, Phone } from "lucide-react";

export default function UserFooter() {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-6 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Security and Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
            <Shield className="w-4 h-4 text-brand-azure" />
            <span>Portal Resmi Wisatawan EZ Trip</span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="text-slate-400">Lisensi HPI Lampung No. 18.01.2024.089</span>
        </div>

        {/* Right: Operational contacts */}
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Hub Tanjung Karang, Bandar Lampung
          </span>
          <a
            href="https://wa.me/6281398765432"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Hotline 24 Jam (+62 813-9876-5432)</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
