import type { Condition, FuelType } from "@prisma/client";

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  discountPrice: number | null;
  category: string;
  images: string[];
  popularity: number;
  isFeatured: boolean;
  isPromo: boolean;

  condition: Condition;
  mileage: number | null;
  fuelType: FuelType | null;
  releaseDate: Date;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string | null;
}

export type OrderStatus = "BARU" | "DIHUBUNGI" | "DEAL" | "SELESAI" | "BATAL";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images?: string[];
  condition?: string;
  category?: string;
}

export interface SalesPerson {
  id: string;
  employeeId: string; // NIK / Nomor Induk Karyawan ERP
  name: string;
  phone: string;
  email: string;
  title: string;
  status: "ACTIVE" | "INACTIVE";
  assignedLeadsCount: number;
  lastAssignedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string; // Nomor Pemesanan / Order ID e.g. "ORD-202609-001"
  customerName: string;
  customerNik?: string; // Nomor KTP / NIK Pemesan Mobil
  customerPhone: string;
  customerEmail: string;
  customerCity: string;
  customerAddress: string;
  paymentMethod: "CASH" | "KREDIT";
  notes?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  // Sales Assignment (Round Robin)
  assignedSalesId?: string;
  assignedSalesName?: string;
  assignedSalesPhone?: string;
  assignedSalesEmployeeId?: string;
  assignedAt?: string;
  forwardedToSalesAt?: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
