import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from '@/lib/auth.server';
import { uploadImageFromBase64 } from '@/lib/blob-storage';
import { transformProductForClient } from '@/lib/data/transform';
import { productCreateSchema } from '@/lib/schemas/product';

export const dynamic = 'force-dynamic';

/**
 * GET: Mengambil semua produk dari database.
 * Digunakan oleh halaman dashboard admin untuk menampilkan daftar produk.
 */
export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: 'desc',
            },
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
                // Gabungkan array URL menjadi satu string, karena skema DB adalah String
                images: imageUrls.join(','),
                releaseDate: new Date(),
            },
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Failed to create product:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
