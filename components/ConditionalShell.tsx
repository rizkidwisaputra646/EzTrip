"use client";

import { usePathname } from "next/navigation";
import LandingNavbar from "./LandingNavbar";
import UserNavbar from "./UserNavbar";
import Footer from "./Footer";
import UserFooter from "./UserFooter";

export default function ConditionalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 1. Standalone Modern Professional Portals & Auth Screens
  // Admin, Tour Leader, and Traveler Dashboard have their own dedicated Modern Professional Sidebar & Header
  const isDedicatedStandalone =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/tour-leader") ||
    pathname.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register";

  if (isDedicatedStandalone) {
    return <div className="flex-1 flex flex-col">{children}</div>;
  }

  // 2. Authenticated Traveler Sub-pages (e.g. standalone /my-tickets)
  const isTravelerSubpage = pathname.startsWith("/my-tickets");

  if (isTravelerSubpage) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-[#F4F7FE]">
        <UserNavbar />
        <main className="flex-1">{children}</main>
        <UserFooter />
      </div>
    );
  }

  // 3. Public Marketing Landing Page & Booking Funnel
  // Dedicated LandingNavbar with anchor links & Full Footer
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50">
      <LandingNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
