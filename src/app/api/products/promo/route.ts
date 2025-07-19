import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { transformProductForClient } from '@/lib/data/transform';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: {
                isPromo: true,
            },

            take: 10,
        });

        return NextResponse.json(products.map(transformProductForClient));
    } catch (error) {
        console.error('Error fetching promo products:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
