export type UserRole = "traveler" | "admin" | "tour_leader";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: UserRole;
  avatarUrl?: string;
}

export type SeatStatus = "available" | "booked" | "crew_locked" | "maintenance";

export interface BusSeatConfig {
  seatNumber: string;
  status: SeatStatus;
  lockedReason?: string;
  assignedGuestName?: string;
}

export interface BusFleetModel {
  id: string;
  name: string;
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  tourLeaderName: string;
  packageId: string;
  totalQuota: number;
  lockedSeats: string[]; // e.g. ["01", "02"]
}

export interface DepartureScheduleModel {
  id: string;
  packageId?: string;
  range: string;
  label: string;
  status: "Tersedia" | "Sisa 4 Kursi" | "Penuh" | "Ditutup";
  seatsAvailable: number;
  maxSeats: number;
  badgeColor?: string;
}

export interface PackageTier {
  name: string;
  price: number;
  priceFormatted: string;
  badge: string;
  perks: string[];
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  activities: string;
}

export interface PackageModel {
  id: string;
  title: string;
  subtitle: string;
  category: "Beach & Island" | "Wildlife Safari" | "Culture & Culinary";
  duration: string;
  departureSchedule: string;
  departureHub: string;
  price: number;
  priceFormatted: string;
  rating: number;
  reviewCount: number;
  imagePath: string;
  badgeText?: string;
  tripType: string;
  description: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  tiers: PackageTier[];
  availableSeats: number;
  isDeparting: boolean;
}

export type PaymentChannel =
  | "qris"
  | "bca_va"
  | "bri_va"
  | "bni_va"
  | "permata_va"
  | "mandiri_va"
  | "gopay";

export interface BookingModel {
  bookingCode: string;
  userId: string;
  packageId: string;
  packageName: string;
  packageSubtitle: string;
  packageImage: string;
  tierName: string;
  scheduleDate: string;
  departureTime: string;
  meetingPoint: string;
  guestCount: number;
  leadGuestName: string;
  leadGuestPhone: string;
  leadGuestEmail: string;
  leadGuestIdCard: string;
  guest2Name?: string;
  guest3Name?: string;
  guest4Name?: string;
  specialNotes?: string;
  subtotal: number;
  insuranceFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentChannel: PaymentChannel;
  status: "Menunggu Pembayaran" | "Terkonfirmasi" | "Kedaluwarsa" | "Dibatalkan";
  tourLeaderName: string;
  tourLeaderPhone: string;
  createdAt: string;
  midtransOrderId: string;
  outboundSeatNumbers: string[];
  returnSeatNumbers: string[];
  vehicleId: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
  checkedInBy?: string;
  // Midtrans details
  vaNumber?: string;
  bank?: string;
  billerCode?: string;
  billKey?: string;
  qrString?: string;
  qrCodeUrl?: string;
  expiryTime?: string;
}
