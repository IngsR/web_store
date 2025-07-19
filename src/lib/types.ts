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
