import type { Condition, FuelType } from '@prisma/client';

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

export type OrderStatus = 'BARU' | 'DIHUBUNGI' | 'DEAL' | 'SELESAI' | 'BATAL';

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    images?: string[];
    condition?: string;
    category?: string;
}

export interface Order {
    id: string; // SPK number e.g. "SPK-2026-0901"
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    customerCity: string;
    customerAddress: string;
    paymentMethod: 'CASH' | 'KREDIT';
    notes?: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
}
