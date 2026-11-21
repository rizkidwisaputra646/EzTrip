"use client";

import { useEffect, useState } from "react";
import {
  User,
  BookingModel,
  PackageModel,
  UserRole,
  BusFleetModel,
  DepartureScheduleModel,
} from "./types";
import {
  PACKAGES,
  INITIAL_BOOKINGS,
  INITIAL_FLEETS,
  INITIAL_SCHEDULES,
} from "./mock-data";

const USERS_STORAGE_KEY = "eztrip_active_user";
const ALL_USERS_STORAGE_KEY = "eztrip_registered_users";
const BOOKINGS_STORAGE_KEY = "eztrip_bookings";
const FLEETS_STORAGE_KEY = "eztrip_fleets";
const SCHEDULES_STORAGE_KEY = "eztrip_schedules";
const PACKAGES_STORAGE_KEY = "eztrip_packages";

export interface StoredUser extends User {
  password?: string;
}

// =========================================================================
// OFFICIAL PRODUCTION STAFF ACCOUNTS
// =========================================================================
export const OFFICIAL_STAFF_ACCOUNTS: StoredUser[] = [
  {
    id: "usr_admin_001",
    name: "Admin Operasional EZ Trip",
    email: "admin@eztrip.id",
    phone: "0811-9876-5432",
    city: "Bandar Lampung",
    role: "admin",
    password: "AdminEzTrip2026!",
  },
  {
    id: "usr_leader_001",
    name: "Kang Dedi (Tour Leader HPI)",
    email: "pemandu@eztrip.id",
    phone: "0813-9876-5432",
    city: "Pesawaran, Lampung",
    role: "tour_leader",
    password: "PemanduHPI2026!",
  },
];

export function useEzTripStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<StoredUser[]>(OFFICIAL_STAFF_ACCOUNTS);
  const [bookings, setBookings] = useState<BookingModel[]>(INITIAL_BOOKINGS);
  const [fleets, setFleets] = useState<BusFleetModel[]>(INITIAL_FLEETS);
  const [schedules, setSchedules] = useState<DepartureScheduleModel[]>(INITIAL_SCHEDULES);
  const [packagesList, setPackagesList] = useState<PackageModel[]>(PACKAGES);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      // 1. Load registered users
      const savedUsers = localStorage.getItem(ALL_USERS_STORAGE_KEY);
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        const registeredTravelers = parsed.filter(
          (u: StoredUser) => u.role !== "admin" && u.role !== "tour_leader"
        );
        setUsersList([...OFFICIAL_STAFF_ACCOUNTS, ...registeredTravelers]);
      } else {
        localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(OFFICIAL_STAFF_ACCOUNTS));
      }

      // 2. Load active session
      const savedActiveUser = localStorage.getItem(USERS_STORAGE_KEY);
      if (savedActiveUser && savedActiveUser !== "guest") {
        const parsed = JSON.parse(savedActiveUser);
        if (parsed.id === "usr_traveler_001" || parsed.email === "user@eztrip.id") {
          localStorage.removeItem(USERS_STORAGE_KEY);
          setCurrentUser(null);
        } else {
          setCurrentUser(parsed);
        }
      } else {
        setCurrentUser(null);
      }

      // 3. Load bookings
      const savedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      } else {
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
      }

      // 4. Load fleets & seat config
      const savedFleets = localStorage.getItem(FLEETS_STORAGE_KEY);
      if (savedFleets) {
        setFleets(JSON.parse(savedFleets));
      } else {
        localStorage.setItem(FLEETS_STORAGE_KEY, JSON.stringify(INITIAL_FLEETS));
      }

      // 5. Load departure schedules
      const savedSchedules = localStorage.getItem(SCHEDULES_STORAGE_KEY);
      if (savedSchedules) {
        setSchedules(JSON.parse(savedSchedules));
      } else {
        localStorage.setItem(SCHEDULES_STORAGE_KEY, JSON.stringify(INITIAL_SCHEDULES));
      }

      // 6. Load packages & prices
      const savedPackages = localStorage.getItem(PACKAGES_STORAGE_KEY);
      if (savedPackages) {
        setPackagesList(JSON.parse(savedPackages));
      } else {
        localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(PACKAGES));
      }
    } catch (_) {
      // Ignore JSON parse error
    }
    setIsInitialized(true);
  }, []);

  // -------------------------------------------------------------------------
  // AUTH
  // -------------------------------------------------------------------------
  const login = (
    emailOrPhone: string,
    passwordInput: string
  ): { success: boolean; user?: User; message?: string } => {
    const cleanInput = emailOrPhone.trim().toLowerCase();

    // 1. Admin
    if (cleanInput === "admin@eztrip.id" || cleanInput === "admin" || cleanInput === "081198765432") {
      const adminAcc = OFFICIAL_STAFF_ACCOUNTS[0];
      if (passwordInput !== adminAcc.password) {
        return { success: false, message: "Kata sandi Admin salah. Silakan periksa kembali." };
      }
      setCurrentUser(adminAcc);
      if (typeof window !== "undefined") {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(adminAcc));
      }
      return { success: true, user: adminAcc };
    }

    // 2. Tour Leader
    if (
      cleanInput === "pemandu@eztrip.id" ||
      cleanInput === "leader@eztrip.id" ||
      cleanInput === "pemandu" ||
      cleanInput === "081398765432"
    ) {
      const leaderAcc = OFFICIAL_STAFF_ACCOUNTS[1];
      if (passwordInput !== leaderAcc.password) {
        return { success: false, message: "Kata sandi Pemandu salah. Silakan periksa kembali." };
      }
      setCurrentUser(leaderAcc);
      if (typeof window !== "undefined") {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(leaderAcc));
      }
      return { success: true, user: leaderAcc };
    }

    // 3. Registered Traveler
    const foundUser = usersList.find(
      (u) =>
        u.email.toLowerCase() === cleanInput ||
        u.phone.replace(/\D/g, "") === cleanInput.replace(/\D/g, "")
    );

    if (foundUser) {
      if (foundUser.password && foundUser.password !== passwordInput) {
        return { success: false, message: "Kata sandi yang Anda masukkan salah." };
      }
      setCurrentUser(foundUser);
      if (typeof window !== "undefined") {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(foundUser));
      }
      return { success: true, user: foundUser };
    }

    // Fallback registration if password matches length requirements
    if (passwordInput && passwordInput.length >= 6) {
      const newTraveler: StoredUser = {
        id: `usr_${Date.now()}`,
        name: cleanInput.includes("@") ? cleanInput.split("@")[0] : `Traveler ${cleanInput.slice(-4)}`,
        email: cleanInput.includes("@") ? cleanInput : `${cleanInput}@eztrip.id`,
        phone: cleanInput.includes("@") ? "0812-3456-7890" : cleanInput,
        city: "Bandar Lampung",
        role: "traveler",
        password: passwordInput,
      };

      const updatedUsers = [...usersList, newTraveler];
      setUsersList(updatedUsers);
      setCurrentUser(newTraveler);

      if (typeof window !== "undefined") {
        localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newTraveler));
      }

      return { success: true, user: newTraveler };
    }

    return {
      success: false,
      message: "Akun belum terdaftar. Silakan lakukan pendaftaran akun baru.",
    };
  };

  const register = (newUser: Omit<User, "id"> & { password?: string }): User => {
    const createdUser: StoredUser = {
      ...newUser,
      id: `usr_${Date.now()}`,
      role: "traveler",
    };

    const updatedList = [...usersList, createdUser];
    setUsersList(updatedList);
    setCurrentUser(createdUser);

    if (typeof window !== "undefined") {
      localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(updatedList));
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(createdUser));
    }

    return createdUser;
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== "undefined") {
      localStorage.setItem(USERS_STORAGE_KEY, "guest");
    }
  };

  // -------------------------------------------------------------------------
  // BOOKINGS & ATTENDANCE
  // -------------------------------------------------------------------------
  const addBooking = (newBooking: BookingModel) => {
    setBookings((prev) => {
      const updated = [newBooking, ...prev.filter((b) => b.bookingCode !== newBooking.bookingCode)];
      if (typeof window !== "undefined") {
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateBookingStatus = (bookingCode: string, status: BookingModel["status"]) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.bookingCode === bookingCode ? { ...b, status } : b));
      if (typeof window !== "undefined") {
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const toggleCheckIn = (bookingCode: string) => {
    setBookings((prev) => {
      const updated = prev.map((b) => {
        if (b.bookingCode === bookingCode) {
          const nextCheckIn = !b.isCheckedIn;
          return {
            ...b,
            isCheckedIn: nextCheckIn,
            checkedInAt: nextCheckIn ? new Date().toISOString() : undefined,
            checkedInBy: nextCheckIn ? (currentUser?.name || "Tour Leader") : undefined,
          };
        }
        return b;
      });
      if (typeof window !== "undefined") {
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // -------------------------------------------------------------------------
  // CAPABILITY 1: SEAT BLOCKER & FLEET QUOTA (RED BUS STYLE)
  // -------------------------------------------------------------------------
  const toggleSeatLock = (busId: string, seatNumber: string) => {
    setFleets((prev) => {
      const updated = prev.map((f) => {
        if (f.id === busId) {
          const isLocked = f.lockedSeats.includes(seatNumber);
          const newLocked = isLocked
            ? f.lockedSeats.filter((s) => s !== seatNumber)
            : [...f.lockedSeats, seatNumber].sort();
          return { ...f, lockedSeats: newLocked };
        }
        return f;
      });
      if (typeof window !== "undefined") {
        localStorage.setItem(FLEETS_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateFleetQuota = (busId: string, newQuota: number) => {
    const quota = Math.max(10, Math.min(45, newQuota));
    setFleets((prev) => {
      const updated = prev.map((f) => (f.id === busId ? { ...f, totalQuota: quota } : f));
      if (typeof window !== "undefined") {
        localStorage.setItem(FLEETS_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // -------------------------------------------------------------------------
  // CAPABILITY 2: KELOLA JADWAL & HARGA TRIP (TRAVELOKA STYLE)
  // -------------------------------------------------------------------------
  const addSchedule = (newSch: Omit<DepartureScheduleModel, "id">) => {
    const sch: DepartureScheduleModel = {
      ...newSch,
      id: `sch_${Date.now()}`,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    setSchedules((prev) => {
      const updated = [...prev, sch];
      if (typeof window !== "undefined") {
        localStorage.setItem(SCHEDULES_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteSchedule = (scheduleId: string) => {
    setSchedules((prev) => {
      const updated = prev.filter((s) => s.id !== scheduleId);
      if (typeof window !== "undefined") {
        localStorage.setItem(SCHEDULES_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updatePackagePrice = (packageId: string, newPrice: number) => {
    const price = Math.max(100000, newPrice);
    setPackagesList((prev) => {
      const updated = prev.map((p) => {
        if (p.id === packageId) {
          return {
            ...p,
            price,
            priceFormatted: `Rp ${price.toLocaleString("id-ID")}`,
          };
        }
        return p;
      });
      if (typeof window !== "undefined") {
        localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // -------------------------------------------------------------------------
  // CAPABILITY 3: RESCHEDULE & MANUAL BOOKING (OFFLINE / CASH)
  // -------------------------------------------------------------------------
  const rescheduleBooking = (
    bookingCode: string,
    newScheduleDate: string,
    newSeats?: string[]
  ): { success: boolean; message: string } => {
    let success = false;
    setBookings((prev) => {
      const updated = prev.map((b) => {
        if (b.bookingCode === bookingCode) {
          success = true;
          return {
            ...b,
            scheduleDate: newScheduleDate,
            outboundSeatNumbers: newSeats && newSeats.length > 0 ? newSeats : b.outboundSeatNumbers,
            returnSeatNumbers: newSeats && newSeats.length > 0 ? newSeats : b.returnSeatNumbers,
            specialNotes: `${b.specialNotes ? b.specialNotes + " • " : ""}Rescheduled ke ${newScheduleDate} oleh Admin`,
          };
        }
        return b;
      });
      if (typeof window !== "undefined") {
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });

    return {
      success,
      message: success
        ? `Jadwal pesanan ${bookingCode} berhasil dialihkan ke ${newScheduleDate}.`
        : `Pesanan ${bookingCode} tidak ditemukan.`,
    };
  };

  const createManualBooking = (
    payload: Partial<BookingModel> & { leadGuestName: string; leadGuestPhone: string; packageId: string }
  ): { success: boolean; bookingCode: string; message: string } => {
    const targetPkg = packagesList.find((p) => p.id === payload.packageId) || packagesList[0];
    const guestCount = payload.guestCount || 1;
    const totalAmount = payload.totalAmount || targetPkg.price * guestCount;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const bookingCode = `EZTRIP-MANUAL-${randomSuffix}`;

    const newBooking: BookingModel = {
      bookingCode,
      userId: `usr_walkin_${Date.now()}`,
      packageId: targetPkg.id,
      packageName: targetPkg.title,
      packageSubtitle: targetPkg.subtitle,
      packageImage: targetPkg.imagePath,
      tierName: "All-Inclusive Package (Kantor)",
      scheduleDate: payload.scheduleDate || "18 - 20 Okt 2026",
      departureTime: "07:00 WIB",
      meetingPoint: payload.meetingPoint || "Stasiun Tanjung Karang (TKG)",
      guestCount,
      leadGuestName: payload.leadGuestName,
      leadGuestPhone: payload.leadGuestPhone,
      leadGuestEmail: payload.leadGuestEmail || `${payload.leadGuestName.toLowerCase().replace(/\s+/g, "")}@customer.eztrip.id`,
      leadGuestIdCard: payload.leadGuestIdCard || "1871000000000000",
      guest2Name: payload.guest2Name,
      guest3Name: payload.guest3Name,
      guest4Name: payload.guest4Name,
      specialNotes: payload.specialNotes || "Reservasi Manual Staf Kantor (Pembayaran Tunai / Transfer Langsung)",
      subtotal: totalAmount,
      insuranceFee: 0,
      discount: 0,
      totalAmount,
      paymentMethod: payload.paymentMethod || "Tunai di Kantor (Cash)",
      paymentChannel: "permata_va",
      status: "Terkonfirmasi",
      tourLeaderName: "Kang Dedi",
      tourLeaderPhone: "0813-9876-5432",
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      midtransOrderId: bookingCode,
      outboundSeatNumbers: payload.outboundSeatNumbers || ["17"],
      returnSeatNumbers: payload.outboundSeatNumbers || ["17"],
      vehicleId: "Jetbus 3+ Royal Class",
      isCheckedIn: false,
    };

    addBooking(newBooking);

    return {
      success: true,
      bookingCode,
      message: `Tiket manual ${bookingCode} untuk ${payload.leadGuestName} berhasil diterbitkan (Status: Lunas).`,
    };
  };

  const confirmedBookings = bookings.filter((b) => b.status === "Terkonfirmasi");
  const pendingBookings = bookings.filter((b) => b.status === "Menunggu Pembayaran");
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);

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
  };
}
