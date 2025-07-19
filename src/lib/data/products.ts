import 'server-only';
import prisma from '@/lib/prisma';
import { transformProductForClient } from '@/lib/data/transform';
import type { Product } from '@/lib/types';
import { unstable_cache } from 'next/cache';

export const getProductById = (id: string): Promise<Product | null> => {
    return unstable_cache(
        async () => {
            const product = await prisma.product.findUnique({
                where: { id },
            });
            if (!product) {
                return null;
            }
            return transformProductForClient(product);
        },
        [`product-by-id-${id}`],
        {
            tags: [`products:${id}`],
            revalidate: 3600,
        },
    )();
};

export const getRelatedProducts = (
    category: string,
    excludeId: string,
): Promise<Product[]> => {
    return unstable_cache(
        async () => {
            const products = await prisma.product.findMany({
                where: {
                    category,
                    id: {
                        not: excludeId,
                    },
                },
                take: 4,
            });
            return products.map(transformProductForClient);
        },
        [`related-products-${category}-${excludeId}`],
        {
            tags: [`products:category:${category}`],
            revalidate: 3600,
        },
    )();
};

export const getAllProductIds = async (): Promise<{ id: string }[]> => {
    const products = await prisma.product.findMany({
        select: {
            id: true,
        },
    });
    return products;
};

export const getPromoProducts = (): Promise<Product[]> => {
    return unstable_cache(
        async () => {
            const products = await prisma.product.findMany({
                where: { isPromo: true },
                take: 10,
            });
            return products.map(transformProductForClient);
        },
        ['promo-products'],
        {
            tags: ['products:promo'],
            revalidate: 3600,
        },
    )();
};

export const getFeaturedProducts = (): Promise<Product[]> => {
    return unstable_cache(
        async () => {
            const products = await prisma.product.findMany({
                where: { isFeatured: true },
                take: 12,
            });
            return products.map(transformProductForClient);
        },
        ['featured-products'],
        {
            tags: ['products:featured'],
            revalidate: 3600,
        },
    )();
};

export const getProductsForAdmin = async (): Promise<Product[]> => {
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return products.map(transformProductForClient);
};

export const getProductsForSettings = async (): Promise<Product[]> => {
    const products = await prisma.product.findMany({
        orderBy: {
            name: 'asc',
        },
    });
    return products.map(transformProductForClient);
};
