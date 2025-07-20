'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/contexts/wishlist-context';
import type { Product } from '@/lib/types';

interface WishlistButtonProps {
    product: Product;
}

export default function WishlistButton({ product }: WishlistButtonProps) {
    const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
    const isProductInWishlist = isWishlisted(product.id);

    const handleToggleWishlist = () => {
        if (isProductInWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <Button
            variant="outline"
            size="lg"
            className="w-full md:w-auto flex-shrink-0"
            onClick={handleToggleWishlist}
        >
            <Heart
                className={cn(
                    'mr-2 h-5 w-5 transition-colors',
                    isProductInWishlist && 'fill-red-500 text-red-500',
                )}
            />
            {isProductInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </Button>
    );
}
