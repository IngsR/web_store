import 'server-only';
import prisma from '@/lib/prisma';

/**
 * Mengambil semua banner dari database, diurutkan berdasarkan field 'order'.
 */
export async function getBanners() {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: {
                order: 'asc',
            },
        });
        return banners;
    } catch (error) {
        console.error('Failed to fetch banners:', error);
        return [];
    }
}
