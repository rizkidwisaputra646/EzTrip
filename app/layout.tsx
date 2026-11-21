import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ConditionalShell from "@/components/ConditionalShell";

export const metadata: Metadata = {
  title: "EZ Trip Lampung - Reservasi Wisata Akhir Pekan 3D2N",
  description:
    "Jelajahi surga wisata Lampung akhir pekan ini bersama EZ Trip. Open trip Pahawang, Kiluan, Way Kambas & Menara Siger dengan jaminan pasti berangkat dan pembayaran online otomatis.",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-[100dvh] antialiased bg-slate-50 text-brand-navy">
        <ConditionalShell>{children}</ConditionalShell>

        {/* Official Midtrans Snap JS for Web Modal Popup */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-xWl9iYg0XhQeS38cSt-76t6I"}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
