import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from '@/lib/auth.server';

export async function middleware(request: NextRequest) {
    const session = await getServerSession();
    const { pathname } = request.nextUrl;

    const isAuthPage =
        pathname.startsWith('/login') || pathname.startsWith('/register');

    // If the user is on an auth page and is already authenticated, redirect them.
    if (isAuthPage) {
        if (session) {
            return NextResponse.redirect(new URL('/home', request.url));
        }
        return NextResponse.next();
    }

    // Protect admin and user-specific routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/account')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (
            pathname.startsWith('/dashboard') &&
            session.user.role !== 'admin'
        ) {
            return NextResponse.redirect(new URL('/home', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/account/:path*', '/login', '/register'],
};
