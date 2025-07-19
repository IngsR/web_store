'use server';

import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.product.findMany({
            select: {
                category: true,
            },
            distinct: ['category']
        });
        const categoryNames = categories.map(c => c.category);
        return NextResponse.json(categoryNames);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
