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
import PromoProductCard from '@/components/product/promo-product-card';
import type { Product } from '@/types';

interface PromoCarouselProps {
    products: Product[];
}

export default function PromoCarousel({ products }: PromoCarouselProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true }),
    );

    if (products.length === 0) {
        return (
            <div className="flex items-center justify-center h-28 rounded-xl border border-dashed border-border text-muted-foreground text-xs">
                Belum ada produk promo saat ini.
            </div>
        );
    }

    return (
        <div className="relative w-full">
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
                <CarouselContent className="-ml-2.5 sm:-ml-3">
                    {products.map((product) => (
                        <CarouselItem
                            key={product.id}
                            className="pl-2.5 sm:pl-3 basis-[46%] sm:basis-[32%] md:basis-[24%] lg:basis-[20%]"
                        >
                            <div className="h-full py-0.5">
                                <PromoProductCard product={product} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute -left-3 top-1/2 -translate-y-1/2 hidden md:flex h-8 w-8 bg-background/90 backdrop-blur shadow-sm border-border" />
                <CarouselNext className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:flex h-8 w-8 bg-background/90 backdrop-blur shadow-sm border-border" />
            </Carousel>
        </div>
    );
}
