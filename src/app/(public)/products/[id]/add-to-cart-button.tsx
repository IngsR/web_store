'use client';

import { useState, useContext } from 'react';
import { Loader2, ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/types';

interface AddToCartButtonProps {
    product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const { toast } = useToast();
    const { addToCart } = useCart();

    const handleAddToCart = async () => {
        if (isAdded) return;
        setIsLoading(true);

        try {
            await addToCart(product);

            toast({
                title: 'Sukses!',
                description: `${product.name} telah ditambahkan ke keranjang.`,
                variant: 'success',
            });

            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Tidak dapat menambahkan item ke keranjang.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleAddToCart}
            disabled={isLoading || isAdded}
            size="lg"
            className="w-full md:flex-1"
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isAdded ? (
                <Check className="mr-2 h-4 w-4" />
            ) : (
                <ShoppingCart className="mr-2 h-4 w-4" />
            )}
            {isAdded ? 'Ditambahkan' : 'Tambah ke Keranjang'}
        </Button>
    );
}
