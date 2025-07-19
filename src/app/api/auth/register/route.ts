'use server';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import * as z from 'zod';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
});

const ADMIN_EMAIL = 'admin@example.com';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = registerSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: 'Invalid input',
                    errors: validation.error.formErrors.fieldErrors,
                },
                { status: 400 },
            );
        }

        const { name, email, password } = validation.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 409 },
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Set admin role if it matches ADMIN_EMAIL (case insensitive)
        const role =
            email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
                ? 'admin'
                : 'user';

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });

        // Don't return password hash
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json(
            { user: userWithoutPassword },
            { status: 201 },
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
