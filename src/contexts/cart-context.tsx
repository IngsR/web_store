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

interface CartAPIResponseItem {
    quantity: number;
    product: Product;
}

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
                const data: CartAPIResponseItem[] = await res.json();
                setCartItems(
                    data.map((item) => ({
                        ...item.product,
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
            const originalItems = [...cartItems];

            // Optimistic UI update: remove item immediately
            setCartItems((prevItems) =>
                prevItems.filter((item) => item.id !== productId),
            );

            try {
                const res = await fetch('/api/cart', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId }),
                    credentials: 'include',
                });

                if (!res.ok) {
                    // If API fails, revert the state
                    setCartItems(originalItems);
                    // TODO: Show a toast message for the error
                }
            } catch (error) {
                console.error('Failed to remove item from cart:', error);
                // Revert state on network error
                setCartItems(originalItems);
            }
        },
        [cartItems],
    );

    const updateQuantity = useCallback(
        async (productId: string, quantity: number) => {
            if (quantity <= 0) {
                removeFromCart(productId);
                return;
            }

            const originalItems = [...cartItems];

            // Optimistic UI update: change quantity immediately
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === productId ? { ...item, quantity } : item,
                ),
            );

            try {
                const res = await fetch('/api/cart', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId, quantity }),
                    credentials: 'include',
                });

                if (!res.ok) {
                    // If API fails, revert the state
                    setCartItems(originalItems);
                    // TODO: Show a toast message for the error
                }
            } catch (error) {
                console.error('Failed to update cart item quantity:', error);
                // Revert state on network error
                setCartItems(originalItems);
            }
        },
        [cartItems, removeFromCart],
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
            cartItems.reduce((total, item) => {
                // ✅ Use discount price if available for total calculation
                const price =
                    item.discountPrice && item.discountPrice > 0
                        ? item.discountPrice
                        : item.price;
                return total + price * item.quantity;
            }, 0),
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
