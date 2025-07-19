import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { transformProductForClient } from '@/lib/data/transform';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const excludeId = searchParams.get('exclude');

    if (!category || !excludeId) {
        return NextResponse.json(
            { message: 'Category and exclude parameters are required' },
            { status: 400 },
        );
    }

    try {
        const products = await prisma.product.findMany({
            where: {
                category,
                id: {
                    not: excludeId,
                },
            },
            take: 4,
        });

        return NextResponse.json(products.map(transformProductForClient));
    } catch (error) {
        console.error('Error fetching related products:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
