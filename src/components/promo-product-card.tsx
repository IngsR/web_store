import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface PromoProductCardProps {
    product: Product;
}

export default function PromoProductCard({ product }: PromoProductCardProps) {
    const getValidImage = (img?: string) => {
        if (img && (img.startsWith('data:image') || img.startsWith('http'))) {
            return img;
        }
        return '/home/placeholder.jpg';
    };

    return (
        <div className="group relative h-full overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl">
            <Link href={`/products/${product.id}`} className="block h-full">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={getValidImage(product.images?.[0])}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
                    <h3 className="font-headline text-xl font-bold line-clamp-2">
                        {product.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                        <Badge
                            variant={
                                product.condition === 'Baru'
                                    ? 'default'
                                    : 'secondary'
                            }
                            className="border-none bg-white/20 text-white backdrop-blur-sm"
                        >
                            {product.condition}
                        </Badge>
                        {product.fuelType && (
                            <Badge className="border-none bg-white/20 text-white backdrop-blur-sm">
                                {product.fuelType}
                            </Badge>
                        )}
                        {product.condition === 'Bekas' &&
                            product.mileage != null && (
                                <span className="font-medium">
                                    {formatNumber(product.mileage)} KM
                                </span>
                            )}
                    </div>
                    <div className="mt-4">
                        {product.discountPrice && product.discountPrice > 0 ? (
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-300 line-through">
                                    {formatCurrency(product.price)}
                                </span>
                                <span className="text-2xl font-bold text-amber-400">
                                    {formatCurrency(product.discountPrice)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-2xl font-bold">
                                {formatCurrency(product.price)}
                            </span>
                        )}
                    </div>
                    <div className="mt-6 flex items-center font-semibold text-amber-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Lihat Detail
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                </div>
            </Link>
        </div>
    );
}
