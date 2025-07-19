import 'server-only';
import { cache } from 'react';
import prisma from '@/lib/prisma';
import { transformProductForClient } from '@/lib/data/transform';
import type { Product } from '@/lib/types';

// Using React `cache` for automatic request deduplication within a render pass.
// This is the recommended, stable approach for Server Components.

export const getProductById = cache(
    async (id: string): Promise<Product | null> => {
        if (!id) return null;
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) return null;
        return transformProductForClient(product);
    },
);

export const getRelatedProducts = cache(
    async (category: string, excludeId: string): Promise<Product[]> => {
        const products = await prisma.product.findMany({
            where: { category, id: { not: excludeId } },
            take: 4,
            orderBy: { popularity: 'desc' },
        });
        return products.map(transformProductForClient);
    },
);

export const getAllProductIds = cache(async (): Promise<{ id: string }[]> => {
    return prisma.product.findMany({ select: { id: true } });
});

export const getPromoProducts = cache(async (): Promise<Product[]> => {
    const products = await prisma.product.findMany({
        where: { isPromo: true },
        take: 10,
        orderBy: { popularity: 'desc' },
    });
    return products.map(transformProductForClient);
});

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
    const products = await prisma.product.findMany({
        where: { isFeatured: true },
        take: 12,
        orderBy: { popularity: 'desc' },
    });
    return products.map(transformProductForClient);
});

// These functions are for the admin dashboard and don't need caching
// as they should always show the freshest data.
export async function getProductsForAdmin(): Promise<Product[]> {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return products.map(transformProductForClient);
}

export async function getProductsForSettings(): Promise<Product[]> {
    const products = await prisma.product.findMany({
        orderBy: { name: 'asc' },
    });
    return products.map(transformProductForClient);
}
