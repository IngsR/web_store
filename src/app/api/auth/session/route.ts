import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth.server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session) {
            return NextResponse.json(null);
        }

        return NextResponse.json(session);
    } catch (error) {
        console.error('Session fetch error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
