import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { AppProviders } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
    title: 'Ing Store',
    description: 'A modern marketplace for urban fashion.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className={cn('font-body antialiased')}>
                <AppProviders>
                    <div className="relative flex min-h-screen flex-col bg-background">
                        {children}
                    </div>
                    <Toaster />
                </AppProviders>
            </body>
        </html>
    );
}
