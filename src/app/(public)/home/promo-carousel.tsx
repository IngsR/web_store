'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import PromoProductCard from '@/components/promo-product-card';
import type { Product } from '@/lib/types';

interface PromoCarouselProps {
    products: Product[];
}

export default function PromoCarousel({ products }: PromoCarouselProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true }),
    );

    if (products.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
                Belum ada mobil promo saat ini.
            </div>
        );
    }

    return (
        <div className="relative w-full px-4 md:px-12">
            <Carousel
                plugins={[plugin.current]}
                opts={{
                    align: 'start',
                    loop: products.length > 4,
                }}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent className="-ml-4">
                    {products.map((product) => (
                        <CarouselItem
                            key={product.id}
                            className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
                        >
                            <div className="p-1 h-full aspect-[3/4]">
                                <PromoProductCard product={product} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex" />
                <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex" />
            </Carousel>
        </div>
    );
}
