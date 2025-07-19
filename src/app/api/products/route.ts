import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from '@/lib/auth.server';
import type { Prisma } from '@prisma/client';
import { productCreateApiSchema } from '@/lib/schemas/product';
import { uploadImageFromBase64 } from '@/lib/blob-storage';
import { transformProductForClient } from '@/lib/data/transform';

export const dynamic = 'force-dynamic';

/**
 * GET: Mengambil produk dengan filter, sorting, dan pencarian.
 * Endpoint ini bersifat publik.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const categories = searchParams.getAll('category');
    const priceMin = Number(searchParams.get('priceMin')) || 0;
    const priceMax =
        Number(searchParams.get('priceMax')) || Number.MAX_SAFE_INTEGER;
    const sortBy = searchParams.get('sortBy') || 'popularity';

    try {
        const where: Prisma.ProductWhereInput = {
            AND: [],
        };

        if (q) {
            (where.AND as Prisma.ProductWhereInput[]).push({
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } },
                ],
            });
        }

        if (categories.length > 0) {
            (where.AND as Prisma.ProductWhereInput[]).push({
                category: { in: categories },
            });
        }

        // Filter berdasarkan harga, mempertimbangkan harga normal dan harga diskon
        (where.AND as Prisma.ProductWhereInput[]).push({
            OR: [
                {
                    discountPrice: {
                        gte: priceMin,
                        lte: priceMax,
                    },
                },
                {
                    AND: [
                        { discountPrice: null },
                        { price: { gte: priceMin, lte: priceMax } },
                    ],
                },
            ],
        });

        let orderBy: Prisma.ProductOrderByWithRelationInput = {};
        switch (sortBy) {
            case 'price-asc':
                orderBy = { price: 'asc' };
                break;
            case 'price-desc':
                orderBy = { price: 'desc' };
                break;
            case 'newest':
                orderBy = { createdAt: 'desc' };
                break;
            case 'popularity':
            default:
                orderBy = { popularity: 'desc' };
                break;
        }

        const products = await prisma.product.findMany({
            where,
            orderBy,
        });

        const clientSafeProducts = products.map(transformProductForClient);
        return NextResponse.json(clientSafeProducts);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}

/**
 * POST: Membuat produk baru.
 */
export async function POST(request: Request) {
    const session = await getServerSession();
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const validation = productCreateApiSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: 'Input tidak valid',
                    errors: validation.error.flatten(),
                },
                { status: 400 },
            );
        }

        const { images, ...productData } = validation.data;

        const imageUrls = await Promise.all(
            images.map((base64Image: string) =>
                uploadImageFromBase64(base64Image, 'products'),
            ),
        );

        const newProduct = await prisma.product.create({
            data: {
                ...productData,
                images: imageUrls,
                releaseDate: new Date(), // Fulfill the required field
            },
        });

        const clientSafeProduct = transformProductForClient(newProduct);
        return NextResponse.json(clientSafeProduct, { status: 201 });
    } catch (error) {
        console.error('Failed to create product:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
