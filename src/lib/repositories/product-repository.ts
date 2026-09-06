import 'server-only';
import { cache } from 'react';
import prisma from '@/lib/database/prisma';
import { transformProductForClient } from '@/lib/repositories/transform';
import type { Product } from '@/types/product';

// Menggunakan React `cache` untuk request deduplication otomatis pada Server Components
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
    try {
        let products = await prisma.product.findMany({
            where: { isPromo: true },
            take: 10,
            orderBy: { popularity: 'desc' },
        });

        if (products.length === 0) {
            products = await prisma.product.findMany({
                where: {
                    discountPrice: {
                        gt: 0,
                    },
                },
                take: 10,
                orderBy: { popularity: 'desc' },
            });
        }

        return products.map(transformProductForClient);
    } catch (error) {
        console.error('Database error in getPromoProducts:', error);
        return [];
    }
});

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
    try {
        let products = await prisma.product.findMany({
            where: { isFeatured: true },
            take: 12,
            orderBy: { popularity: 'desc' },
        });

        // Fallback cerdas: Jika belum ada produk yang ditandai unggulan (isFeatured),
        // tampilkan produk terbaru/populer agar bagian Koleksi Terkini / Produk Unggulan tetap terisi.
        if (products.length === 0) {
            products = await prisma.product.findMany({
                take: 12,
                orderBy: [
                    { popularity: 'desc' },
                    { createdAt: 'desc' },
                ],
            });
        }

        return products.map(transformProductForClient);
    } catch (error) {
        console.error('Database error in getFeaturedProducts:', error);
        return [];
    }
});

// Fungsi untuk admin dashboard (selalu menyajikan data teranyar tanpa request-level cache)
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
