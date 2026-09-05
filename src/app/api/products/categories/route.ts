import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

let cachedCategories: { data: string[]; timestamp: number } | null = null;
const CATEGORIES_CACHE_TTL = 300 * 1000; // 5 menit

export async function GET() {
    try {
        const now = Date.now();
        if (cachedCategories && (now - cachedCategories.timestamp) < CATEGORIES_CACHE_TTL) {
            return NextResponse.json(cachedCategories.data, {
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                },
            });
        }

        const categories = await prisma.product.findMany({
            select: {
                category: true,
            },
            distinct: ['category'],
        });
        const categoryNames = categories.map(c => c.category);
        cachedCategories = { data: categoryNames, timestamp: now };

        return NextResponse.json(categoryNames, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
