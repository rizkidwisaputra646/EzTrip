"use client";

import { useEffect, useState, useCallback } from "react";
import {
  User,
  BookingModel,
  PackageModel,
  BusFleetModel,
  DepartureScheduleModel,
} from "./types";

export function useEzTripStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<BookingModel[]>([]);
  const [fleets, setFleets] = useState<BusFleetModel[]>([]);
  const [schedules, setSchedules] = useState<DepartureScheduleModel[]>([]);
  const [packagesList, setPackagesList] = useState<PackageModel[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // FETCH FROM POSTGRESQL API
  // -------------------------------------------------------------------------
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch Session
      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.user) {
            setCurrentUser(meData.user);
          }
        }
      } catch (e) {
        console.warn("Auth check failed:", e);
      }

      // 2. Fetch Packages, Schedules, Fleets, Bookings in parallel
      const [pkgRes, schRes, fleetRes, bookRes] = await Promise.all([
        fetch("/api/packages"),
        fetch("/api/schedules"),
        fetch("/api/fleets"),
        fetch("/api/bookings"),
      ]);

      if (pkgRes.ok) {
        const pkgData = await pkgRes.json();
        if (pkgData.data) {
          setPackagesList(
            pkgData.data.map((p: any) => ({
              ...p,
              priceFormatted: `Rp ${Number(p.price).toLocaleString("id-ID")}`,
            }))
          );
        }
      }

      if (schRes.ok) {
        const schData = await schRes.json();
        if (schData.data) setSchedules(schData.data);
      }

      if (fleetRes.ok) {
        const fleetData = await fleetRes.json();
        if (fleetData.data) setFleets(fleetData.data);
      }

      if (bookRes.ok) {
        const bookData = await bookRes.json();
        if (bookData.data) setBookings(bookData.data);
      }
    } catch (err: any) {
      console.error("Gagal memuat data dari database PostgreSQL:", err);
      setError("Gagal memuat data dari database server. Silakan muat ulang halaman.");
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // -------------------------------------------------------------------------
  // AUTH (POSTGRESQL + BCRYPT)
  // -------------------------------------------------------------------------
  const login = async (
    emailOrPhone: string,
    passwordInput: string
  ): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone, password: passwordInput }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.error || "Gagal melakukan login" };
      }

      setCurrentUser(data.user);
      await fetchAllData();
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, message: "Koneksi ke database server gagal." };
    }
  };

  const register = async (
    newUser: Omit<User, "id"> & { password?: string }
  ): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.error || "Gagal melakukan pendaftaran" };
      }

      setCurrentUser(data.user);
      await fetchAllData();
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, message: "Koneksi ke database server gagal." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (_) {}
    setCurrentUser(null);
  };

  // -------------------------------------------------------------------------
  // BOOKINGS & ATTENDANCE (PERSISTED TO POSTGRESQL)
  // -------------------------------------------------------------------------
  const addBooking = async (newBooking: any) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooking),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setBookings((prev) => [data.data, ...prev]);
        }
      }
    } catch (err) {
      console.error("addBooking error:", err);
    }
  };

  const updateBookingStatus = async (bookingCode: string, status: BookingModel["status"]) => {
    try {
      const res = await fetch(`/api/bookings/${bookingCode}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.bookingCode === bookingCode ? { ...b, status } : b))
        );
      }
    } catch (err) {
      console.error("updateBookingStatus error:", err);
    }
  };

  const toggleCheckIn = async (bookingCode: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingCode}/checkin`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setBookings((prev) =>
            prev.map((b) => (b.bookingCode === bookingCode ? { ...b, ...data.data } : b))
          );
        }
      }
    } catch (err) {
      console.error("toggleCheckIn error:", err);
    }
  };

  // -------------------------------------------------------------------------
  // CAPABILITY 1: SEAT BLOCKER & FLEET QUOTA
  // -------------------------------------------------------------------------
  const toggleSeatLock = async (busId: string, seatNumber: string) => {
    try {
      const res = await fetch(`/api/fleets/${busId}/lock-seat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatNumber }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setFleets((prev) => prev.map((f) => (f.id === busId ? data.data : f)));
        }
      }
    } catch (err) {
      console.error("toggleSeatLock error:", err);
    }
  };

  const updateFleetQuota = async (busId: string, newQuota: number) => {
    try {
      const res = await fetch(`/api/fleets/${busId}/quota`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalQuota: newQuota }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setFleets((prev) => prev.map((f) => (f.id === busId ? data.data : f)));
        }
      }
    } catch (err) {
      console.error("updateFleetQuota error:", err);
    }
  };

  // -------------------------------------------------------------------------
  // CAPABILITY 2: KELOLA JADWAL & HARGA TRIP
  // -------------------------------------------------------------------------
  const addSchedule = async (newSch: Omit<DepartureScheduleModel, "id">) => {
    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSch),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setSchedules((prev) => [...prev, data.data]);
        }
      }
    } catch (err) {
      console.error("addSchedule error:", err);
    }
  };

  const deleteSchedule = async (scheduleId: string) => {
    try {
      const res = await fetch(`/api/schedules/${scheduleId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
      }
    } catch (err) {
      console.error("deleteSchedule error:", err);
    }
  };

  const updatePackagePrice = async (packageId: string, newPrice: number) => {
    try {
      const res = await fetch(`/api/packages/${packageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: newPrice }),
      });

      if (res.ok) {
        setPackagesList((prev) =>
          prev.map((p) =>
            p.id === packageId
              ? {
                  ...p,
                  price: newPrice,
                  priceFormatted: `Rp ${Number(newPrice).toLocaleString("id-ID")}`,
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error("updatePackagePrice error:", err);
    }
  };

  // -------------------------------------------------------------------------
  // CAPABILITY 3: RESCHEDULE & MANUAL BOOKING (OFFLINE / CASH)
  // -------------------------------------------------------------------------
  const rescheduleBooking = async (
    bookingCode: string,
    newScheduleDate: string,
    newSeats?: string[]
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/bookings/${bookingCode}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newScheduleDate, newSeats }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await fetchAllData();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || "Gagal me-reschedule tiket" };
    } catch (err: any) {
      return { success: false, message: "Koneksi database gagal." };
    }
  };

  const createManualBooking = async (
    payload: any
  ): Promise<{ success: boolean; bookingCode: string; message: string }> => {
    try {
      const res = await fetch("/api/bookings/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await fetchAllData();
        return {
          success: true,
          bookingCode: data.bookingCode,
          message: data.message,
        };
      }
      return {
        success: false,
        bookingCode: "",
        message: data.error || "Gagal menerbitkan tiket manual",
      };
    } catch (err: any) {
      return {
        success: false,
        bookingCode: "",
        message: "Koneksi database gagal.",
      };
    }
  };

  const confirmedBookings = bookings.filter((b) => b.status === "Terkonfirmasi");
  const pendingBookings = bookings.filter((b) => b.status === "Menunggu Pembayaran");
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

  return {
    currentUser,
    isLoggedIn: !!currentUser,
    login,
    register,
    logout,
    packages: packagesList,
    fleets,
    schedules,
    bookings,
    confirmedBookings,
    pendingBookings,
    totalRevenue,
    addBooking,
    updateBookingStatus,
    toggleCheckIn,
    toggleSeatLock,
    updateFleetQuota,
    addSchedule,
    deleteSchedule,
    updatePackagePrice,
    rescheduleBooking,
    createManualBooking,
    isInitialized,
    isLoading,
    error,
    refreshData: fetchAllData,
  };
}
