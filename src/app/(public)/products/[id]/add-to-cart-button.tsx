'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
    product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        // The useCart hook's addToCart function expects the entire product object.
        addToCart(product);
    };

    return (
        <Button size="lg" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Tambahkan ke Keranjang
        </Button>
    );
}
