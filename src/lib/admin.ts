import { NextResponse } from 'next/server';
import { getServerSession } from './auth.server';

export async function checkAdminAccess() {
    const session = await getServerSession();

    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return session;
}
