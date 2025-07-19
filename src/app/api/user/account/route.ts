import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import * as z from 'zod';
import { getServerSession } from '@/lib/auth.server';
import { uploadImageFromBase64, deleteImage } from '@/lib/blob-storage';

const accountUpdateSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6).optional().or(z.literal('')),
    profilePicture: z.string().optional(),
});

interface UserUpdateData {
    name: string;
    email: string;
    password?: string;
    profilePicture?: string;
}

export async function PUT(request: Request) {
    const session = await getServerSession();
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const validation = accountUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: 'Invalid input',
                    errors: validation.error.flatten(),
                },
                { status: 400 },
            );
        }

        const { name, email, password, profilePicture } = validation.data;

        if (email !== session.user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });
            if (existingUser && existingUser.id !== session.user.id) {
                return NextResponse.json(
                    { message: 'Email is already in use by another account.' },
                    { status: 409 },
                );
            }
        }

        const updateData: UserUpdateData = { name, email };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (profilePicture && profilePicture.startsWith('data:image/')) {
            const currentUser = await prisma.user.findUnique({
                where: { id: session.user.id },
            });

            if (currentUser?.profilePicture) {
                await deleteImage(currentUser.profilePicture);
            }
            updateData.profilePicture = await uploadImageFromBase64(
                profilePicture,
                'avatars',
            );
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
        });

        const { password: _, ...userForSession } = updatedUser;

        return NextResponse.json({ user: userForSession }, { status: 200 });
    } catch (error) {
        console.error('Account update error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
