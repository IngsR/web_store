import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface PromoProductCardProps {
    product: Product;
}

export default function PromoProductCard({ product }: PromoProductCardProps) {
    const getValidImage = (img?: string) => {
        if (img && (img.startsWith('data:image') || img.startsWith('http') || img.startsWith('/'))) {
            return img;
        }
        return '/home/placeholder.jpg';
    };

    const hasDiscount = product.discountPrice && product.discountPrice > 0;
    const discountAmount = hasDiscount ? product.price - (product.discountPrice ?? 0) : 0;
    const discountPercent = hasDiscount ? Math.round((discountAmount / product.price) * 100) : 0;

    return (
        <div className="group h-full w-full rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow hover:border-primary/40 flex flex-col overflow-hidden">
            <Link
                href={`/products/${product.id}`}
                prefetch={true}
                className="flex flex-col h-full focus:outline-none"
            >
                {/* 1. Image Container - Compact, clean object-contain */}
                <div className="relative aspect-[4/3] w-full bg-secondary/30 p-2 overflow-hidden flex items-center justify-center">
                    <Image
                        src={getValidImage(product.images?.[0])}
                        alt={product.name}
                        fill
                        className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 48vw, (max-width: 1024px) 25vw, 20vw"
                    />

                    {/* Standard Promo Badge */}
                    <div className="absolute top-1.5 left-1.5 z-10 flex flex-col gap-0.5 items-start">
                        <span className="inline-flex items-center rounded bg-destructive px-1.5 py-0.5 text-[9px] font-bold text-destructive-foreground shadow-sm">
                            PROMO
                        </span>
                        {discountPercent > 0 && (
                            <span className="inline-flex items-center rounded bg-amber-500 px-1 py-0.2 text-[8px] font-extrabold text-black shadow-sm">
                                -{discountPercent}%
                            </span>
                        )}
                    </div>
                </div>

                {/* 2. Content Container - Compact */}
                <div className="p-2 sm:p-2.5 flex flex-col flex-grow justify-between bg-card text-foreground">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <Badge
                                variant={product.condition === 'Baru' ? 'default' : 'secondary'}
                                className="text-[9px] px-1 py-0 h-4 font-normal"
                            >
                                {product.condition}
                            </Badge>
                            {product.category && (
                                <Badge
                                    variant="outline"
                                    className="text-[9px] px-1 py-0 h-4 font-normal border-border hidden sm:inline-flex"
                                >
                                    {product.category}
                                </Badge>
                            )}
                        </div>

                        <h3 className="font-semibold text-[11px] sm:text-xs line-clamp-2 leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors min-h-[1.75rem]">
                            {product.name}
                        </h3>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-border/60">
                        {hasDiscount ? (
                            <div className="space-y-0.5">
                                <span className="text-[9px] text-muted-foreground line-through block">
                                    {formatCurrency(product.price)}
                                </span>
                                <p className="font-extrabold text-xs sm:text-sm text-destructive leading-tight">
                                    {formatCurrency(product.discountPrice!)}
                                </p>
                            </div>
                        ) : (
                            <p className="font-extrabold text-xs sm:text-sm text-primary leading-tight">
                                {formatCurrency(product.price)}
                            </p>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
