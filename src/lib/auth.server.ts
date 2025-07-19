import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import type { SessionPayload } from './auth.types';
import type { NextRequest } from 'next/server';

const secretKey = process.env.AUTH_SECRET;

if (!secretKey || secretKey.length === 0) {
    throw new Error(
        'The environment variable AUTH_SECRET is not set or is empty.',
    );
}

const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey);
}

export async function decrypt(token: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(token, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.error('Failed to verify session:', error);
        return null;
    }
}

export async function getServerSession() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) return null;

    const session = await decrypt(sessionCookie);
    if (!session) return null;

    if (new Date(session.expires) < new Date()) {
        return null;
    }
    return session as SessionPayload;
}
