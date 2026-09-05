'use client';

import React, {
    createContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import type { User } from '@/lib/types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (user: User, redirect?: boolean) => void;
    logout: () => Promise<void>;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

const AUTH_STORAGE_KEY = 'auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Initial state from localStorage for 0ms instant render
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // 1. Instant hydration from localStorage
    useEffect(() => {
        try {
            const cachedUser = localStorage.getItem(AUTH_STORAGE_KEY);
            if (cachedUser) {
                const parsed = JSON.parse(cachedUser);
                setUser(parsed);
                setIsLoading(false);
            }
        } catch {
            // Ignore parse errors
        }
    }, []);

    // 2. Validate session in background without blocking UI
    const fetchUser = useCallback(async () => {
        try {
            const session = await getSession();
            if (session?.user) {
                setUser(session.user);
                try {
                    localStorage.setItem(
                        AUTH_STORAGE_KEY,
                        JSON.stringify(session.user),
                    );
                } catch {}
            } else {
                setUser(null);
                try {
                    localStorage.removeItem(AUTH_STORAGE_KEY);
                } catch {}
            }
        } catch (error) {
            console.error('Failed to fetch user session', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = useCallback(
        (loggedInUser: User, redirect: boolean = true) => {
            setUser(loggedInUser);
            setIsLoading(false);
            try {
                localStorage.setItem(
                    AUTH_STORAGE_KEY,
                    JSON.stringify(loggedInUser),
                );
            } catch {}

            if (redirect) {
                if (loggedInUser.role === 'admin') {
                    router.push('/dashboard');
                } else {
                    router.push('/');
                }
            }
        },
        [router],
    );

    const logout = useCallback(async () => {
        try {
            setUser(null);
            try {
                localStorage.removeItem(AUTH_STORAGE_KEY);
            } catch {}

            // Notify contexts to clear local state
            const clearCartEvent = new CustomEvent('clearCart');
            const clearWishlistEvent = new CustomEvent('clearWishlist');
            document.dispatchEvent(clearCartEvent);
            document.dispatchEvent(clearWishlistEvent);

            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    }, [router]);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
            isAdmin: user?.role === 'admin',
            login,
            logout,
            isLoading,
        }),
        [user, login, logout, isLoading],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
