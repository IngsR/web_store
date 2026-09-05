'use client';

import React, {
    createContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from 'react';
import type { Product } from '@/types';
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

const CART_STORAGE_KEY = 'cart_items';

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    // 1. Instant hydration from localStorage on mount (0ms latency)
    useEffect(() => {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            if (saved) {
                setCartItems(JSON.parse(saved));
            }
        } catch {}
    }, []);

    const persistCartLocally = useCallback((items: CartItem[]) => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch {}
    }, []);

    // 2. Background sync with server cart if authenticated (non-blocking)
    const syncWithServer = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            const res = await fetch('/api/cart', {
                credentials: 'include',
            });
            if (res.ok) {
                const data: CartAPIResponseItem[] = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    const serverItems = data.map((item) => ({
                        ...item.product,
                        quantity: item.quantity,
                    }));
                    setCartItems(serverItems);
                    persistCartLocally(serverItems);
                }
            }
        } catch (error) {
            console.error('Background cart sync error:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, persistCartLocally]);

    useEffect(() => {
        if (isAuthenticated) {
            syncWithServer();
        }
    }, [isAuthenticated, syncWithServer]);

    // 3. Add to Cart: instant optimistic local update
    const addToCart = useCallback(
        (product: Product) => {
            setCartItems((prev) => {
                const existingIndex = prev.findIndex(
                    (item) => item.id === product.id,
                );
                let updated: CartItem[];
                if (existingIndex >= 0) {
                    updated = [...prev];
                    updated[existingIndex] = {
                        ...updated[existingIndex],
                        quantity: updated[existingIndex].quantity + 1,
                    };
                } else {
                    updated = [...prev, { ...product, quantity: 1 }];
                }
                persistCartLocally(updated);
                return updated;
            });

            // Async background server sync if logged in
            if (isAuthenticated) {
                fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        productId: product.id,
                        quantity: 1,
                    }),
                    credentials: 'include',
                }).catch(() => {});
            }
        },
        [isAuthenticated, persistCartLocally],
    );

    // 4. Remove from Cart: instant optimistic update
    const removeFromCart = useCallback(
        (productId: string) => {
            setCartItems((prev) => {
                const updated = prev.filter((item) => item.id !== productId);
                persistCartLocally(updated);
                return updated;
            });

            if (isAuthenticated) {
                fetch('/api/cart', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId }),
                    credentials: 'include',
                }).catch(() => {});
            }
        },
        [isAuthenticated, persistCartLocally],
    );

    // 5. Update Quantity: instant optimistic update
    const updateQuantity = useCallback(
        (productId: string, quantity: number) => {
            if (quantity <= 0) {
                removeFromCart(productId);
                return;
            }

            setCartItems((prev) => {
                const updated = prev.map((item) =>
                    item.id === productId ? { ...item, quantity } : item,
                );
                persistCartLocally(updated);
                return updated;
            });

            if (isAuthenticated) {
                fetch('/api/cart', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId, quantity }),
                    credentials: 'include',
                }).catch(() => {});
            }
        },
        [isAuthenticated, persistCartLocally, removeFromCart],
    );

    const clearCart = useCallback(() => {
        setCartItems([]);
        try {
            localStorage.removeItem(CART_STORAGE_KEY);
        } catch {}
    }, []);

    const cartCount = useMemo(
        () => cartItems.reduce((count, item) => count + item.quantity, 0),
        [cartItems],
    );

    const cartTotal = useMemo(
        () =>
            cartItems.reduce((total, item) => {
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

    // Handle clear cart event (e.g. on logout)
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
