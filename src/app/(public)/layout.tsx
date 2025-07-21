import { Suspense } from 'react';
import JumpingDotsLoader from '@/components/ui/jumping-dots-loader';

/**
 * A simple loader component to be used as a fallback for Suspense.
 */
function PageLoader() {
    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <JumpingDotsLoader />
        </div>
    );
}

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}
