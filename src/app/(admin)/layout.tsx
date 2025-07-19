'use client';

import { useAuth } from '@/hooks/use-auth';
import type { ReactNode } from 'react';
import AdminHeader from './_components/header';
import JumpingDotsLoader from '@/components/ui/jumping-dots-loader';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { isAdmin, isLoading } = useAuth();

    if (isLoading || !isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/40">
                <JumpingDotsLoader />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <AdminHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
                {children}
            </main>
        </div>
    );
}
