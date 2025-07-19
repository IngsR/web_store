import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getServerSession } from '@/lib/auth.server';
import { uploadImageFromBase64 } from '@/lib/blob-storage';
import { transformProductForClient } from '@/lib/data/transform';
import { productCreateSchema } from '@/lib/schemas/product';

export const dynamic = 'force-dynamic';

/**
 * GET: Mengambil semua produk dari database.
 * Mendukung pemfilteran, pencarian, dan pengurutan untuk halaman produk publik.
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const searchQuery = searchParams.get('q');
        const categories = searchParams.getAll('category');
        const priceMin = searchParams.get('priceMin');
        const priceMax = searchParams.get('priceMax');
        const sortBy = searchParams.get('sortBy') || 'popularity';

        const where: Prisma.ProductWhereInput = {};

        if (searchQuery) {
            where.OR = [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
            ];
        }

        if (categories.length > 0) {
            where.category = { in: categories };
        }

        if (priceMin || priceMax) {
            where.price = {};
            if (priceMin) {
                where.price.gte = Number(priceMin);
            }
            if (priceMax) {
                where.price.lte = Number(priceMax);
            }
        }

        let orderBy: Prisma.ProductOrderByWithRelationInput = {};
        switch (sortBy) {
            case 'price-asc':
                orderBy = { price: 'asc' };
                break;
            case 'price-desc':
                orderBy = { price: 'desc' };
                break;
            case 'newest':
                orderBy = { releaseDate: 'desc' };
                break;
            default: // 'popularity'
                orderBy = { popularity: 'desc' };
                break;
        }

        const products = await prisma.product.findMany({
            where,
            orderBy,
        });

        return NextResponse.json(products.map(transformProductForClient));
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
 * Menerima data dari form, memvalidasi, mengunggah gambar, dan menyimpan ke database.
 */
export async function POST(request: Request) {
    const session = await getServerSession();
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const validation = productCreateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: 'Invalid input',
                    errors: validation.error.flatten(),
                },
                { status: 400 },
            );
        }

        const { images, ...productData } = validation.data;

        const imageUrls = await Promise.all(
            images.map((base64Image) =>
                uploadImageFromBase64(base64Image, 'products'),
            ),
        );

        const newProduct = await prisma.product.create({
            data: {
                ...productData,
                images: imageUrls,
                releaseDate: new Date(),
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
