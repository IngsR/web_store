'use client';

import React, {
    createContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import type { User } from '@/lib/types';
import JumpingDotsLoader from '@/components/ui/jumping-dots-loader';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const fetchUser = useCallback(async () => {
        setIsLoading(true);
        try {
            const session = await getSession();
            if (session?.user) {
                setUser(session.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user session', error);
            setUser(null);
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
            if (redirect) {
                if (loggedInUser.role === 'admin') {
                    router.push('/dashboard');
                } else {
                    // Redirect to home or a previous page if stored
                    router.push('/home');
                }
            }
        },
        [router],
    );

    const logout = useCallback(async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });

            // We don't need to clear localStorage anymore since data is in the database
            // Just notify contexts to clear their local state
            const clearCartEvent = new CustomEvent('clearCart');
            const clearWishlistEvent = new CustomEvent('clearWishlist');
            document.dispatchEvent(clearCartEvent);
            document.dispatchEvent(clearWishlistEvent);

            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    }, [router]);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: !isLoading && !!user,
            isAdmin: !isLoading && user?.role === 'admin',
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
