import { NextResponse } from 'next/server';
import { getServerSession } from './auth.server';
import type { SessionPayload } from './auth.types';

export async function checkAdminAccess() {
    const session = await getServerSession();

    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return session;
}
