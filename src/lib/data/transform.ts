import type { Product as PrismaProduct } from '@prisma/client';
import type { Product as ClientProduct } from '@/lib/types';

export function transformProductForClient(
    product: PrismaProduct,
): ClientProduct {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        longDescription: product.longDescription,
        price: product.price,
        discountPrice: product.discountPrice,
        category: product.category,
        images: product.images,
        popularity: product.popularity,
        isFeatured: product.isFeatured,
        isPromo: product.isPromo,
        condition: product.condition,
        mileage: product.mileage,
        fuelType: product.fuelType,
        releaseDate: product.releaseDate,
        createdAt: product.createdAt,
    };
}
