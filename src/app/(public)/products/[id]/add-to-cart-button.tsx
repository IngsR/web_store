'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import type { Product } from '@/lib/types';
import { ShoppingCart, Loader2 } from 'lucide-react';

interface AddToCartButtonProps {
    product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const handleAddToCart = () => {
        setIsLoading(true);

        // Simulate server delay to make the animation visible
        setTimeout(() => {
            if (!isAuthenticated) {
                toast.error('Authentication Required', {
                    description: 'Please log in to add items to your cart.',
                });
                router.push('/login');
                setIsLoading(false);
                return;
            }

            addToCart(product);
            toast.success('Added to cart', {
                description: `${product.name} is now in your cart.`,
            });
            setIsLoading(false);
        }, 500); // 500ms delay
    };

    return (
        <Button size="lg" onClick={handleAddToCart} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
                <ShoppingCart className="mr-2 h-5 w-5" />
            )}
            {isLoading ? 'Adding...' : 'Add to Cart'}
        </Button>
    );
}
