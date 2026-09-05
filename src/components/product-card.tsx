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
import { Calculator } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const getValidImage = (img?: string) => {
        if (img && (img.startsWith('data:image') || img.startsWith('http') || img.startsWith('/'))) {
            return img;
        }
        return '/home/placeholder.jpg';
    };

    const effectivePrice = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
    // Estimasi cicilan per bulan 5 tahun (60 bulan) dengan DP 20% dan bunga 7% flat
    const estimatedInstallment = Math.round(((effectivePrice * 0.8) * (1 + 0.07 * 5)) / 60);

    return (
        <Card className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg active:scale-[0.99]">
            <div className="relative w-full">
                <Link
                    href={`/products/${product.id}`}
                    prefetch={true}
                    className="block aspect-[4/3] w-full overflow-hidden bg-muted/20 relative"
                >
                    <Image
                        src={getValidImage(product.images?.[0])}
                        alt={product.name}
                        fill
                        className="object-contain p-2 sm:p-2.5 transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                </Link>
                <div className="absolute top-2 right-2 z-10">
                    <WishlistButton product={product} />
                </div>
                {product.discountPrice && product.discountPrice > 0 && (
                    <div className="absolute top-2 left-2 z-10">
                        <span className="inline-flex items-center rounded-md bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground shadow-sm">
                            PROMO
                        </span>
                    </div>
                )}
            </div>

            <Link
                href={`/products/${product.id}`}
                prefetch={true}
                className="flex flex-1 flex-col justify-between p-2.5 sm:p-3.5 focus:outline-none"
            >
                <div className="space-y-1.5">
                    <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors min-h-[2.25rem]">
                        {product.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-1">
                        <Badge
                            variant={
                                product.condition === 'Baru'
                                    ? 'default'
                                    : 'secondary'
                            }
                            className="text-[10px] px-1.5 py-0 h-4 sm:h-5 font-normal"
                        >
                            {product.condition}
                        </Badge>
                        {product.fuelType && (
                            <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 h-4 sm:h-5 border-primary/40 text-primary font-normal hidden sm:inline-flex"
                            >
                                {product.fuelType}
                            </Badge>
                        )}
                        {product.condition === 'Bekas' && product.mileage != null && (
                            <span className="text-[10px] sm:text-xs text-muted-foreground">
                                {formatNumber(product.mileage)} KM
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-border/50">
                    {product.discountPrice && product.discountPrice > 0 ? (
                        <div className="space-y-0.5">
                            <p className="text-[10px] sm:text-xs text-muted-foreground line-through">
                                {formatCurrency(product.price)}
                            </p>
                            <p className="font-bold text-xs sm:text-sm md:text-base text-destructive leading-tight">
                                {formatCurrency(product.discountPrice)}
                            </p>
                        </div>
                    ) : (
                        <p className="font-bold text-xs sm:text-sm md:text-base text-primary leading-tight">
                            {formatCurrency(product.price)}
                        </p>
                    )}

                    {/* Cicilan badge hint */}
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-dashed border-border/60">
                        <span className="flex items-center gap-1 text-primary font-medium truncate">
                            <Calculator className="h-3 w-3 inline shrink-0" />
                            <span className="truncate">Cicilan {formatCurrency(estimatedInstallment)}/bln</span>
                        </span>
                    </div>
                </div>
            </Link>
        </Card>
    );
}

ProductCard.Skeleton = function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden rounded-xl border border-border/60">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-2.5 sm:p-3.5 space-y-2">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
            </div>
        </Card>
    );
};
