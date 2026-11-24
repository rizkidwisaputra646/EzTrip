import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(8, "Nomor telepon minimal 8 digit"),
  city: z.string().optional().default("Bandar Lampung"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

export const LoginSchema = z.object({
  emailOrPhone: z.string().min(1, "Email atau nomor HP wajib diisi"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

export const CreateBookingSchema = z.object({
  packageId: z.string(),
  packageName: z.string(),
  packageSubtitle: z.string().optional().default(""),
  packageImage: z.string().optional().default("/assets/images/beach_pahawang.jpg"),
  tierName: z.string().optional().default("Standard Package"),
  scheduleId: z.string().optional(),
  scheduleDate: z.string(),
  departureTime: z.string().optional().default("07:00 WIB"),
  meetingPoint: z.string(),
  guestCount: z.number().int().min(1).max(10),
  leadGuestName: z.string().min(2, "Nama tamu utama minimal 2 karakter"),
  leadGuestPhone: z.string().min(8, "Nomor WhatsApp wajib diisi"),
  leadGuestEmail: z.string().email("Format email tidak valid"),
  leadGuestIdCard: z.string().min(8, "Nomor KTP/Paspor minimal 8 digit"),
  guest2Name: z.string().optional(),
  guest3Name: z.string().optional(),
  guest4Name: z.string().optional(),
  specialNotes: z.string().optional(),
  subtotal: z.number().int().positive(),
  insuranceFee: z.number().int().optional().default(0),
  discount: z.number().int().optional().default(0),
  totalAmount: z.number().int().positive(),
  paymentMethod: z.string(),
  paymentChannel: z.string(),
  outboundSeatNumbers: z.array(z.string()).min(1, "Pilih minimal 1 kursi"),
  returnSeatNumbers: z.array(z.string()).optional(),
  vehicleId: z.string().optional().default("Jetbus 3+ Royal Class"),
});

export const ManualBookingSchema = z.object({
  packageId: z.string(),
  leadGuestName: z.string().min(2),
  leadGuestPhone: z.string().min(8),
  leadGuestEmail: z.string().email().optional(),
  leadGuestIdCard: z.string().optional(),
  scheduleDate: z.string(),
  meetingPoint: z.string().optional(),
  guestCount: z.number().int().min(1),
  totalAmount: z.number().int().positive().optional(),
  paymentMethod: z.string().optional(),
  outboundSeatNumbers: z.array(z.string()).optional(),
  specialNotes: z.string().optional(),
  guest2Name: z.string().optional(),
  guest3Name: z.string().optional(),
  guest4Name: z.string().optional(),
});
