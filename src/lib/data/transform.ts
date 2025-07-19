import type { Product as PrismaProduct } from '@prisma/client';
import type { Product } from '@/lib/types';

export function transformProductForClient(product: PrismaProduct): Product {
    return {
        ...product,
        images: product.images ? product.images.split(',') : [],
        discountPrice: product.discountPrice ?? null,
        mileage: product.mileage ?? null,
        fuelType: product.fuelType ?? null,
    };
}
