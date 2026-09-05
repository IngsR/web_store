'use client';

import { useAuth } from '@/hooks/use-auth';
import type { ReactNode } from 'react';
import AdminHeader from './_components/header';
import AdminSidebar from './_components/sidebar';
import AdminBottomNav from './_components/admin-bottom-nav';
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
        <div className="flex min-h-screen w-full bg-background text-foreground">
            {/* Desktop Sidebar */}
            <AdminSidebar />

            {/* Main Area */}
            <div className="flex flex-1 flex-col min-w-0">
                <AdminHeader />
                <main className="flex-1 pb-20 md:pb-8 bg-background">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <AdminBottomNav />
        </div>
    );
}
