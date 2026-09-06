import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { transformProductForClient } from '@/lib/repositories/transform';

export async function GET() {
    try {
        let products = await prisma.product.findMany({
            where: {
                isFeatured: true,
            },
            take: 12,
            orderBy: { popularity: 'desc' },
        });

        if (products.length === 0) {
            products = await prisma.product.findMany({
                take: 12,
                orderBy: [
                    { popularity: 'desc' },
                    { createdAt: 'desc' },
                ],
            });
        }

        return NextResponse.json(products.map(transformProductForClient));
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
