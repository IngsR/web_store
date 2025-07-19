import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from '@/lib/auth.server';

// Get wishlist items
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const wishlistItems = await prisma.wishlistItem.findMany({
            where: { userId: session.user.id },
            include: { product: true },
        });

        return NextResponse.json(wishlistItems);
    } catch (error) {
        console.error('Failed to fetch wishlist items:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}

// Add item to wishlist
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const { productId } = await req.json();

        // Check if item already exists in wishlist
        const existingItem = await prisma.wishlistItem.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        });

        if (existingItem) {
            return NextResponse.json(existingItem);
        }

        // Create new wishlist item
        const wishlistItem = await prisma.wishlistItem.create({
            data: {
                userId: session.user.id,
                productId,
            },
            include: { product: true },
        });

        return NextResponse.json(wishlistItem);
    } catch (error) {
        console.error('Failed to add item to wishlist:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}

// Delete wishlist item
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

        await prisma.wishlistItem.delete({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete wishlist item:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}
