import Link from 'next/link';
import Image from 'next/image';
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';
import { formatCurrency, formatNumber } from '@/lib/utils';
import WishlistButton from './wishlist-button';
import { Badge } from './ui/badge';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const getValidImage = (img?: string) => {
        if (img && (img.startsWith('data:image') || img.startsWith('http'))) {
            return img;
        }
        return '/home/placeholder.jpg';
    };

    return (
        <Card className="flex h-full flex-col overflow-hidden rounded-xl shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
            <Link
                href={`/products/${product.id}`}
                className="group flex h-full flex-col"
            >
                <CardHeader className="p-0">
                    <div className="aspect-square relative w-full bg-muted/20">
                        <Image
                            src={getValidImage(product.images?.[0])}
                            alt={product.name}
                            fill
                            className="object-contain p-2 object-center transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        <WishlistButton product={product} />
                    </div>
                </CardHeader>
                <CardContent className="p-3 flex-grow">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                        <Badge
                            variant={
                                product.condition === 'Baru'
                                    ? 'default'
                                    : 'secondary'
                            }
                        >
                            {product.condition}
                        </Badge>
                        {product.fuelType && (
                            <Badge
                                variant="outline"
                                className="border-primary/50 text-primary"
                            >
                                {product.fuelType}
                            </Badge>
                        )}
                        {product.condition === 'Bekas' &&
                            product.mileage != null && (
                                <span className="text-muted-foreground">
                                    {formatNumber(product.mileage)} KM
                                </span>
                            )}
                    </div>
                </CardContent>
                <CardFooter className="p-3 pt-0">
                    <div>
                        {product.discountPrice && product.discountPrice > 0 ? (
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                <p className="font-bold text-base text-destructive">
                                    {formatCurrency(product.discountPrice)}
                                </p>
                                <p className="text-xs text-muted-foreground line-through">
                                    {formatCurrency(product.price)}
                                </p>
                            </div>
                        ) : (
                            <p className="font-bold text-base">
                                {formatCurrency(product.price)}
                            </p>
                        )}
                    </div>
                </CardFooter>
            </Link>
        </Card>
    );
}

ProductCard.Skeleton = function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden rounded-xl">
            <Skeleton className="aspect-square w-full" />
            <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/2" />
            </div>
        </Card>
    );
};
