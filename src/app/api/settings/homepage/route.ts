import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from '@/lib/auth.server';
import * as z from 'zod';

export const dynamic = 'force-dynamic';

const settingsSchema = z.object({
    featuredProductIds: z.array(z.string()),
    promoProductIds: z.array(z.string()),
});

export async function PUT(request: Request) {
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const validation = settingsSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: 'Invalid input',
                    errors: validation.error.formErrors.fieldErrors,
                },
                { status: 400 },
            );
        }

        const { featuredProductIds, promoProductIds } = validation.data;

        await prisma.$transaction(async (tx) => {
            await tx.product.updateMany({
                data: {
                    isFeatured: false,
                    isPromo: false,
                },
            });

            if (featuredProductIds.length > 0) {
                await tx.product.updateMany({
                    where: { id: { in: featuredProductIds } },
                    data: { isFeatured: true },
                });
            }

            if (promoProductIds.length > 0) {
                await tx.product.updateMany({
                    where: { id: { in: promoProductIds } },
                    data: { isPromo: true },
                });
            }
        });

        return NextResponse.json({ message: 'Homepage settings updated.' });
    } catch (error) {
        console.error('Failed to update homepage settings:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
