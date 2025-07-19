'use client';

import type { SessionPayload } from './auth.types';

export async function getSession(): Promise<SessionPayload | null> {
    try {
        const res = await fetch('/api/auth/session');
        if (!res.ok) {
            return null;
        }
        return await res.json();
    } catch (error) {
        console.error('Failed to fetch session on client:', error);
        return null;
    }
}
