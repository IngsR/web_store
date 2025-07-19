import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth.server';
import * as z from 'zod';
import type { User as AppUser } from '@/lib/types';
import type { SessionPayload } from '@/lib/auth.types';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: 'Invalid input' },
                { status: 400 },
            );
        }

        const { email, password } = validation.data;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 },
            );
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 },
            );
        }

        const { password: _, ...userForSession } = user;

        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const sessionPayload: SessionPayload = {
            user: userForSession,
            expires,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(expires.getTime() / 1000),
        };
        const session = await encrypt(sessionPayload);

        const response = NextResponse.json({ user: userForSession });

        response.cookies.set({
            name: 'session',
            value: session,
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
        });

        console.log('Login successful for user:', {
            id: userForSession.id,
            email: userForSession.email,
            role: userForSession.role,
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
