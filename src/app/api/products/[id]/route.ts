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
        });

        if (!existingProduct) {
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 },
            );
        }

        const oldImageUrls = existingProduct.images
            ? existingProduct.images.split(',')
            : [];
        const keptImageUrls = (newImageSources || []).filter((src: string) =>
            src.startsWith('http'),
        );

        const imagesToDelete = oldImageUrls.filter(
            (url: string) => !keptImageUrls.includes(url),
        );
        if (imagesToDelete.length > 0) {
            await Promise.all(
                imagesToDelete.map((url: string) => deleteImage(url)),
            );
        }

        const imagesToUpload = (newImageSources || []).filter((src: string) =>
            src.startsWith('data:image'),
        );

        const uploadedImageUrls = await Promise.all(
            imagesToUpload.map((base64: string) =>
                uploadImageFromBase64(base64, 'products'),
            ),
        );

        const finalImageUrls = [...keptImageUrls, ...uploadedImageUrls];

        const updatedProduct = await prisma.product.update({
            where: { id: params.id },
            data: {
                ...productData,

                images: finalImageUrls.join(','),
            },
        });

        const clientSafeProduct = transformProductForClient(updatedProduct);
        return NextResponse.json(clientSafeProduct);
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
        const deletedProduct = await prisma.product.delete({
            where: { id: params.id },
        });

        if (deletedProduct.images && deletedProduct.images.length > 0) {
            try {
                // Ubah string gambar yang dipisahkan koma menjadi array
                const imageUrls = deletedProduct.images.split(',');
                await Promise.all(imageUrls.map(deleteImage));
            } catch (imageError) {
                console.error(
                    `Failed to delete images for product ${deletedProduct.id}:`,
                    imageError,
                );
            }
        }

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
