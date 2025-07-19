import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from '@/lib/auth.server';
import { productUpdateApiSchema } from '@/lib/schemas/product';
import { deleteImage, uploadImageFromBase64 } from '@/lib/blob-storage';
import { transformProductForClient } from '@/lib/data/transform';

export const dynamic = 'force-dynamic';

/**
 * GET: Mengambil data satu produk berdasarkan ID.
 */
export async function GET(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: params.id },
        });

        if (!product) {
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 },
            );
        }

        const clientSafeProduct = transformProductForClient(product);
        return NextResponse.json(clientSafeProduct);
    } catch (error) {
        console.error(`Failed to fetch product ${params.id}:`, error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}

/**
 * Helper untuk menangani pembaruan gambar:
 * - Menghapus gambar lama yang tidak lagi ada di daftar baru.
 * - Mengunggah gambar baru (base64).
 * - Mengembalikan daftar URL gambar final.
 */
async function handleImageUpdates(
    oldImageUrls: string[],
    newImageSources: (string | undefined)[] | undefined,
): Promise<string[]> {
    const newImages = Array.isArray(newImageSources) ? newImageSources : [];

    // Pisahkan mana gambar yang dipertahankan (URL lama) dan mana yang baru (base64)
    const keptImageUrls = newImages.filter(
        (src): src is string =>
            typeof src === 'string' && src.startsWith('http'),
    );
    const imagesToUpload = newImages.filter(
        (src): src is string =>
            typeof src === 'string' && src.startsWith('data:image'),
    );

    // Tentukan gambar mana yang harus dihapus dari blob storage
    const imagesToDelete = oldImageUrls.filter(
        (url) => !keptImageUrls.includes(url),
    );

    // Lakukan operasi upload dan delete secara paralel
    const [uploadedImageUrls] = await Promise.all([
        Promise.all(
            imagesToUpload.map((base64) =>
                uploadImageFromBase64(base64, 'products'),
            ),
        ),
        Promise.all(imagesToDelete.map(deleteImage)),
    ]);

    return [...keptImageUrls, ...uploadedImageUrls];
}

/**
 * PUT: Memperbarui produk yang ada.
 */
export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    const session = await getServerSession();
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const validation = productUpdateApiSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: 'Invalid input',
                    errors: validation.error.flatten(),
                },
                { status: 400 },
            );
        }

        const { images: newImageSources, ...productData } = validation.data;

        const existingProduct = await prisma.product.findUnique({
            where: { id: params.id },
            select: { images: true },
        });

        if (!existingProduct) {
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 },
            );
        }

        // Buat objek data untuk pembaruan
        const dataToUpdate: import('@prisma/client').Prisma.ProductUpdateInput =
            {
                ...productData,
            };

        // Hanya proses gambar jika ada di dalam request
        if (newImageSources !== undefined) {
            const finalImageUrls = await handleImageUpdates(
                existingProduct.images,
                newImageSources,
            );
            dataToUpdate.images = finalImageUrls;
        }

        const updatedProduct = await prisma.product.update({
            where: { id: params.id },
            data: dataToUpdate,
        });

        return NextResponse.json(transformProductForClient(updatedProduct));
    } catch (error) {
        console.error(`Failed to update product ${params.id}:`, error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}

/**
 * DELETE: Menghapus produk.
 */
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } },
) {
    const session = await getServerSession();
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id: params.id },
        });

        if (product?.images?.length) {
            await Promise.all(product.images.map(deleteImage));
        }

        await prisma.product.delete({ where: { id: params.id } });

        return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
        console.error(`Failed to delete product ${params.id}:`, error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
