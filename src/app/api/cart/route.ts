import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from '@/lib/auth.server';

// Get cart items
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const cartItems = await prisma.cartItem.findMany({
            where: { userId: session.user.id },
            include: { product: true },
        });

        return NextResponse.json(cartItems);
    } catch (error) {
        console.error('Failed to fetch cart items:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}

// Add item to cart
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const { productId, quantity = 1 } = await req.json();

        // Check if item already exists in cart
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        });

        let cartItem;
        if (existingItem) {
            // Update quantity
            cartItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
                include: { product: true },
            });
        } else {
            // Create new cart item
            cartItem = await prisma.cartItem.create({
                data: {
                    userId: session.user.id,
                    productId,
                    quantity,
                },
                include: { product: true },
            });
        }

        return NextResponse.json(cartItem);
    } catch (error) {
        console.error('Failed to add item to cart:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}

// Update cart item
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const { productId, quantity } = await req.json();

        const cartItem = await prisma.cartItem.update({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
            data: { quantity },
            include: { product: true },
        });

        return NextResponse.json(cartItem);
    } catch (error) {
        console.error('Failed to update cart item:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}

// Delete cart item
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const { productId } = await req.json();

        await prisma.cartItem.delete({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete cart item:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}
