
"use client";

import Link from 'next/link';
import { useWishlist } from '@/hooks/use-wishlist';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { HeartCrack } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistItems, wishlistCount } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Your Wishlist</h1>
        <p className="text-lg text-muted-foreground mt-2">
          {wishlistCount > 0 ? `You have ${wishlistCount} item(s) in your wishlist.` : 'Your wishlist is empty.'}
        </p>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <HeartCrack className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-headline text-2xl font-bold">Your Wishlist is Empty</h3>
            <p className="text-muted-foreground mt-2 mb-4">Explore products and save your favorites here.</p>
            <Button asChild>
                <Link href="/products">Discover Products</Link>
            </Button>
        </div>
      )}
    </div>
  );
}
