'use client';

import React, {
    createContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from 'react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export interface WishlistContextType {
    wishlistItems: Product[];
    wishlistCount: number;
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isWishlisted: (productId: string) => boolean;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(
    undefined,
);

/**
 * Custom hook to use the WishlistContext.
 */
export const useWishlist = () => {
    const context = React.useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        try {
            const storedWishlist = localStorage.getItem('wishlist');
            if (storedWishlist) {
                setWishlistItems(JSON.parse(storedWishlist));
            }
        } catch (error) {
            console.error('Failed to parse wishlist from localStorage', error);
            localStorage.removeItem('wishlist');
        }
    }, []);

    useEffect(() => {
        const handleClear = () => {
            setWishlistItems([]);
            localStorage.removeItem('wishlist');
        };
        document.addEventListener('clearWishlist', handleClear);
        return () => document.removeEventListener('clearWishlist', handleClear);
    }, []);

    const updateWishlist = useCallback((newWishlist: Product[]) => {
        setWishlistItems(newWishlist);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    }, []);

    const addToWishlist = useCallback(
        (product: Product) => {
            if (wishlistItems.some((item) => item.id === product.id)) return;
            updateWishlist([...wishlistItems, product]);
            toast({
                title: 'Added to Wishlist',
                description: `${product.name} has been added.`,
                variant: 'success',
            });
        },
        [wishlistItems, updateWishlist, toast],
    );

    const removeFromWishlist = useCallback(
        (productId: string) => {
            const product = wishlistItems.find((item) => item.id === productId);
            updateWishlist(
                wishlistItems.filter((item) => item.id !== productId),
            );
            if (product) {
                toast({
                    title: 'Removed from Wishlist',
                    description: `${product.name} has been removed.`,
                });
            }
        },
        [wishlistItems, updateWishlist, toast],
    );

    const isWishlisted = useCallback(
        (productId: string) => {
            return wishlistItems.some((item) => item.id === productId);
        },
        [wishlistItems],
    );

    const value = useMemo(
        () => ({
            wishlistItems,
            wishlistCount: wishlistItems.length,
            addToWishlist,
            removeFromWishlist,
            isWishlisted,
        }),
        [wishlistItems, addToWishlist, removeFromWishlist, isWishlisted],
    );

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
}
