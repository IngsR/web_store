import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from '@/lib/auth.server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

async function getUserId() {
    const session = await getServerSession();
    return session?.user?.id;
}

/**
 * GET: Mengambil semua item di keranjang pengguna.
 */
export async function GET() {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json([]);
    }

    try {
        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: {
                product: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(cartItems);
    } catch (error) {
        console.error('Failed to fetch cart:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}

/**
 * POST: Menambahkan item ke keranjang atau menambah kuantitas jika sudah ada.
 */
const postSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().min(1),
});

export async function POST(request: Request) {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const validation = postSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: 'Invalid input' },
                { status: 400 },
            );
        }
        const { productId, quantity } = validation.data;

        const cartItem = await prisma.cartItem.upsert({
            where: {
                userId_productId: { userId, productId },
            },
            update: {
                quantity: {
                    increment: quantity,
                },
            },
            create: {
                userId,
                productId,
                quantity,
            },
        });

        return NextResponse.json(cartItem, { status: 200 });
    } catch (error) {
        console.error('Failed to add to cart:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}

/**
 * PUT: Memperbarui kuantitas item di keranjang.
 */
const putSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().min(1),
});

export async function PUT(request: Request) {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const validation = putSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: 'Invalid input' },
                { status: 400 },
            );
        }
        const { productId, quantity } = validation.data;

        const result = await prisma.cartItem.updateMany({
            where: { userId, productId },
            data: { quantity },
        });

        if (result.count === 0) {
            return NextResponse.json(
                { message: 'Item not found in cart' },
                { status: 404 },
            );
        }

        return NextResponse.json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error('Failed to update cart:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}

/**
 * DELETE: Menghapus item dari keranjang.
 */
export async function DELETE(request: Request) {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { productId } = await request.json();
        await prisma.cartItem.deleteMany({
            where: { userId, productId },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Failed to delete from cart:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
