import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from '@/lib/auth.server';
import { revalidateHomepageSettings } from '@/lib/actions/revalidate';

export const dynamic = 'force-dynamic';

/**
 * PUT: Memperbarui produk mana yang menjadi promo dan unggulan.
 */
export async function PUT(request: Request) {
    const session = await getServerSession();
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { featuredProductIds, promoProductIds } = body;

        if (
            !Array.isArray(featuredProductIds) ||
            !Array.isArray(promoProductIds)
        ) {
            return NextResponse.json(
                { message: 'Invalid input' },
                { status: 400 },
            );
        }

        await prisma.$transaction([
            prisma.product.updateMany({
                data: { isFeatured: false, isPromo: false },
            }),

            prisma.product.updateMany({
                where: { id: { in: featuredProductIds } },
                data: { isFeatured: true },
            }),

            prisma.product.updateMany({
                where: { id: { in: promoProductIds } },
                data: { isPromo: true },
            }),
        ]);

        await revalidateHomepageSettings();

        return NextResponse.json({ message: 'Homepage settings updated' });
    } catch (error) {
        console.error('Failed to update homepage settings:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
