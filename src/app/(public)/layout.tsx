import { Suspense } from 'react';
import JumpingDotsLoader from '@/components/ui/jumping-dots-loader';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const dynamic = 'force-dynamic';

function PageLoader() {
    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
            <JumpingDotsLoader />
        </div>
    );
}

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main className="flex-grow">
                <Suspense fallback={<PageLoader />}>{children}</Suspense>
            </main>
            <Footer />
        </>
    );
}
