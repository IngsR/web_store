'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This component now correctly redirects to the unified /account page
export default function AdminAccountRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/account');
    }, [router]);

    return null;
}
