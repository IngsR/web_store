import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getServerSession } from '@/lib/auth.server';
import { productUpdateSchema } from '@/lib/schemas/product';
import { deleteImage, uploadImageFromBase64 } from '@/lib/blob-storage';
import { transformProductForClient } from '@/lib/data/transform';

export const dynamic = 'force-dynamic';

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
 * Menangani pembaruan gambar: menghapus gambar lama yang tidak digunakan,
 * mengunggah gambar baru, dan mengembalikan daftar URL gambar final.
 * @param oldImageUrls - Array URL gambar yang ada saat ini.
 * @param newImageSources - Array sumber gambar baru (URL atau base64).
 * @returns Daftar URL gambar yang sudah diperbarui.
 */
async function handleImageUpdates(
    oldImageUrls: string[],
    newImageSources: (string | undefined)[] | undefined,
): Promise<string[]> {
    const newImages = Array.isArray(newImageSources) ? newImageSources : [];

    const keptImageUrls = newImages.filter(
        (src): src is string =>
            typeof src === 'string' && src.startsWith('http'),
    );

    const imagesToDelete = oldImageUrls.filter(
        (url) => !keptImageUrls.includes(url),
    );

    const imagesToUpload = newImages.filter(
        (src): src is string =>
            typeof src === 'string' && src.startsWith('data:image'),
    );

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

export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const validation = productUpdateSchema.safeParse(body);

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

        const finalImageUrls = await handleImageUpdates(
            existingProduct.images || [],
            newImageSources,
        );

        const updatedProduct = await prisma.product.update({
            where: { id: params.id },
            data: {
                ...productData,

                images: finalImageUrls,
            },
        });

        const clientSafeProductResponse =
            transformProductForClient(updatedProduct);
        return NextResponse.json(clientSafeProductResponse);
    } catch (error) {
        console.error('Failed to update product:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } },
) {
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const productToDelete = await prisma.product.findUnique({
            where: { id: params.id },
            select: { images: true },
        });

        if (!productToDelete) {
            return new NextResponse(null, { status: 204 });
        }

        if (productToDelete.images && productToDelete.images.length > 0) {
            try {
                await Promise.all(productToDelete.images.map(deleteImage));
            } catch (imageError) {
                console.error(
                    `Could not delete all images for product ${params.id}. Proceeding with DB deletion.`,
                    imageError,
                );
            }
        }

        await prisma.product.delete({ where: { id: params.id } });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
        ) {
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 },
            );
        }
        console.error(`Failed to delete product ${params.id}:`, error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
