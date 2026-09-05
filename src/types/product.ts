import type { Condition, FuelType } from '@prisma/client';

export type { Condition, FuelType };

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
