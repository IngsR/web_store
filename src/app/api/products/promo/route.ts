import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { transformProductForClient } from '@/lib/repositories/transform';

export async function GET() {
    try {
        let products = await prisma.product.findMany({
            where: {
                isPromo: true,
            },
            take: 10,
            orderBy: { popularity: 'desc' },
        });

        if (products.length === 0) {
            products = await prisma.product.findMany({
                where: {
                    discountPrice: {
                        gt: 0,
                    },
                },
                take: 10,
                orderBy: { popularity: 'desc' },
            });
        }

        return NextResponse.json(products.map(transformProductForClient));
    } catch (error) {
        console.error('Error fetching promo products:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
