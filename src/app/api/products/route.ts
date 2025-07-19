import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from '@/lib/auth.server';
import { productCreateApiSchema } from '@/lib/schemas/product';
import { uploadImageFromBase64 } from '@/lib/blob-storage';
import { transformProductForClient } from '@/lib/data/transform';

export const dynamic = 'force-dynamic';

/**
 * GET: Mengambil semua produk untuk halaman admin.
 * Endpoint ini diamankan agar hanya bisa diakses oleh admin.
 */
export async function GET(request: Request) {
    const session = await getServerSession();
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: 'desc',
            },
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
