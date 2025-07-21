'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/hooks/use-auth';
import { useWishlist } from '@/hooks/use-wishlist';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface WishlistButtonProps {
    product: Product;
    className?: string;
}

export default function WishlistButton({
    product,
    className,
}: WishlistButtonProps) {
    const { isAuthenticated } = useAuth();
    const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
    const { toast } = useToast();

    const isInWishlist = isWishlisted(product.id);

    const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast({
                title: 'Silakan Login',
                description:
                    'Anda harus login untuk menambahkan item ke wishlist.',
                variant: 'destructive',
                action: (
                    <Button asChild variant="secondary" size="sm">
                        <Link href="/login">Login</Link>
                    </Button>
                ),
            });
            return;
        }

        if (isInWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                'absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white',
                className,
            )}
            onClick={handleWishlistToggle}
            aria-label={
                isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
            }
        >
            <Heart
                className={cn(
                    'h-5 w-5 text-gray-500 transition-all',
                    isInWishlist && 'fill-red-500 text-red-500',
                )}
            />
        </Button>
    );
}
