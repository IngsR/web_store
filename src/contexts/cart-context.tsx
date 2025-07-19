'use client';

import React, {
    createContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from 'react';
import type { Product } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

export type CartItem = Product & { quantity: number };

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    loading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(
    undefined,
);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    // Fetch cart items from the server
    const fetchCartItems = useCallback(async () => {
        if (!isAuthenticated) {
            setCartItems([]);
            return;
        }

        try {
            setLoading(true);
            const res = await fetch('/api/cart', {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setCartItems(
                    data.map((item: any) => ({
                        ...item.product,
                        // API seharusnya sudah mengembalikan `images` sebagai array.
                        images: item.product.images,
                        quantity: item.quantity,
                    })),
                );
            }
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Load cart items when component mounts or auth state changes
    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems, isAuthenticated]);

    const addToCart = useCallback(
        async (product: Product) => {
            try {
                const res = await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        productId: product.id,
                        quantity: 1,
                    }),
                    credentials: 'include',
                });

                if (res.ok) {
                    await fetchCartItems(); // Refresh cart items
                }
            } catch (error) {
                console.error('Failed to add item to cart:', error);
            }
        },
        [fetchCartItems],
    );

    const removeFromCart = useCallback(
        async (productId: string) => {
            try {
                const res = await fetch('/api/cart', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId }),
                    credentials: 'include',
                });

                if (res.ok) {
                    await fetchCartItems(); // Refresh cart items
                }
            } catch (error) {
                console.error('Failed to remove item from cart:', error);
            }
        },
        [fetchCartItems],
    );

    const updateQuantity = useCallback(
        async (productId: string, quantity: number) => {
            if (quantity <= 0) {
                await removeFromCart(productId);
                return;
            }

            try {
                const res = await fetch('/api/cart', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId, quantity }),
                    credentials: 'include',
                });

                if (res.ok) {
                    await fetchCartItems(); // Refresh cart items
                }
            } catch (error) {
                console.error('Failed to update cart item quantity:', error);
            }
        },
        [fetchCartItems, removeFromCart],
    );

    const clearCart = useCallback(() => {
        setCartItems([]); // Just clear the local state
    }, []);

    const cartCount = useMemo(
        () => cartItems.reduce((count, item) => count + item.quantity, 0),
        [cartItems],
    );

    const cartTotal = useMemo(
        () =>
            cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0,
            ),
        [cartItems],
    );

    const value = useMemo(
        () => ({
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            loading,
        }),
        [
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            loading,
        ],
    );

    // Handle clear cart event
    useEffect(() => {
        const handleClearCart = () => {
            clearCart();
        };

        document.addEventListener('clearCart', handleClearCart);
        return () => {
            document.removeEventListener('clearCart', handleClearCart);
        };
    }, [clearCart]);

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}
